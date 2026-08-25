// backend/src/middleware/authMiddleware.ts

import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

/* ============================================================
   EXPRESS REQUEST TYPE
   ============================================================ */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        name?: string;
        role: "ADMIN" | "SUPER_ADMIN";
      };
    }
  }
}

/* ============================================================
   JWT PAYLOAD
   ============================================================ */

interface JwtPayload {
  id: string;
  email?: string;
  name?: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

/* ============================================================
   AUTHENTICATE
   ============================================================ */

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  const token =
    authHeader &&
    authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!token) {
    return res.status(401).json({
      error:
        "Access denied. Authentication required.",
    });
  }

  const JWT_SECRET =
    process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error(
      "❌ JWT_SECRET is not configured."
    );

    return res.status(500).json({
      error:
        "Authentication system is not configured.",
    });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as JwtPayload;

    if (
      !decoded.id ||
      !decoded.role
    ) {
      return res.status(401).json({
        error: "Invalid authentication token.",
      });
    }

    if (
      decoded.role !== "ADMIN" &&
      decoded.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        error:
          "This account does not have administrator privileges.",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "❌ JWT verification failed:",
      error
    );

    return res.status(401).json({
      error:
        "Invalid or expired authentication token.",
    });
  }
};

/* ============================================================
   ADMIN OR SUPER ADMIN
   ============================================================ */

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  if (
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPER_ADMIN"
  ) {
    return res.status(403).json({
      error:
        "Administrator access required.",
    });
  }

  next();
};

/* ============================================================
   SUPER ADMIN ONLY
   ============================================================ */

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  if (
    req.user.role !== "SUPER_ADMIN"
  ) {
    return res.status(403).json({
      error:
        "Super administrator access required.",
    });
  }

  next();
};

/* ============================================================
   BACKWARD COMPATIBILITY
   ============================================================ */

export const isAdmin = requireAdmin;