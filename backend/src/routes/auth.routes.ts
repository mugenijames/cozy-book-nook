
import { Router } from "express";

import {
  adminLogin,
  getCurrentAdmin,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/* ============================================================
   ADMIN LOGIN
   ============================================================ */

router.post("/login", adminLogin);

/* ============================================================
   CURRENT AUTHENTICATED ADMIN
   ============================================================ */

router.get("/me", authenticate, getCurrentAdmin);

export default router;
