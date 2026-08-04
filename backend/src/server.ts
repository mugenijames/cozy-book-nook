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
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';

// Load environment variables
dotenv.config();
console.log("OpenAI Key Loaded:", !!process.env.OPENAI_API_KEY);
const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';
const BYPASS_AUTH = isDevelopment || process.env.BYPASS_AUTH === 'true';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// 1. CORS Configuration
const allowedOrigins = [
  "http://localhost:8080",
  "http://192.168.100.8:8080",
  "http://localhost:3000",
  'https://emuriadavid.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Request Logger
app.use((req, res, next) => {
  if (!req.originalUrl.includes('favicon')) {
    console.log(`>>> ${req.method} ${req.originalUrl}`);
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
app.use("/api/orders", orderRoutes);
app.use('/api/payments', paymentRoutes);

// 5. Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    auth_bypass: BYPASS_AUTH,
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'missing',
    services: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      mpesa: !!process.env.MPESA_CONSUMER_KEY,
      paypal: !!process.env.PAYPAL_CLIENT_ID,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
    }
  });
});

// 6. Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cozy Book Nook API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      books: '/api/books',
      checkout: '/api/checkout/status',
      upload: '/api/upload-cover',
      payments: '/api/payments',
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

// Start server - Convert PORT to number
const PORT = parseInt(process.env.PORT || '5000', 10);

// Listen on all interfaces (required for Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔓 Auth Bypass: ${BYPASS_AUTH ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📚 Books API: /api/books`);
  console.log(`💳 Checkout API: /api/checkout/status`);
  console.log(`🖼️  Upload API: /api/upload-cover`);
  console.log(`💰 Payments API: /api/payments`);
  console.log(`✅ Health check: /health`);
  console.log(`📁 Uploads served from: /uploads\n`);
  console.log("📧 Email Configuration");
  console.log("SMTP Host:", process.env.SMTP_HOST);
  console.log("SMTP User:", process.env.SMTP_USER);
  console.log("Admin Email:", process.env.ADMIN_EMAIL);
  console.log(
    "SMTP Password:",
    process.env.SMTP_PASS ? "Loaded ✅" : "Missing ❌"
  );
  if (BYPASS_AUTH) {
    console.log('⚠️  DEVELOPMENT MODE: Authentication is BYPASSED');
  }
});

export default app;