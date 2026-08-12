"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const invitation_routes_1 = __importDefault(require("./routes/invitation.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
dotenv_1.default.config();
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");
console.log("Database URL Loaded:", process.env.DATABASE_URL ? "YES" : "NO");
console.log("Cloudinary Loaded:", process.env.CLOUDINARY_CLOUD_NAME ? "YES" : "NO");
const app = (0, express_1.default)();
const isDevelopment = process.env.NODE_ENV === "development";
const BYPASS_AUTH = isDevelopment ||
    process.env.BYPASS_AUTH === "true";
const uploadsDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, {
        recursive: true,
    });
    console.log("Created uploads directory:", uploadsDir);
}
const allowedOrigins = [
    "http://localhost:8080",
    "http://192.168.100.8:8080",
    "http://localhost:3000",
    "https://emuriadavid.netlify.app",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],
    credentials: true,
}));
app.use(express_1.default.json({
    limit: "50mb",
}));
app.use(express_1.default.urlencoded({
    limit: "50mb",
    extended: true,
}));
app.use((req, res, next) => {
    if (!req.originalUrl.includes("favicon")) {
        console.log(">>> " +
            req.method +
            " " +
            req.originalUrl);
    }
    next();
});
app.use("/uploads", express_1.default.static(uploadsDir));
app.use("/api/books", book_routes_1.default);
app.use("/api/checkout", checkout_routes_1.default);
app.use("/api", upload_routes_1.default);
app.use("/api/invite", invitation_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        environment: process.env.NODE_ENV || "development",
        auth_bypass: BYPASS_AUTH,
        timestamp: new Date().toISOString(),
        database: process.env.DATABASE_URL
            ? "configured"
            : "missing",
        services: {
            openai: !!process.env.OPENAI_API_KEY,
            stripe: !!process.env.STRIPE_SECRET_KEY,
            mpesa: !!process.env.MPESA_CONSUMER_KEY,
            paypal: !!process.env.PAYPAL_CLIENT_ID,
            cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
            email: !!process.env.SMTP_HOST,
        },
    });
});
app.get("/", (req, res) => {
    res.json({
        message: "Cozy Book Nook API",
        version: "2.0.0",
        status: "running",
        endpoints: {
            books: "/api/books",
            checkout: "/api/checkout/status",
            uploadCover: "/api/upload-cover",
            uploadPdf: "/api/upload-pdf",
            payments: "/api/payments",
            health: "/health",
        },
    });
});
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res
        .status(err.status || 500)
        .json({
        error: err.message ||
            "Internal Server Error",
        ...(isDevelopment && {
            stack: err.stack,
        }),
    });
});
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
    console.log("Environment: " +
        (process.env.NODE_ENV ||
            "development"));
    console.log("Auth Bypass: " +
        (BYPASS_AUTH
            ? "ENABLED"
            : "DISABLED"));
    console.log("Books API: /api/books");
    console.log("Checkout API: /api/checkout/status");
    console.log("Upload Cover API: /api/upload-cover");
    console.log("Upload PDF API: /api/upload-pdf");
    console.log("Payments API: /api/payments");
    console.log("Health Check: /health");
    console.log("Uploads Directory: " +
        uploadsDir);
    console.log("");
    console.log("Email Configuration");
    console.log("SMTP Host:", process.env.SMTP_HOST ||
        "Missing");
    console.log("SMTP User:", process.env.SMTP_USER ||
        "Missing");
    console.log("Admin Email:", process.env.ADMIN_EMAIL ||
        "Missing");
    console.log("SMTP Password:", process.env.SMTP_PASS
        ? "Loaded"
        : "Missing");
    if (BYPASS_AUTH) {
        console.log("WARNING: Authentication is BYPASSED");
    }
});
exports.default = app;
