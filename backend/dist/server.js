"use strict";
// backend/src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/* ==========================================================================
   ROUTES
========================================================================== */
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const admin_book_routes_1 = __importDefault(require("./routes/admin.book.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const invitation_routes_1 = __importDefault(require("./routes/invitation.routes"));
const inquiry_routes_1 = __importDefault(require("./routes/inquiry.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const bookPreview_routes_1 = __importDefault(require("./routes/bookPreview.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
/* ==========================================================================
   ENVIRONMENT
========================================================================== */
const NODE_ENV = process.env.NODE_ENV ||
    "development";
const PORT = parseInt(process.env.PORT || "5000", 10);
const isDevelopment = NODE_ENV === "development";
/*
 * Authentication bypass should NEVER automatically
 * happen just because NODE_ENV is development.
 *
 * Development bypass can still be enabled explicitly
 * with:
 *
 * BYPASS_AUTH=true
 */
const BYPASS_AUTH = process.env.BYPASS_AUTH === "true";
/* ==========================================================================
   ENVIRONMENT STATUS
========================================================================== */
console.log("");
console.log("========================================");
console.log("📚 COZY BOOK NOOK BACKEND");
console.log("========================================");
console.log("Environment:", NODE_ENV);
console.log("Port:", PORT);
console.log("Database URL:", process.env.DATABASE_URL
    ? "✓ Loaded"
    : "✗ Missing");
console.log("Cloudinary:", process.env.CLOUDINARY_CLOUD_NAME
    ? "✓ Loaded"
    : "✗ Missing");
console.log("Anthropic:", process.env.ANTHROPIC_API_KEY
    ? "✓ Loaded"
    : "✗ Missing");
console.log("OpenAI:", process.env.OPENAI_API_KEY
    ? "✓ Loaded"
    : "✗ Missing");
console.log("Stripe:", process.env.STRIPE_SECRET_KEY
    ? "✓ Loaded"
    : "✗ Missing");
console.log("M-Pesa Consumer Key:", process.env.MPESA_CONSUMER_KEY
    ? "✓ Loaded"
    : "✗ Missing");
console.log("PayPal:", process.env.PAYPAL_CLIENT_ID
    ? "✓ Loaded"
    : "✗ Missing");
console.log("SMTP:", process.env.SMTP_HOST
    ? "✓ Loaded"
    : "✗ Missing");
console.log("Authentication Bypass:", BYPASS_AUTH
    ? "⚠️ ENABLED"
    : "✓ Disabled");
console.log("========================================");
console.log("");
/* ==========================================================================
   EXPRESS APP
========================================================================== */
const app = (0, express_1.default)();
/* ==========================================================================
   UPLOADS DIRECTORY
========================================================================== */
const uploadsDir = path_1.default.resolve(__dirname, "../uploads");
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, {
            recursive: true,
        });
        console.log("📁 Created uploads directory:", uploadsDir);
    }
    else {
        console.log("📁 Uploads directory:", uploadsDir);
    }
}
catch (error) {
    console.error("❌ Failed to create uploads directory:", error);
}
/* ==========================================================================
   CORS
========================================================================== */
const allowedOrigins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.100.8:8080",
    "https://emuriadavid.netlify.app",
    process.env.FRONTEND_URL,
]
    .filter((origin) => Boolean(origin));
console.log("🌐 Allowed CORS origins:", allowedOrigins);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        /*
         * Requests without Origin:
         *
         * - Postman
         * - curl
         * - server-to-server
         */
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn("⚠️ CORS blocked origin:", origin);
        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
}));
/* ==========================================================================
   BODY PARSERS
========================================================================== */
app.use(express_1.default.json({
    limit: "50mb",
}));
app.use(express_1.default.urlencoded({
    limit: "50mb",
    extended: true,
}));
/* ==========================================================================
   REQUEST LOGGER
========================================================================== */
app.use((req, _res, next) => {
    const url = req.originalUrl ||
        req.url;
    if (!url.includes("favicon")) {
        console.log(`>>> ${req.method} ${url}`);
    }
    next();
});
/* ==========================================================================
   STATIC UPLOADS
========================================================================== */
app.use("/uploads", express_1.default.static(uploadsDir));
/* ==========================================================================
   HEALTH CHECK
========================================================================== */
app.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        port: PORT,
        auth_bypass: BYPASS_AUTH,
        database: process.env.DATABASE_URL
            ? "configured"
            : "missing",
        services: {
            cloudinary: Boolean(process.env
                .CLOUDINARY_CLOUD_NAME),
            anthropic: Boolean(process.env
                .ANTHROPIC_API_KEY),
            openai: Boolean(process.env
                .OPENAI_API_KEY),
            stripe: Boolean(process.env
                .STRIPE_SECRET_KEY),
            mpesa: Boolean(process.env
                .MPESA_CONSUMER_KEY),
            paypal: Boolean(process.env
                .PAYPAL_CLIENT_ID),
            email: Boolean(process.env.SMTP_HOST &&
                process.env.SMTP_USER &&
                process.env.SMTP_PASS),
        },
    });
});
/* ==========================================================================
   ROOT
========================================================================== */
app.get("/", (_req, res) => {
    res.json({
        message: "Cozy Book Nook API",
        version: "2.1.0",
        status: "running",
        environment: NODE_ENV,
        endpoints: {
            health: "/health",
            books: "/api/books",
            adminBooks: "/api/admin/books",
            checkout: "/api/checkout",
            uploadCover: "/api/upload-cover",
            uploadPdf: "/api/upload-pdf",
            bookPreview: "/api/books/:id/generate-preview",
            inquiries: "/api/inquiries",
            inquiryHealth: "/api/inquiries/health",
            orders: "/api/orders",
            payments: "/api/payments",
            auth: "/api/auth",
        },
    });
});
/* ==========================================================================
   API ROUTES
========================================================================== */
/* --------------------------------------------------------------------------
   PUBLIC BOOK ROUTES
-------------------------------------------------------------------------- */
app.use("/api/books", book_routes_1.default);
/* --------------------------------------------------------------------------
   ADMIN BOOK ROUTES
-------------------------------------------------------------------------- */
app.use("/api/admin/books", admin_book_routes_1.default);
/* --------------------------------------------------------------------------
   UPLOAD ROUTES
-------------------------------------------------------------------------- */
app.use("/api", upload_routes_1.default);
/* --------------------------------------------------------------------------
   CHECKOUT
-------------------------------------------------------------------------- */
app.use("/api/checkout", checkout_routes_1.default);
/* --------------------------------------------------------------------------
   INVITATIONS
-------------------------------------------------------------------------- */
app.use("/api/invite", invitation_routes_1.default);
/* --------------------------------------------------------------------------
   INQUIRIES
-------------------------------------------------------------------------- */
app.use("/api/inquiries", inquiry_routes_1.default);
/* --------------------------------------------------------------------------
   ORDERS
-------------------------------------------------------------------------- */
app.use("/api/orders", order_routes_1.default);
/* --------------------------------------------------------------------------
   PAYMENTS
-------------------------------------------------------------------------- */
app.use("/api/payments", payment_routes_1.default);
/* --------------------------------------------------------------------------
   BOOK PREVIEW / AI
-------------------------------------------------------------------------- */
app.use("/api", bookPreview_routes_1.default);
/* --------------------------------------------------------------------------
   ADMIN AUTHENTICATION
-------------------------------------------------------------------------- */
app.use("/api/auth", auth_routes_1.default);
/* ==========================================================================
   API 404 HANDLER

   IMPORTANT:
   This MUST be AFTER all API routes.
========================================================================== */
app.use((req, res) => {
    console.warn("❌ API route not found:", req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        error: "API endpoint not found",
        method: req.method,
        path: req.originalUrl,
    });
});
/* ==========================================================================
   GLOBAL ERROR HANDLER
========================================================================== */
app.use((err, req, res, _next) => {
    console.error("");
    console.error("========================================");
    console.error("❌ GLOBAL SERVER ERROR");
    console.error("========================================");
    console.error("Method:", req.method);
    console.error("URL:", req.originalUrl);
    console.error("Error:", err);
    console.error("========================================");
    console.error("");
    if (res.headersSent) {
        return;
    }
    const status = Number(err?.status) ||
        Number(err?.statusCode) ||
        500;
    res.status(status).json({
        success: false,
        error: err?.message ||
            "Internal Server Error",
        ...(isDevelopment && {
            stack: err?.stack,
        }),
    });
});
/* ==========================================================================
   SERVER START
========================================================================== */
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("========================================");
    console.log("🚀 COZY BOOK NOOK SERVER STARTED");
    console.log("========================================");
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🌐 Local API: http://localhost:${PORT}`);
    console.log(`❤️ Health: http://localhost:${PORT}/health`);
    console.log(`📚 Books: http://localhost:${PORT}/api/books`);
    console.log(`🔐 Admin Books: http://localhost:${PORT}/api/admin/books`);
    console.log(`📨 Inquiries: http://localhost:${PORT}/api/inquiries`);
    console.log(`📨 Inquiry Health: http://localhost:${PORT}/api/inquiries/health`);
    console.log(`🖼️ Cover Upload: http://localhost:${PORT}/api/upload-cover`);
    console.log(`📕 PDF Upload: http://localhost:${PORT}/api/upload-pdf`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🔐 Auth Bypass: ${BYPASS_AUTH
        ? "⚠️ ENABLED"
        : "✓ DISABLED"}`);
    console.log("========================================");
    console.log("📧 EMAIL CONFIGURATION");
    console.log("SMTP Host:", process.env.SMTP_HOST ||
        "Missing");
    console.log("SMTP User:", process.env.SMTP_USER ||
        "Missing");
    console.log("Admin Email:", process.env.ADMIN_EMAIL ||
        "Missing");
    console.log("SMTP Password:", process.env.SMTP_PASS
        ? "✓ Loaded"
        : "✗ Missing");
    console.log("========================================");
    if (BYPASS_AUTH) {
        console.warn("⚠️ WARNING: Authentication is BYPASSED");
    }
    console.log("");
});
/* ==========================================================================
   SERVER ERROR HANDLING
========================================================================== */
server.on("error", (error) => {
    console.error("❌ HTTP SERVER ERROR:", error);
    if (error?.code ===
        "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
    }
});
/* ==========================================================================
   GRACEFUL SHUTDOWN
========================================================================== */
const shutdown = (signal) => {
    console.log("");
    console.log(`🛑 Received ${signal}. Shutting down server...`);
    server.close(() => {
        console.log("✅ HTTP server closed.");
        process.exit(0);
    });
    setTimeout(() => {
        console.error("⚠️ Forced shutdown.");
        process.exit(1);
    }, 10000);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
/* ==========================================================================
   UNHANDLED ERRORS
========================================================================== */
process.on("unhandledRejection", (reason) => {
    console.error("❌ UNHANDLED PROMISE REJECTION:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("❌ UNCAUGHT EXCEPTION:", error);
});
exports.default = app;
//# sourceMappingURL=server.js.map