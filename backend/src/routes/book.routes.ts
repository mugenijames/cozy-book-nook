import { Router } from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/book.controller';
import { isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', isAdmin, createBook);
router.put('/:id', isAdmin, updateBook);
router.delete('/:id', isAdmin, deleteBook);

export default router;