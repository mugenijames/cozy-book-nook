// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import bookRoutes from './routes/book.routes';
import checkoutRoutes from './routes/checkout.routes';
import uploadRoutes from './routes/upload.routes';
import invitationRoutes from './routes/invitation.routes';

dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';
const BYPASS_AUTH = isDevelopment || process.env.BYPASS_AUTH === 'true';

// Ensure database directory exists (for SQLite)
const dbPath = path.join(__dirname, '../prisma');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
  console.log('📁 Created database directory:', dbPath);
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// 1. CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://192.168.100.8:8080",
    "http://localhost:5173",
    'https://speakeremuriadavid.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Request Logger
app.use((req, res, next) => {
  if (!req.originalUrl.includes('favicon')) {
    console.log(`>>> ${req.method} ${req.originalUrl} | Referrer: ${req.get('Referer') || 'direct'}`);
  }
  next();
});

// 3. Static Files (for serving uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Routes
app.use('/api/books', bookRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', uploadRoutes);
app.use('/api/invite', invitationRoutes);

// 5. Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    auth_bypass: BYPASS_AUTH,
    timestamp: new Date().toISOString()
  });
});

// 6. Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'David Emuria API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      checkout: '/api/checkout/status',
      upload: '/api/upload-cover',
      invite: '/api/invite',
      health: '/health'
    }
  });
});

// 7. Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global Error caught:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Export for Vercel/Render
export default app;

// For local development only
if (isDevelopment || process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔓 Auth Bypass: ${BYPASS_AUTH ? 'ENABLED' : 'DISABLED'}`);
    console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
    console.log(`💳 Checkout API: http://localhost:${PORT}/api/checkout/status | POST /api/checkout/session`);
    console.log(`🖼️  Upload API: http://localhost:${PORT}/api/upload-cover`);
    console.log(`📧 Invite API: http://localhost:${PORT}/api/invite`);
    console.log(`📁 Uploads served from: /uploads\n`);
    
    if (BYPASS_AUTH) {
      console.log('⚠️  DEVELOPMENT MODE: Authentication is BYPASSED');
      console.log('   - All admin routes are accessible without tokens');
      console.log('   - Use admin@example.com / admin123 to login\n');
    }
  });
}