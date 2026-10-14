// backend/src/controllers/courseAccess.controller.ts

import { Request, Response } from "express";
import {
  canAccessCourseContent,
  confirmCoursePayment,
  recalculateEnrollmentAccess,
} from "../services/courseAccess.service";
import { prisma } from "../lib/prisma"; // adjust path if needed

/* ============================================================
   CHECK ACCESS STATUS
   GET /api/courses/:courseId/access?email=
============================================================ */

export const checkCourseAccess = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const email = (req.query.email as string)?.toLowerCase()?.trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "email query param is required",
      });
    }

    const access = await canAccessCourseContent({
      courseId,
      email,
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        priceCents: true,
        unlockPercent: true,
        isFree: true,
        currency: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    const priceCents = course.priceCents ?? 0;
    const unlockPercent = course.unlockPercent ?? 50;
    const requiredCents = Math.ceil((priceCents * unlockPercent) / 100);
    const amountPaid = access.enrollment?.amountPaidCents ?? 0;

    return res.json({
      success: true,
      allowed: access.allowed,
      reason: access.reason,
      course: {
        id: course.id,
        title: course.title,
        priceCents,
        unlockPercent,
        isFree: course.isFree,
        currency: course.currency,
      },
      enrollment: access.enrollment
        ? {
            id: access.enrollment.id,
            paymentStatus: access.enrollment.paymentStatus,
            amountPaidCents: access.enrollment.amountPaidCents,
            accessGranted: access.enrollment.accessGranted,
            accessGrantedAt: access.enrollment.accessGrantedAt,
          }
        : null,
      requiredCents,
      remainingToUnlock: Math.max(0, requiredCents - amountPaid),
    });
  } catch (error) {
    console.error("checkCourseAccess error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to check course access",
    });
  }
};

/* ============================================================
   CONFIRM PAYMENT (admin or system)
   POST /api/courses/enrollments/:enrollmentId/confirm-payment
============================================================ */

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { enrollmentId } = req.params;
    const { amountCents, method, transactionCode, notes } = req.body;

    if (!amountCents || Number(amountCents) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid amountCents is required",
      });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: "Enrollment not found",
      });
    }

    const result = await confirmCoursePayment({
      enrollmentId,
      amountCents: Number(amountCents),
      method: method || "MANUAL",
      transactionCode,
      notes,
    });

    return res.json({
      success: true,
      message: result.accessGranted
        ? "Payment confirmed. Access granted."
        : "Payment confirmed. Access still locked until threshold is met.",
      payment: result.payment,
      enrollment: result.enrollment,
      totalPaid: result.totalPaid,
      requiredCents: result.requiredCents,
      remainingToUnlock: result.remainingToUnlock,
      accessGranted: result.accessGranted,
    });
  } catch (error) {
    console.error("confirmPayment error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to confirm payment",
    });
  }
};

/* ============================================================
   RECALCULATE ACCESS
   POST /api/courses/enrollments/:enrollmentId/recalculate
============================================================ */

export const recalculateAccess = async (req: Request, res: Response) => {
  try {
    const { enrollmentId } = req.params;

    const result = await recalculateEnrollmentAccess(enrollmentId);

    return res.json({
      success: true,
      enrollment: result.enrollment,
      totalPaid: result.totalPaid,
      requiredCents: result.requiredCents,
      remainingToUnlock: result.remainingToUnlock,
      accessGranted: result.accessGranted,
    });
  } catch (error: any) {
    console.error("recalculateAccess error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to recalculate access",
    });
  }
};

/* ============================================================
   GET PROTECTED LESSON
   GET /api/courses/:courseId/lessons/:lessonId?email=
============================================================ */

export const getProtectedLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, lessonId } = req.params;
    const email = (req.query.email as string)?.toLowerCase()?.trim();

    if (!email) {
      return res.status(401).json({
        success: false,
        error: "email is required",
      });
    }

    const access = await canAccessCourseContent({
      courseId,
      email,
      lessonId,
    });

    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        reason: access.reason,
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson || !lesson.isPublished) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("getProtectedLesson error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch lesson",
    });
  }
};