import express from "express";
import { getUsers, getUser } from "../controllers/users.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Only admins can access
router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
