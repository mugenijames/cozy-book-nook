// backend/src/services/courseAccess.service.ts

import { prisma } from "../lib/prisma"; // adjust path if your prisma client is elsewhere

/**
 * Recalculate paid total and grant access if threshold is met.
 */
export async function recalculateEnrollmentAccess(enrollmentId: string) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: true,
      payments: {
        where: { status: "CONFIRMED" },
      },
    },
  });

  if (!enrollment?.course) {
    throw new Error("Enrollment not found");
  }

  const course = enrollment.course;
  const totalPaid = enrollment.payments.reduce(
    (sum, p) => sum + p.amountCents,
    0
  );

  const priceCents = course.priceCents ?? 0;
  const unlockPercent = course.unlockPercent ?? 50;
  const requiredCents = Math.ceil((priceCents * unlockPercent) / 100);

  const isFree = course.isFree || priceCents === 0;
  const shouldGrantAccess = isFree || totalPaid >= requiredCents;

  let paymentStatus: "UNPAID" | "PARTIAL" | "PAID" = "UNPAID";
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
    requiredCents,
    remainingToUnlock: Math.max(0, requiredCents - totalPaid),
    accessGranted: shouldGrantAccess,
  };
}

/**
 * Record a confirmed payment and recalculate access.
 */
export async function confirmCoursePayment(params: {
  enrollmentId: string;
  amountCents: number;
  method?: string;
  transactionCode?: string;
  notes?: string;
}) {
  const payment = await prisma.coursePayment.create({
    data: {
      enrollmentId: params.enrollmentId,
      amountCents: params.amountCents,
      method: params.method ?? "MANUAL",
      transactionCode: params.transactionCode,
      notes: params.notes,
      status: "CONFIRMED",
      confirmedAt: new Date(),
    },
  });

  const result = await recalculateEnrollmentAccess(params.enrollmentId);

  return {
    payment,
    ...result,
  };
}

/**
 * Backend access check — use on every protected lesson/material route.
 */
export async function canAccessCourseContent(params: {
  courseId: string;
  email: string;
  lessonId?: string;
}) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
  });

  if (!course) {
    return { allowed: false, reason: "Course not found" };
  }

  if (course.isFree) {
    return { allowed: true, reason: "Free course" };
  }

  // Free preview lesson
  if (params.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
    });

    if (lesson?.isFreePreview) {
      return { allowed: true, reason: "Free preview lesson" };
    }
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      courseId_email: {
        courseId: params.courseId,
        email: params.email.toLowerCase().trim(),
      },
    },
  });

  if (!enrollment) {
    return { allowed: false, reason: "Not enrolled" };
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