import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not configured.");
}

/* ============================================================
   LOGIN
   ============================================================ */

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

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

    if (!admin.isActive) {
      return res.status(403).json({
        error: "This administrator account has been disabled.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      String(password),
      admin.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication system is not configured.",
      });
    }

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
      error: "Login failed.",
    });
  }
};

/* ============================================================
   DEVELOPMENT LOGIN
   ============================================================ */

export const devLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const isDevelopment =
      process.env.NODE_ENV !== "production";

    const bypassEnabled =
      String(process.env.BYPASS_AUTH || "").toLowerCase() ===
      "true";

    if (!isDevelopment || !bypassEnabled) {
      return res.status(403).json({
        error: "Development login is disabled.",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication system is not configured.",
      });
    }

    const email =
      String(
        process.env.DEV_ADMIN_EMAIL ||
          "dev-admin@localhost.test"
      )
        .trim()
        .toLowerCase();

    let admin = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      const passwordHash = await bcrypt.hash(
        "development-only-password",
        12
      );

      admin = await prisma.adminUser.create({
        data: {
          name: "Development Super Admin",
          email,
          passwordHash,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });
    } else if (!admin.isActive || admin.role !== "SUPER_ADMIN") {
      admin = await prisma.adminUser.update({
        where: {
          id: admin.id,
        },
        data: {
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });
    }

    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "SUPER_ADMIN",
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.json({
      success: true,
      development: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "SUPER_ADMIN",
      },
      expiresIn: "8h",
    });
  } catch (error) {
    console.error("❌ Development login error:", error);

    return res.status(500).json({
      error: "Development login failed.",
    });
  }
};

/* ============================================================
   CURRENT ADMIN
   ============================================================ */

export const getCurrentAdmin = async (
  req: Request,
  res: Response
) => {
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
      error: "Failed to retrieve administrator.",
    });
  }
};
