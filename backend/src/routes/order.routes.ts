import { Router } from "express";

import {
  getOrders,
  getOrderById,
  getOrdersByEmail,
  createHardcopyOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller";

import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public
router.post("/", createHardcopyOrder);

router.get(
  "/by-email",
  getOrdersByEmail
);

// Admin
router.get(
  "/",
  isAdmin,
  getOrders
);

router.get(
  "/:id",
  isAdmin,
  getOrderById
);

router.put(
  "/:id/status",
  isAdmin,
  updateOrderStatus
);

router.put(
  "/:id/payment-status",
  isAdmin,
  updatePaymentStatus
);

export default router;