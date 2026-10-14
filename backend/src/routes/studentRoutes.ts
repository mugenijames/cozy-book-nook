// backend/src/routes/studentRoutes.ts

import crypto from "crypto";
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma"; // <-- change if yours differs
import { getMyProfile, searchStudents, normalizeEmail } from "../services/studentService";
import { requireAdmin } from "../middleware/auth"; // <-- YOUR existing admin guard

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ------------------------------------------------------------
// Email sending: plug in your real mailer here (Resend, Nodemailer, ...)
// ------------------------------------------------------------
async function sendEmail(to: string, subject: string, text: string) {
  // TODO: replace with your mail provider
  console.log(`[email -> ${to}] ${subject}\n${text}`);
}

// ------------------------------------------------------------
// Student JWT + guard
// ------------------------------------------------------------
type StudentToken = { sub: string; role: "student" };

const signStudentToken = (studentId: string) =>
  jwt.sign({ sub: studentId, role: "student" } as StudentToken, JWT_SECRET, {
    expiresIn: "7d",
  });

export interface StudentRequest extends Request {
  studentId?: string;
}

export function requireStudent(
  req: StudentRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as StudentToken;
    if (payload.role !== "student") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.studentId = payload.sub; // identity comes ONLY from the token
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, try again later." },
});

const hashToken = (t: string) =>
  crypto.createHash("sha256").update(t).digest("hex");

// ------------------------------------------------------------
// POST /students/auth/request-access
// Proves the person owns the email before they can set a password.
// Always answers the same way so emails can't be probed.
// ------------------------------------------------------------
router.post("/students/auth/request-access", authLimiter, async (req, res) => {
  const email = normalizeEmail(String(req.body.email || ""));
  if (email) {
    const student = await prisma.student.findUnique({ where: { email } });
    if (student && student.isActive) {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.student.update({
        where: { id: student.id },
        data: {
          resetTokenHash: hashToken(token),
          resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });
      await sendEmail(
        student.email,
        "Set up your student account",
        `Hello ${student.fullName},\n\nYour student number is ${student.studentNumber}.\n` +
          `Set your password here (valid for 1 hour):\n${FRONTEND_URL}/set-password?token=${token}`
      );
    }
  }
  res.json({ message: "If that email is registered, a link has been sent." });
});

// ------------------------------------------------------------
// POST /students/auth/set-password   { token, password }
// ------------------------------------------------------------
router.post("/students/auth/set-password", authLimiter, async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ message: "A valid token and a password of 8+ characters are required." });
  }

  const student = await prisma.student.findFirst({
    where: {
      resetTokenHash: hashToken(String(token)),
      resetTokenExpiresAt: { gt: new Date() },
      isActive: true,
    },
  });
  if (!student) {
    return res.status(400).json({ message: "This link is invalid or has expired." });
  }

  await prisma.student.update({
    where: { id: student.id },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      resetTokenHash: null,        // single use
      resetTokenExpiresAt: null,
      lastLoginAt: new Date(),
    },
  });

  res.json({ token: signStudentToken(student.id) });
});

// ------------------------------------------------------------
// POST /students/auth/login   { email, password }
// ------------------------------------------------------------
router.post("/students/auth/login", authLimiter, async (req, res) => {
  const email = normalizeEmail(String(req.body.email || ""));
  const password = String(req.body.password || "");

  const student = await prisma.student.findUnique({ where: { email } });

  // Same message for "no such user" and "wrong password"
  const ok =
    student?.isActive &&
    student.passwordHash &&
    (await bcrypt.compare(password, student.passwordHash));

  if (!student || !ok) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { lastLoginAt: new Date() },
  });

  res.json({
    token: signStudentToken(student.id),
    student: {
      id: student.id,
      studentNumber: student.studentNumber,
      fullName: student.fullName,
    },
  });
});

// ------------------------------------------------------------
// GET /students/me   (a student can only ever read THEIR record)
// ------------------------------------------------------------
router.get("/students/me", requireStudent, async (req: StudentRequest, res) => {
  const profile = await getMyProfile(req.studentId!);
  if (!profile) return res.status(404).json({ message: "Student not found" });
  res.json(profile);
});

// ------------------------------------------------------------
// GET /admin/students?q=   (staff only)
// ------------------------------------------------------------
router.get("/admin/students", requireAdmin, async (req, res) => {
  res.json(await searchStudents(String(req.query.q || "")));
});

export default router;

