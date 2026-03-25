"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const isDevelopment = process.env.NODE_ENV === 'development';
const BYPASS_AUTH = isDevelopment || process.env.BYPASS_AUTH === 'true';
// 1. CORS Configuration
app.use((0, cors_1.default)({
    origin: ["http://localhost:8080", "http://192.168.100.8:8080", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
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
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// 4. Routes
app.use('/api/books', book_routes_1.default);
app.use('/api/checkout', checkout_routes_1.default);
app.use('/api', upload_routes_1.default);
// 5. Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        environment: process.env.NODE_ENV || 'development',
        auth_bypass: BYPASS_AUTH
    });
});
// 6. Error Handler
app.use((err, req, res, next) => {
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
