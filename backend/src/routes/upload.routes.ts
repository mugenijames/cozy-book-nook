// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// File filter for PDFs
const pdfFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

const uploadPdf = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB for PDFs
  fileFilter: pdfFilter
});

// Upload cover image to Cloudinary
router.post('/upload-cover', isAdmin, uploadImage.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📤 Uploading cover: ${req.file.originalname} (${req.file.size} bytes)`);

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cozy-book-nook/covers',
          resource_type: 'auto',
          quality: 'auto',
          transformation: [
            { width: 500, height: 750, crop: 'fill' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file!.buffer);
    });

    const result = await uploadPromise as any;

    console.log('✅ Cover uploaded:', result.secure_url);

    res.json({
      url: result.secure_url,
      filename: result.public_id,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload PDF to Cloudinary
router.post('/upload-pdf', isAdmin, uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log(`📤 Uploading PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cozy-book-nook/pdfs",
          resource_type: "image",   // Important for PDFs that should be previewed
          format: "pdf",
          type: "upload",           // Public upload
          access_mode: "public",    // Explicitly public
          overwrite: true,
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file!.buffer);
    });

    const result = await uploadPromise as any;

    console.log('✅ PDF uploaded:', result.secure_url);

    res.json({
      url: result.secure_url,
      filename: result.public_id,
      message: 'PDF upload successful'
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ error: 'PDF upload failed' });
  }
});

// Test endpoint
router.get('/upload-test', (req, res) => {
  res.json({
    message: 'Upload routes are working!',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
  });
});

export default router;