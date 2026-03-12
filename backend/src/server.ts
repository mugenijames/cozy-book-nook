import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import bookRoutes from './routes/book.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// Body parsers with high limits
app.use(express.json({ limit: '100mb' }));          // bumped higher just in case
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(cors());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Multer config (unchanged except path safety)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB – give headroom
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only JPG, PNG, WebP, GIF allowed'));
  },
});

// Multer + general error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.code, err.message);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large (max 100MB)' });
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Unexpected field or too many files' });
  } else if (err) {
    console.error('Server error during upload:', err.stack || err);
    return res.status(500).json({ error: err.message || 'Upload processing failed' });
  }
  next(err);
});

// Routes
app.get('/', (req, res) => res.json({ message: 'Cozy Book Nook Backend running! 📚' }));

app.use('/api/books', bookRoutes);
app.use('/api', uploadRoutes);

// Upload route with explicit timeout extension + logging
app.post('/api/upload-cover', (req, res, next) => {
  // Extend timeout specifically for this request (most reliable fix for streaming delays)
  req.setTimeout(10 * 60 * 1000); // 10 minutes – generous for localhost 2.5–10MB uploads

  console.log('Upload request started - field:', req.headers['content-length'], 'bytes expected');

  next();
}, upload.single('cover'), (req, res) => {
  if (!req.file) {
    console.warn('No file received in upload');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const port = process.env.PORT || 5000;
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  console.log('Upload completed successfully:', {
    filename: req.file.filename,
    size: req.file.size,
    url: fileUrl
  });

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Global server timeouts (keep as backup)
server.headersTimeout = 600000;    // 10 min
server.requestTimeout = 600000;
server.keepAliveTimeout = 600000;