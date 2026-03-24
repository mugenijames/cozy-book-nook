import { Router } from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/book.controller';
import { isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBooks);
router.get('/:idOrSlug', getBook);
router.post('/', isAdmin, createBook);
router.put('/:idOrSlug', isAdmin, updateBook);
router.delete('/:idOrSlug', isAdmin, deleteBook);

export default router;