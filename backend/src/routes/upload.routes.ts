import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/upload-cover', 
  authenticate, 
  isAdmin, 
  (req: Request, res: Response, next: NextFunction) => {
    // Wrap multer in a function to handle errors locally
    upload.single('cover')(req, res, (err: any) => {
      if (err) {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      console.log(">>> [BACKEND]: File successfully saved:", req.file.filename);
      
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error("Upload handler error:", error);
      return res.status(500).json({ error: "Internal server error during upload" });
    }
  }
);

export default router;