import { Router } from "express";
import {
  checkoutStatus,
  createCheckoutSession,
} from "../controllers/checkout.controller";

const router = Router();

router.get("/status", checkoutStatus);
router.post("/session", createCheckoutSession);

export default router;
