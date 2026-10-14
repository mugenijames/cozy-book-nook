// backend/src/routes/course.routes.ts

import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import {
  canAccessCourseContent,
  confirmCoursePayment,
} from "../services/courseAccess.service";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/* ============================================================
   HELPERS
============================================================ */

/** Safely get a single path param as string */
const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const notFound = (res: Response, message = "Resource not found") =>
  res.status(404).json({ success: false, error: message });

const serverError = (res: Response, message = "Internal server error") =>
  res.status(500).json({ success: false, error: message });

/* ============================================================
   PUBLIC ROUTES
============================================================ */

/**
 * GET /api/courses
 * List all published courses
 */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        thumbnailUrl: true,
        category: true,
        level: true,
        duration: true,
        estimatedHours: true,
        priceCents: true,
        currency: true,
        isFree: true,
        featured: true,
        unlockPercent: true,
        instructorName: true,
        instructorTitle: true,
        instructorImage: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      count: courses.length,
      courses,
    });
  })
);

/**
 * GET /api/courses/:slug
 * Get a single published course by slug
 */
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({
      where: { slug: param(req.params.slug) },
      include: {
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { position: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                durationMinutes: true,
                position: true,
                isFreePreview: true,
                scheduledAt: true,
                // Intentionally omit protected content fields
              },
            },
          },
        },
      },
    });

    if (!course || !course.isPublished) {
      return notFound(res, "Course not found");
    }

    return res.json({ success: true, course });
  })
);

/* ============================================================
   LEARNER ROUTES
============================================================ */

/**
 * POST /api/courses/:courseId/enrol
 */
router.post(
  "/:courseId/enrol",
  asyncHandler(async (req, res) => {
    const { fullName, email, phone } = req.body;

    if (!fullName?.trim() || !email?.trim()) {
      return badRequest(res, "fullName and email are required");
    }

    const course = await prisma.course.findUnique({
      where: { id: param(req.params.courseId) },
    });

    if (!course || !course.isPublished) {
      return notFound(res, "Course not found");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_email: {
          courseId: course.id,
          email: normalizedEmail,
        },
      },
    });

    if (existing) {
      return res.json({
        success: true,
        alreadyEnrolled: true,
        enrollment: existing,
      });
    }

    const isFree = course.isFree || (course.priceCents ?? 0) === 0;

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId: course.id,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        paymentStatus: isFree ? "PAID" : "UNPAID",
        amountPaidCents: 0,
        accessGranted: isFree,
        accessGrantedAt: isFree ? new Date() : null,
      },
    });

    return res.status(201).json({
      success: true,
      alreadyEnrolled: false,
      enrollment,
    });
  })
);

/**
 * POST /api/courses/enrollments/:enrollmentId/payments
 */
router.post(
  "/enrollments/:enrollmentId/payments",
  asyncHandler(async (req, res) => {
    const { amountCents, method, transactionCode, notes } = req.body;

    if (!amountCents || Number(amountCents) <= 0) {
      return badRequest(res, "A valid amountCents is required");
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: param(req.params.enrollmentId) },
    });

    if (!enrollment) {
      return notFound(res, "Enrollment not found");
    }

    const result = await confirmCoursePayment({
      enrollmentId: enrollment.id,
      amountCents: Number(amountCents),
      method,
      transactionCode,
      notes,
    });

    return res.json({
      success: true,
      message: result.accessGranted
        ? "Payment recorded. Course access granted."
        : "Payment recorded. Access will unlock once the required threshold is met.",
      payment: result.payment,
      enrollment: result.enrollment,
      totalPaid: result.totalPaid,
      requiredCents: result.requiredCents,
      remainingToUnlock: result.remainingToUnlock,
      accessGranted: result.accessGranted,
    });
  })
);

/**
 * GET /api/courses/:courseId/my-enrollment?email=
 */
router.get(
  "/:courseId/my-enrollment",
  asyncHandler(async (req, res) => {
    const email = (req.query.email as string)?.toLowerCase()?.trim();

    if (!email) {
      return badRequest(res, "email query parameter is required");
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_email: {
          courseId: param(req.params.courseId),
          email,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            priceCents: true,
            unlockPercent: true,
            isFree: true,
            currency: true,
          },
        },
        payments: {
          where: { status: "CONFIRMED" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amountCents: true,
            method: true,
            transactionCode: true,
            status: true,
            confirmedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.json({
        success: true,
        enrolled: false,
      });
    }

    const priceCents = enrollment.course.priceCents ?? 0;
    const unlockPercent = enrollment.course.unlockPercent ?? 50;
    const requiredCents = Math.ceil((priceCents * unlockPercent) / 100);

    return res.json({
      success: true,
      enrolled: true,
      enrollment,
      totalPaid: enrollment.amountPaidCents,
      requiredCents,
      remainingToUnlock: Math.max(
        0,
        requiredCents - enrollment.amountPaidCents
      ),
      accessGranted: enrollment.accessGranted,
    });
  })
);

/**
 * GET /api/courses/:courseId/lessons/:lessonId?email=
 * Protected lesson content
 */
router.get(
  "/:courseId/lessons/:lessonId",
  asyncHandler(async (req, res) => {
    const email = (req.query.email as string)?.toLowerCase()?.trim();

    if (!email) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Provide email.",
      });
    }

    const access = await canAccessCourseContent({
      courseId: param(req.params.courseId),
      email,
      lessonId: param(req.params.lessonId),
    });

    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        reason: access.reason,
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: param(req.params.lessonId) },
    });

    if (!lesson || !lesson.isPublished) {
      return notFound(res, "Lesson not found");
    }

    return res.json({
      success: true,
      lesson,
    });
  })
);

/* ============================================================
   ADMIN ROUTES
============================================================ */

/**
 * GET /api/courses/admin/all
 */
router.get(
  "/admin/all",
  authenticate,
  asyncHandler(async (_req, res) => {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      count: courses.length,
      courses,
    });
  })
);

/**
 * POST /api/courses/admin
 */
router.post(
  "/admin",
  authenticate,
  asyncHandler(async (req, res) => {
    const data = req.body;

    if (!data.title?.trim() || !data.slug?.trim()) {
      return badRequest(res, "title and slug are required");
    }

    try {
      const course = await prisma.course.create({
        data: {
          slug: data.slug.trim().toLowerCase(),
          title: data.title.trim(),
          subtitle: data.subtitle?.trim() || null,
          description: data.description?.trim() || null,
          overview: data.overview?.trim() || null,
          thumbnailUrl: data.thumbnailUrl || null,
          category: data.category?.trim() || null,
          level: data.level?.trim() || null,
          duration: data.duration?.trim() || null,
          estimatedHours: data.estimatedHours ?? null,
          instructorName: data.instructorName?.trim() || null,
          instructorTitle: data.instructorTitle?.trim() || null,
          instructorBio: data.instructorBio?.trim() || null,
          instructorImage: data.instructorImage || null,
          priceCents: data.priceCents ?? null,
          currency: data.currency || "KES",
          isFree: Boolean(data.isFree),
          isPublished: Boolean(data.isPublished),
          featured: Boolean(data.featured),
          unlockPercent: data.unlockPercent ?? 50,
          objectives: data.objectives ?? null,
          targetAudience: data.targetAudience ?? null,
          requirements: data.requirements ?? null,
          whatYouLearn: data.whatYouLearn ?? null,
        },
      });

      return res.status(201).json({
        success: true,
        course,
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "A course with this slug already exists",
        });
      }
      throw err;
    }
  })
);

/**
 * PUT /api/courses/admin/:id
 */
router.put(
  "/admin/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const course = await prisma.course.update({
      where: { id: param(req.params.id) },
      data: req.body,
    });

    return res.json({
      success: true,
      course,
    });
  })
);

/**
 * DELETE /api/courses/admin/:id
 */
router.delete(
  "/admin/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await prisma.course.delete({
      where: { id: param(req.params.id) },
    });

    return res.json({
      success: true,
      message: "Course deleted successfully",
    });
  })
);

/**
 * POST /api/courses/admin/:courseId/modules
 */
router.post(
  "/admin/:courseId/modules",
  authenticate,
  asyncHandler(async (req, res) => {
    const { title, description, position } = req.body;

    if (!title?.trim()) {
      return badRequest(res, "title is required");
    }

    const course = await prisma.course.findUnique({
      where: { id: param(req.params.courseId) },
    });

    if (!course) {
      return notFound(res, "Course not found");
    }

    const module = await prisma.courseModule.create({
      data: {
        courseId: param(req.params.courseId),
        title: title.trim(),
        description: description?.trim() || null,
        position: position ?? 0,
      },
    });

    return res.status(201).json({
      success: true,
      module,
    });
  })
);

/**
 * POST /api/courses/admin/modules/:moduleId/lessons
 */
router.post(
  "/admin/modules/:moduleId/lessons",
  authenticate,
  asyncHandler(async (req, res) => {
    const data = req.body;

    if (!data.title?.trim()) {
      return badRequest(res, "title is required");
    }

    const module = await prisma.courseModule.findUnique({
      where: { id: param(req.params.moduleId) },
    });

    if (!module) {
      return notFound(res, "Module not found");
    }

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: param(req.params.moduleId),
        title: data.title.trim(),
        description: data.description?.trim() || null,
        content: data.content || null,
        videoUrl: data.videoUrl || null,
        pdfUrl: data.pdfUrl || null,
        durationMinutes: data.durationMinutes ?? null,
        position: data.position ?? 0,
        isFreePreview: Boolean(data.isFreePreview),
        isPublished: Boolean(data.isPublished),
        meetingUrl: data.meetingUrl || null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        meetingInstructions: data.meetingInstructions?.trim() || null,
      },
    });

    return res.status(201).json({
      success: true,
      lesson,
    });
  })
);

/**
 * GET /api/courses/admin/:courseId/enrollments
 */
router.get(
  "/admin/:courseId/enrollments",
  authenticate,
  asyncHandler(async (req, res) => {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId: param(req.params.courseId) },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  })
);

/**
 * POST /api/courses/admin/enrollments/:enrollmentId/confirm-payment
 */
router.post(
  "/admin/enrollments/:enrollmentId/confirm-payment",
  authenticate,
  asyncHandler(async (req, res) => {
    const { amountCents, method, transactionCode, notes } = req.body;

    if (!amountCents || Number(amountCents) <= 0) {
      return badRequest(res, "A valid amountCents is required");
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: param(req.params.enrollmentId) },
    });

    if (!enrollment) {
      return notFound(res, "Enrollment not found");
    }

    const result = await confirmCoursePayment({
      enrollmentId: enrollment.id,
      amountCents: Number(amountCents),
      method: method || "MANUAL",
      transactionCode,
      notes,
    });

    return res.json({
      success: true,
      message: result.accessGranted
        ? "Payment confirmed. Learner now has access."
        : "Payment confirmed. Access threshold not yet met.",
      payment: result.payment,
      enrollment: result.enrollment,
      totalPaid: result.totalPaid,
      requiredCents: result.requiredCents,
      remainingToUnlock: result.remainingToUnlock,
      accessGranted: result.accessGranted,
    });
  })
);

/* ============================================================
   ERROR HANDLER
============================================================ */

router.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[CourseRoutes]", err);

    if (err.code === "P2025") {
      return notFound(res, "Record not found");
    }

    return serverError(
      res,
      err?.message || "An unexpected error occurred"
    );
  }
);

export default router;