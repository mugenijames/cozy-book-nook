import { Router } from "express";

import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getAdminBook,
} from "../controllers/book.controller";

import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

/* -------------------------------------------------------------------------- */
/* PUBLIC ROUTES                                                              */
/* -------------------------------------------------------------------------- */

router.get("/", getBooks);

router.get("/:idOrSlug", getBook);

/* -------------------------------------------------------------------------- */
/* ADMIN ROUTES                                                               */
/* -------------------------------------------------------------------------- */

/*
 * IMPORTANT:
 *
 * This route must exist BEFORE:
 *
 * router.get("/:idOrSlug", ...)
 *
 * because the admin frontend specifically requests:
 *
 * /api/admin/books/:id
 */

router.get(
  "/admin/:id",
  isAdmin,
  getAdminBook
);

router.post(
  "/",
  isAdmin,
  createBook
);

router.put(
  "/:id",
  isAdmin,
  updateBook
);

router.delete(
  "/:id",
  isAdmin,
  deleteBook
);

export default router;