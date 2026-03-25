// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bookRoutes from './routes/book.routes';
import checkoutRoutes from './routes/checkout.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';
const BYPASS_AUTH = isDevelopment || process.env.BYPASS_AUTH === 'true';

// 1. CORS Configuration
app.use(cors({
  origin: ["http://localhost:8080", "http://192.168.100.8:8080", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Request Logger - FIXED: Don't block upload requests
app.use((req, res, next) => {
  // Log all requests except for favicon
  if (!req.originalUrl.includes('favicon')) {
    console.log(`>>> ${req.method} ${req.originalUrl} | Referrer: ${req.get('Referer') || 'direct'}`);
  }
  
  // REMOVED the problematic filter that was blocking uploads
  // The old code was returning 204 for GET requests to upload-cover
  // which would block the upload functionality
  
  next();
});

// 3. Static Files (for serving uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Routes
app.use('/api/books', bookRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', uploadRoutes);

// 5. Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    auth_bypass: BYPASS_AUTH
  });
});

// 6. Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error caught:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔓 Auth Bypass: ${BYPASS_AUTH ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log(`💳 Checkout API: http://localhost:${PORT}/api/checkout/status | POST /api/checkout/session`);
  console.log(`🖼️  Upload API: http://localhost:${PORT}/api/upload-cover`);
  console.log(`📁 Uploads served from: /uploads\n`);
  
  if (BYPASS_AUTH) {
    console.log('⚠️  DEVELOPMENT MODE: Authentication is BYPASSED');
    console.log('   - All admin routes are accessible without tokens');
    console.log('   - Use admin@example.com / admin123 to login\n');
  }
});