// backend/src/middleware/admin.ts

import {
  Request,
  Response,
  NextFunction,
} from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error:
        "Authentication required.",
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

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error:
        "Authentication required.",
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