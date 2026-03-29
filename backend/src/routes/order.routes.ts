// backend/src/routes/order.routes.ts
import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus, checkOrderStatus } from "../controllers/order.controller";
import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createOrder);                          // Public — user submits order
router.get("/", isAdmin, getOrders);                   // Admin — view all orders
router.put("/:id", isAdmin, updateOrderStatus);        // Admin — approve/reject
router.get("/check", checkOrderStatus);                // Public — check if approved

export default router;