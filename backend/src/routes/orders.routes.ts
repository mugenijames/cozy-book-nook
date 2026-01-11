import express from "express";
import { getOrders, getOrder } from "../controllers/orders.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Admin access only
router.use(authMiddleware, adminMiddleware);

router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
