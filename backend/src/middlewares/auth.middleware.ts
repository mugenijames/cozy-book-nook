import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Assuming user is attached to req (from JWT)
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN")
    return res.status(403).json({ message: "Forbidden: Admins only" });
  next();
};
