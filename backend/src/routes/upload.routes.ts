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
router.post(
  "/upload-pdf",
  isAdmin,
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No PDF uploaded",
        });
      }

      console.log(
        `📤 Uploading PDF: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cozy-book-nook/pdfs",

            // Upload as RAW (recommended for PDFs)
            resource_type: "raw",

            use_filename: true,
            unique_filename: true,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      console.log("✅ PDF Uploaded");
      console.log(result.secure_url);

      /**
       * Convert first page of PDF into a JPG preview.
       *
       * Cloudinary can transform RAW PDFs into images.
       */
      const previewImage = cloudinary.url(result.public_id, {
        resource_type: "raw",
        format: "jpg",
        page: 1,
        secure: true,
      });

      console.log("🖼 Preview:", previewImage);

      return res.json({
        success: true,

        pdfUrl: result.secure_url,

        pdfPreviewImage: previewImage,

        publicId: result.public_id,

        filename: result.original_filename,

        message: "PDF uploaded successfully",
      });
    } catch (err: any) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// Test endpoint
router.get('/upload-test', (req, res) => {
  res.json({
    message: 'Upload routes are working!',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
  });
});

export default router;