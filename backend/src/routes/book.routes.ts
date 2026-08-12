// server/src/routes/book.routes.ts

import { Router } from "express";

import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/books
 * Get all books
 */
router.get("/", getBooks);

/**
 * GET /api/books/:idOrSlug
 * Get a single book by ID or slug
 */
router.get("/:idOrSlug", getBook);

/**
 * POST /api/books
 * Create a new book
 * Admin only
 *
 * After the book is successfully created,
 * the controller should trigger PDF preview/AI
 * summary generation.
 */
router.post("/", isAdmin, createBook);

/**
 * PUT /api/books/:id
 * Update an existing book
 * Admin only
 *
 * If the PDF changes, the controller can regenerate
 * the preview/AI summary.
 */
router.put("/:id", isAdmin, updateBook);

/**
 * DELETE /api/books/:id
 * Delete a book
 * Admin only
 */
router.delete("/:id", isAdmin, deleteBook);

export default router;