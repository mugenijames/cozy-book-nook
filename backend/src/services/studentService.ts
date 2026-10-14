// backend/src/services/studentService.ts

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma"; // <-- change if yours differs

type Tx = Prisma.TransactionClient;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

// ------------------------------------------------------------
// Student number: STU-<year>-<5 digit sequence>
// The counter increment is atomic, so no two students share a number.
// ------------------------------------------------------------
async function generateStudentNumber(tx: Tx): Promise<string> {
  const year = new Date().getFullYear();
  const key = `student-${year}`;

  const counter = await tx.counter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `STU-${year}-${String(counter.value).padStart(5, "0")}`;
}

// ------------------------------------------------------------
// Find the student by email, or create them with a new number.
// Existing students keep their number for life.
// ------------------------------------------------------------
export async function findOrCreateStudent(
  tx: Tx,
  input: { fullName: string; email: string; phone?: string | null }
) {
  const email = normalizeEmail(input.email);

  const existing = await tx.student.findUnique({ where: { email } });
  if (existing) {
    // Fill in missing contact details, never overwrite what's there
    if (
      (!existing.phone && input.phone) ||
      (!existing.fullName && input.fullName)
    ) {
      return tx.student.update({
        where: { id: existing.id },
        data: {
          phone: existing.phone || input.phone || null,
          fullName: existing.fullName || input.fullName,
        },
      });
    }
    return existing;
  }

  const studentNumber = await generateStudentNumber(tx);
  return tx.student.create({
    data: {
      studentNumber,
      fullName: input.fullName.trim(),
      email,
      phone: input.phone?.trim() || null,
    },
  });
}

// ------------------------------------------------------------
// Enrol in a course
// ------------------------------------------------------------
export async function enrollInCourse(input: {
  courseId: string;
  fullName: string;
  email: string;
  phone?: string | null;
}) {
  const email = normalizeEmail(input.email);

  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: input.courseId },
      });
      if (!course) throw new Error("Course not found");

      const duplicate = await tx.courseEnrollment.findUnique({
        where: { courseId_email: { courseId: input.courseId, email } },
      });
      if (duplicate) throw new Error("Already enrolled in this course");

      const student = await findOrCreateStudent(tx, { ...input, email });

      const enrollment = await tx.courseEnrollment.create({
        data: {
          courseId: input.courseId,
          studentId: student.id,
          fullName: student.fullName,
          email,
          phone: student.phone,
          // Free courses unlock immediately
          ...(course.isFree
            ? {
                paymentStatus: "PAID",
                accessGranted: true,
                accessGrantedAt: new Date(),
              }
            : {}),
        },
      });

      return { enrollment, student };
    });
  } catch (err) {
    // Two requests enrolling the same email at the same instant
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new Error("Already enrolled in this course");
    }
    throw err;
  }
}

// ------------------------------------------------------------
// Register for a program
// ------------------------------------------------------------
export async function registerForProgram(input: {
  programId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  occupation?: string | null;
  motivation?: string | null;
  goals?: string | null;
}) {
  const email = normalizeEmail(input.email);

  return prisma.$transaction(async (tx) => {
    const program = await tx.program.findUnique({
      where: { id: input.programId },
    });
    if (!program) throw new Error("Program not found");

    const student = await findOrCreateStudent(tx, { ...input, email });

    const registration = await tx.programRegistration.create({
      data: {
        programId: input.programId,
        studentId: student.id,
        fullName: student.fullName,
        email,
        phone: student.phone,
        organization: input.organization ?? null,
        occupation: input.occupation ?? null,
        motivation: input.motivation ?? null,
        goals: input.goals ?? null,
      },
    });

    return { registration, student };
  });
}

// ------------------------------------------------------------
// STAFF: search by student number, name, or email
// (route must be behind requireAuth + requireAdmin)
// ------------------------------------------------------------
export async function searchStudents(query: string) {
  const q = query.trim();
  if (!q) return [];

  return prisma.student.findMany({
    where: {
      OR: [
        { studentNumber: { equals: q, mode: "insensitive" } },
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    },
    select: {
      id: true,
      studentNumber: true,
      fullName: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      courseEnrollments: {
        select: {
          id: true,
          paymentStatus: true,
          enrollmentStatus: true,
          accessGranted: true,
          course: { select: { id: true, title: true, slug: true } },
        },
      },
      programRegistrations: {
        select: {
          id: true,
          status: true,
          program: { select: { id: true, title: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

// ------------------------------------------------------------
// STUDENT: own profile only.
// `studentId` MUST come from the verified token (req.user.id),
// never from req.params or req.body.
// Note: passwordHash is deliberately not selected.
// ------------------------------------------------------------
export async function getMyProfile(studentId: string) {
  return prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentNumber: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
      courseEnrollments: {
        select: {
          id: true,
          paymentStatus: true,
          enrollmentStatus: true,
          amountPaidCents: true,
          accessGranted: true,
          enrolledAt: true,
          completedAt: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnailUrl: true,
              priceCents: true,
              currency: true,
            },
          },
        },
      },
      programRegistrations: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          program: { select: { id: true, title: true, slug: true } },
        },
      },
    },
  });
}

// ------------------------------------------------------------
// ONE-TIME BACKFILL: give a Student + number to every existing
// enrolment/registration. Safe to run more than once.
//
//   npx tsx src/scripts/backfillStudents.ts
//   (script just calls: await backfillStudents())
// ------------------------------------------------------------
export async function backfillStudents() {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { studentId: null },
    orderBy: { createdAt: "asc" },
  });
  const registrations = await prisma.programRegistration.findMany({
    where: { studentId: null },
    orderBy: { createdAt: "asc" },
  });

  // Oldest first, so earlier students get lower numbers
  const people = [
    ...enrollments.map((e) => ({ ...e, kind: "enrollment" as const })),
    ...registrations.map((r) => ({ ...r, kind: "registration" as const })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  let linked = 0;

  for (const p of people) {
    await prisma.$transaction(async (tx) => {
      const student = await findOrCreateStudent(tx, {
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
      });

      if (p.kind === "enrollment") {
        await tx.courseEnrollment.update({
          where: { id: p.id },
          data: { studentId: student.id },
        });
      } else {
        await tx.programRegistration.update({
          where: { id: p.id },
          data: { studentId: student.id },
        });
      }
    });
    linked++;
  }

  return { linked };
}