import { Router } from "express";
import { aiAssistant } from "../controllers/ai.controller";

const router = Router();
router.post("/ask", aiAssistant);

export default router;
