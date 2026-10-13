// backend/src/controllers/auth.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not configured in environment variables.");
}

/* ============================================================
   ADMIN & SUPER ADMIN LOGIN
   ============================================================ */

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Fetch administrator by unique email
    const admin = await prisma.adminUser.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!admin) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // 2. Enforce active account status check
    if (!admin.isActive) {
      return res.status(403).json({
        error: "This administrator account has been disabled.",
      });
    }

    // 3. Verify bcrypt password hash
    const passwordMatches = await bcrypt.compare(
      String(password),
      admin.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // 4. Ensure backend environment configuration is intact
    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication system is not configured.",
      });
    }

    // 5. Generate secure JWT containing account ID and role
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    // 6. Update last login timestamp in PostgreSQL
    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      expiresIn: "8h",
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);

    return res.status(500).json({
      error: "Login failed due to a server error.",
    });
  }
};

/* ============================================================
   GET CURRENT AUTHENTICATED ADMIN
   ============================================================ */

export const getCurrentAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const admin = await prisma.adminUser.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        error: "Administrator account not found.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        error: "Administrator account is disabled.",
      });
    }

    return res.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error("❌ Get current admin error:", error);

    return res.status(500).json({
      error: "Failed to retrieve administrator details.",
    });
  }
};