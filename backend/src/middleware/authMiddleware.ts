// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const BYPASS_AUTH = isDevelopment || isTest || process.env.BYPASS_AUTH === 'true';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // BYPASS for development and testing
  if (BYPASS_AUTH) {
    if (isDevelopment) {
      console.log('⚠️ [DEV MODE] Authentication bypassed');
    }
    req.user = { id: '1', role: 'admin' };
    return next();
  }

  // Production authentication
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // BYPASS for development and testing
  if (BYPASS_AUTH) {
    if (isDevelopment) {
      console.log('⚠️ [DEV MODE] Admin check bypassed');
    }
    if (!req.user) {
      req.user = { id: '1', role: 'admin' };
    }
    next();
    return;
  }

  // Production admin check
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};