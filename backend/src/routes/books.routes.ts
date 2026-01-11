import express from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books.controller";
import { isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getBooks); // everyone can see books
router.get("/:id", getBook); // everyone can see a single book
router.post("/", isAdmin, createBook); // admin only
router.put("/:id", isAdmin, updateBook); // admin only
router.delete("/:id", isAdmin, deleteBook); // admin only

export default router;
