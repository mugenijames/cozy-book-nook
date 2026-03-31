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

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Upload cover image to Cloudinary
router.post('/upload-cover', isAdmin, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📤 Uploading file: ${req.file.originalname} (${req.file.size} bytes)`);
    
    // Upload to Cloudinary
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
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(req.file!.buffer);
    });

    const result = await uploadPromise as any;
    
    console.log('✅ File uploaded to Cloudinary:', result.secure_url);
    
    res.json({ 
      url: result.secure_url,
      filename: result.public_id,
      format: result.format,
      size: result.bytes,
      message: 'Upload successful' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Optional: Add a test endpoint to verify the route is working
router.get('/upload-test', (req, res) => {
  res.json({ 
    message: 'Upload route is working!',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
  });
});

export default router;