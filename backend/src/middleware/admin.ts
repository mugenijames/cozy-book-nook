import { Request, Response, NextFunction } from 'express';

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if user exists AND is admin
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};