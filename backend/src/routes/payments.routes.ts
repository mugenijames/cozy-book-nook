import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { initiatePayment } from "../controllers/payments.controller";

const router = Router();

router.post("/pay", authenticate, initiatePayment);

export default router;
