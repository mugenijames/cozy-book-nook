"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/* -------------------------------------------------------------------------- */
/* PUBLIC ROUTES                                                              */
/* -------------------------------------------------------------------------- */
router.get("/", book_controller_1.getBooks);
router.get("/:idOrSlug", book_controller_1.getBook);
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
router.get("/admin/:id", authMiddleware_1.isAdmin, book_controller_1.getAdminBook);
router.post("/", authMiddleware_1.isAdmin, book_controller_1.createBook);
router.put("/:id", authMiddleware_1.isAdmin, book_controller_1.updateBook);
router.delete("/:id", authMiddleware_1.isAdmin, book_controller_1.deleteBook);
exports.default = router;
