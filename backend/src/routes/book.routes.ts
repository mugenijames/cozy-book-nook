import express from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

const router = express.Router();

router.get('/', getAllBooks);                  // public
router.get('/:id', getBookById);               // public
router.post('/', isAdmin, createBook);         // admin only
router.put('/:id', isAdmin, updateBook);       // admin only
router.delete('/:id', isAdmin, deleteBook);    // admin only

export default router;