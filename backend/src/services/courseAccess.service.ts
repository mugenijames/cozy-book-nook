// backend/src/services/courseAccess.service.ts

import { prisma } from "../lib/prisma";

/**
 * Recalculate confirmed payments and determine course access.
 */
export async function recalculateEnrollmentAccess(
  enrollmentId: string
) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: true,
      payments: {
        where: { status: "CONFIRMED" },
      },
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const course = enrollment.course;
  const totalPaid = enrollment.payments.reduce(
    (sum, payment) => sum + payment.amountCents,
    0
  );

  const priceCents = Math.max(0, course.priceCents ?? 0);

  // Keep the threshold within the valid percentage range.
  const unlockPercent = Math.min(
    100,
    Math.max(0, course.unlockPercent ?? 50)
  );

  const requiredCents = Math.ceil(
    (priceCents * unlockPercent) / 100
  );

  const isFree = course.isFree || priceCents === 0;

  const shouldGrantAccess =
    isFree || totalPaid >= requiredCents;

  let paymentStatus: "UNPAID" | "PARTIAL" | "PAID";

  if (totalPaid <= 0) {
    paymentStatus = "UNPAID";
  } else if (priceCents > 0 && totalPaid >= priceCents) {
    paymentStatus = "PAID";
  } else {
    paymentStatus = "PARTIAL";
  }

  const updated = await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: {
      amountPaidCents: totalPaid,
      paymentStatus,
      accessGranted: shouldGrantAccess,
      accessGrantedAt: shouldGrantAccess
        ? enrollment.accessGrantedAt ?? new Date()
        : null,
    },
  });

  return {
    enrollment: updated,
    totalPaid,
    priceCents,
    requiredCents,
    remainingToUnlock: Math.max(
      0,
      requiredCents - totalPaid
    ),
    accessGranted: shouldGrantAccess,
  };
}

/**
 * Record a payment that has ALREADY been verified by a
 * trusted server-side payment verification process.
 *
 * Do not expose this function through an unprotected endpoint.
 */
export async function confirmCoursePayment(params: {
  enrollmentId: string;
  amountCents: number;
  method?: string;
  transactionCode?: string;
  notes?: string;
}) {
  if (
    !Number.isSafeInteger(params.amountCents) ||
    params.amountCents <= 0
  ) {
    throw new Error("Payment amount must be a positive integer");
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: params.enrollmentId },
    select: { id: true },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const transactionCode = params.transactionCode?.trim();

  if (transactionCode) {
    const existingPayment = await prisma.coursePayment.findFirst({
      where: { transactionCode },
      select: { id: true },
    });

    if (existingPayment) {
      throw new Error("This transaction has already been recorded");
    }
  }

  const payment = await prisma.coursePayment.create({
    data: {
      enrollmentId: params.enrollmentId,
      amountCents: params.amountCents,
      method: params.method ?? "MANUAL",
      transactionCode: transactionCode || undefined,
      notes: params.notes,
      status: "CONFIRMED",
      confirmedAt: new Date(),
    },
  });

  const result = await recalculateEnrollmentAccess(
    params.enrollmentId
  );

  return {
    payment,
    ...result,
  };
}

/**
 * Check access to a course or a particular lesson.
 */
export async function canAccessCourseContent(params: {
  courseId: string;
  email: string;
  lessonId?: string;
}) {
  const email = params.email.trim().toLowerCase();

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    select: {
      id: true,
      isFree: true,
      priceCents: true,
    },
  });

  if (!course) {
    return {
      allowed: false,
      reason: "Course not found",
    };
  }

  // Free courses and zero-priced courses use the same rule.
  if (course.isFree || (course.priceCents ?? 0) <= 0) {
    return {
      allowed: true,
      reason: "Free course",
    };
  }

  // Validate the lesson belongs to this course before
  // allowing its free preview.
  if (params.lessonId) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        module: {
          courseId: params.courseId,
        },
        isPublished: true,
      },
      select: {
        id: true,
        isFreePreview: true,
      },
    });

    if (!lesson) {
      return {
        allowed: false,
        reason: "Lesson not found or not published",
      };
    }

    if (lesson.isFreePreview) {
      return {
        allowed: true,
        reason: "Free preview lesson",
      };
    }
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      courseId_email: {
        courseId: params.courseId,
        email,
      },
    },
  });

  if (!enrollment) {
    return {
      allowed: false,
      reason: "Not enrolled",
    };
  }

  if (enrollment.accessGranted) {
    return {
      allowed: true,
      reason: "Access granted",
      enrollment,
    };
  }

  return {
    allowed: false,
    reason: "Payment threshold not met",
    enrollment,
  };
}
