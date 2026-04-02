// backend/src/routes/order.routes.ts
import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
} from '../controllers/order.controller';
import { isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/by-email', getOrdersByEmail);

// Admin only routes
router.get('/', isAdmin, getOrders);
router.get('/:id', isAdmin, getOrderById);
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;