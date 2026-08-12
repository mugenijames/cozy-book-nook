// backend/src/routes/admin.book.routes.ts

import { Router } from "express";

import {
  getAdminBooks,
  getAdminBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

/* -------------------------------------------------------------------------- */
/* ADMIN BOOK ROUTES                                                          */
/* -------------------------------------------------------------------------- */

/*
 * GET ALL BOOKS
 *
 * GET /api/admin/books
 */
router.get(
  "/",
  isAdmin,
  getAdminBooks
);

/*
 * GET ONE BOOK
 *
 * GET /api/admin/books/:id
 *
 * IMPORTANT:
 * This route must exist because BookFormPage calls:
 *
 * /api/admin/books/:id
 */
router.get(
  "/:id",
  isAdmin,
  getAdminBook
);

/*
 * CREATE BOOK
 *
 * POST /api/admin/books
 */
router.post(
  "/",
  isAdmin,
  createBook
);

/*
 * UPDATE BOOK
 *
 * PUT /api/admin/books/:id
 */
router.put(
  "/:id",
  isAdmin,
  updateBook
);

/*
 * DELETE BOOK
 *
 * DELETE /api/admin/books/:id
 */
router.delete(
  "/:id",
  isAdmin,
  deleteBook
);

export default router;