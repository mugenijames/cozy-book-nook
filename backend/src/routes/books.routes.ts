import { Router } from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books.controller";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBook);

// ADMIN routes (we’ll protect later)
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
