import { put } from '@vercel/blob';
import { Router } from 'express';
import multer from 'multer';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

const router = Router();
// Memory storage prevents crashes from file system permission issues
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload-cover', 
  authenticate, 
  isAdmin, 
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Vercel Blob expects a buffer, which multer provides
      const blob = await put(req.file.originalname, req.file.buffer, { 
        access: 'public',
        contentType: req.file.mimetype 
      });

      return res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: (error as Error).message });
    }
});

export default router;