import { Router } from "express";

import {
  getAdminBooks,
  getAdminBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

import {
  authenticate,
  isAdmin,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  isAdmin,
  getAdminBooks
);

router.get(
  "/:id",
  authenticate,
  isAdmin,
  getAdminBook
);

router.post(
  "/",
  authenticate,
  isAdmin,
  createBook
);

router.put(
  "/:id",
  authenticate,
  isAdmin,
  updateBook
);

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteBook
);

export default router;

