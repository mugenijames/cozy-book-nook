import { Router } from "express";

import {
  adminLogin,
  devLogin,
  getCurrentAdmin,
} from "../controllers/auth.controller";

import {
  authenticate,
} from "../middleware/authMiddleware";

const router = Router();

/* ============================================================
   ADMIN LOGIN
   ============================================================ */

router.post(
  "/login",
  adminLogin
);

/* ============================================================
   DEVELOPMENT LOGIN
   ============================================================ */

router.post(
  "/dev-login",
  devLogin
);

/* ============================================================
   CURRENT ADMIN
   ============================================================ */

router.get(
  "/me",
  authenticate,
  getCurrentAdmin
);

export default router;
