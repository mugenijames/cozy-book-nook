import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};