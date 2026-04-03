// backend/src/routes/order.routes.ts
import { Router } from 'express';
import { getOrders, getOrderById } from '../controllers/order.controller';

const router = Router();

// Get all orders
router.get('/', getOrders);

// Get single order by ID
router.get('/:id', getOrderById);

export default router;