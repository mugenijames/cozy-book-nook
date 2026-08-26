// backend/src/server.ts

import "dotenv/config";

import express, {
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import path from "path";
import fs from "fs";

/* ==========================================================================
   ROUTES
========================================================================== */

import bookRoutes from "./routes/book.routes";
import adminBookRoutes from "./routes/admin.book.routes";
import checkoutRoutes from "./routes/checkout.routes";
import uploadRoutes from "./routes/upload.routes";
import invitationRoutes from "./routes/invitation.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import bookPreviewRoutes from "./routes/bookPreview.routes";
import authRoutes from "./routes/auth.routes";

/* ==========================================================================
   ENVIRONMENT
========================================================================== */

const NODE_ENV =
  process.env.NODE_ENV || "development";

const PORT = parseInt(
  process.env.PORT || "5000",
  10
);

const isDevelopment =
  NODE_ENV === "development";

/*
 * Authentication bypass must NEVER happen automatically.
 *
 * Enable explicitly with:
 *
 * BYPASS_AUTH=true
 */

const BYPASS_AUTH =
  process.env.BYPASS_AUTH === "true";

/* ==========================================================================
   EMAIL CONFIGURATION STATUS
========================================================================== */

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
);

const adminEmail =
  process.env.ADMIN_EMAIL ||
  process.env.SMTP_USER ||
  "davidemuria9780@gmail.com";

/* ==========================================================================
   ENVIRONMENT STATUS
========================================================================== */

console.log("");
console.log("========================================");
console.log("📚 COZY BOOK NOOK BACKEND");
console.log("========================================");

console.log("Environment:", NODE_ENV);
console.log("Port:", PORT);

console.log(
  "Database URL:",
  process.env.DATABASE_URL
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "Direct Database URL:",
  process.env.DIRECT_URL
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "Cloudinary:",
  process.env.CLOUDINARY_CLOUD_NAME
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "Anthropic:",
  process.env.ANTHROPIC_API_KEY
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "OpenAI:",
  process.env.OPENAI_API_KEY
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "Stripe:",
  process.env.STRIPE_SECRET_KEY
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "M-Pesa Consumer Key:",
  process.env.MPESA_CONSUMER_KEY
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "PayPal:",
  process.env.PAYPAL_CLIENT_ID
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "SMTP Host:",
  process.env.SMTP_HOST
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "SMTP User:",
  process.env.SMTP_USER
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "SMTP Password:",
  process.env.SMTP_PASS
    ? "✓ Loaded"
    : "✗ Missing"
);

console.log(
  "SMTP Port:",
  process.env.SMTP_PORT || "587"
);

console.log(
  "SMTP Secure:",
  process.env.SMTP_SECURE || "false"
);

console.log(
  "Admin Email:",
  adminEmail
);

console.log(
  "Email Service:",
  smtpConfigured
    ? "✓ CONFIGURED"
    : "✗ NOT CONFIGURED"
);

console.log(
  "Authentication Bypass:",
  BYPASS_AUTH
    ? "⚠️ ENABLED"
    : "✓ Disabled"
);

console.log("========================================");
console.log("");

/* ==========================================================================
   EXPRESS APP
========================================================================== */

const app = express();

/* ==========================================================================
   TRUST PROXY
========================================================================== */

/*
 * Render sits behind a proxy.
 * This allows Express to correctly understand
 * forwarded requests and HTTPS.
 */

app.set("trust proxy", 1);

/* ==========================================================================
   UPLOADS DIRECTORY
========================================================================== */

const uploadsDir = path.resolve(
  __dirname,
  "../uploads"
);

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {
      recursive: true,
    });

    console.log(
      "📁 Created uploads directory:",
      uploadsDir
    );
  } else {
    console.log(
      "📁 Uploads directory:",
      uploadsDir
    );
  }
} catch (error) {
  console.error(
    "❌ Failed to create uploads directory:",
    error
  );
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
].filter(
  (
    origin
  ): origin is string =>
    Boolean(origin)
);

console.log(
  "🌐 Allowed CORS origins:",
  allowedOrigins
);

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      /*
       * Requests without an Origin:
       *
       * - curl
       * - Postman
       * - server-to-server requests
       */

      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.warn(
        "⚠️ CORS blocked origin:",
        origin
      );

      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
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
  })
);

/* ==========================================================================
   BODY PARSERS
========================================================================== */

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

/* ==========================================================================
   REQUEST LOGGER
========================================================================== */

app.use(
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const url =
      req.originalUrl || req.url;

    if (
      !url.includes("favicon")
    ) {
      console.log(
        `>>> ${req.method} ${url}`
      );
    }

    next();
  }
);

/* ==========================================================================
   STATIC UPLOADS
========================================================================== */

app.use(
  "/uploads",
  express.static(uploadsDir)
);

/* ==========================================================================
   HEALTH CHECK
========================================================================== */

app.get(
  "/health",
  (
    _req: Request,
    res: Response
  ) => {
    res.status(200).json({
      status: "OK",

      service: "Cozy Book Nook Backend",

      environment: NODE_ENV,

      timestamp:
        new Date().toISOString(),

      port: PORT,

      auth_bypass:
        BYPASS_AUTH,

      database:
        process.env.DATABASE_URL
          ? "configured"
          : "missing",

      services: {
        cloudinary: Boolean(
          process.env
            .CLOUDINARY_CLOUD_NAME
        ),

        anthropic: Boolean(
          process.env
            .ANTHROPIC_API_KEY
        ),

        openai: Boolean(
          process.env
            .OPENAI_API_KEY
        ),

        stripe: Boolean(
          process.env
            .STRIPE_SECRET_KEY
        ),

        mpesa: Boolean(
          process.env
            .MPESA_CONSUMER_KEY
        ),

        paypal: Boolean(
          process.env
            .PAYPAL_CLIENT_ID
        ),

        email: smtpConfigured,
      },

      email: {
        configured:
          smtpConfigured,

        smtpHost: Boolean(
          process.env.SMTP_HOST
        ),

        smtpUser: Boolean(
          process.env.SMTP_USER
        ),

        smtpPassword: Boolean(
          process.env.SMTP_PASS
        ),

        smtpPort:
          Number(
            process.env.SMTP_PORT ||
              587
          ),

        smtpSecure:
          process.env.SMTP_SECURE ===
          "true",

        adminEmail,
      },
    });
  }
);

/* ==========================================================================
   ROOT API
========================================================================== */

app.get(
  "/",
  (
    _req: Request,
    res: Response
  ) => {
    res.status(200).json({
      message:
        "Cozy Book Nook API",

      version: "2.1.0",

      status: "running",

      environment: NODE_ENV,

      endpoints: {
        health: "/health",

        books:
          "/api/books",

        adminBooks:
          "/api/admin/books",

        checkout:
          "/api/checkout",

        uploadCover:
          "/api/upload-cover",

        uploadPdf:
          "/api/upload-pdf",

        bookPreview:
          "/api/books/:id/generate-preview",

        inquiries:
          "/api/inquiries",

        inquiryHealth:
          "/api/inquiries/health",

        orders:
          "/api/orders",

        payments:
          "/api/payments",

        auth:
          "/api/auth",
      },

      services: {
        email:
          smtpConfigured
            ? "configured"
            : "not configured",
      },
    });
  }
);

/* ==========================================================================
   API ROUTES
========================================================================== */

/* --------------------------------------------------------------------------
   PUBLIC BOOK ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/books",
  bookRoutes
);

/* --------------------------------------------------------------------------
   ADMIN BOOK ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/admin/books",
  adminBookRoutes
);

/* --------------------------------------------------------------------------
   UPLOAD ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api",
  uploadRoutes
);

/* --------------------------------------------------------------------------
   CHECKOUT
-------------------------------------------------------------------------- */

app.use(
  "/api/checkout",
  checkoutRoutes
);

/* --------------------------------------------------------------------------
   INVITATIONS
-------------------------------------------------------------------------- */

app.use(
  "/api/invite",
  invitationRoutes
);

/* --------------------------------------------------------------------------
   INQUIRIES
-------------------------------------------------------------------------- */

/*
 * IMPORTANT:
 *
 * inquiry.routes.ts contains:
 *
 * router.post("/")
 * router.get("/health")
 *
 * Therefore:
 *
 * /api/inquiries
 * /api/inquiries/health
 */

app.use(
  "/api/inquiries",
  inquiryRoutes
);

/* --------------------------------------------------------------------------
   ORDERS
-------------------------------------------------------------------------- */

app.use(
  "/api/orders",
  orderRoutes
);

/* --------------------------------------------------------------------------
   PAYMENTS
-------------------------------------------------------------------------- */

app.use(
  "/api/payments",
  paymentRoutes
);

/* --------------------------------------------------------------------------
   BOOK PREVIEW / AI
-------------------------------------------------------------------------- */

app.use(
  "/api",
  bookPreviewRoutes
);

/* --------------------------------------------------------------------------
   ADMIN AUTHENTICATION
-------------------------------------------------------------------------- */

app.use(
  "/api/auth",
  authRoutes
);

/* ==========================================================================
   API 404 HANDLER
========================================================================== */

/*
 * IMPORTANT:
 *
 * This MUST remain AFTER every app.use("/api/...", ...)
 */

app.use(
  (
    req: Request,
    res: Response
  ) => {
    console.warn(
      "❌ API route not found:",
      req.method,
      req.originalUrl
    );

    res.status(404).json({
      success: false,

      error:
        "API endpoint not found",

      method:
        req.method,

      path:
        req.originalUrl,
    });
  }
);

/* ==========================================================================
   GLOBAL ERROR HANDLER
========================================================================== */

app.use(
  (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("");

    console.error(
      "========================================"
    );

    console.error(
      "❌ GLOBAL SERVER ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Method:",
      req.method
    );

    console.error(
      "URL:",
      req.originalUrl
    );

    console.error(
      "Error:",
      err
    );

    console.error(
      "========================================"
    );

    if (res.headersSent) {
      return;
    }

    const status =
      Number(err?.status) ||
      Number(err?.statusCode) ||
      500;

    res.status(status).json({
      success: false,

      error:
        err?.message ||
        "Internal Server Error",

      ...(isDevelopment && {
        stack: err?.stack,
      }),
    });
  }
);

/* ==========================================================================
   SERVER START
========================================================================== */

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");

    console.log(
      "========================================"
    );

    console.log(
      "🚀 COZY BOOK NOOK SERVER STARTED"
    );

    console.log(
      "========================================"
    );

    console.log(
      `🌐 Port: ${PORT}`
    );

    console.log(
      `🌐 Local API: http://localhost:${PORT}`
    );

    console.log(
      `❤️ Health: http://localhost:${PORT}/health`
    );

    console.log(
      `📚 Books: http://localhost:${PORT}/api/books`
    );

    console.log(
      `🔐 Admin Books: http://localhost:${PORT}/api/admin/books`
    );

    console.log(
      `📨 Inquiries: http://localhost:${PORT}/api/inquiries`
    );

    console.log(
      `📨 Inquiry Health: http://localhost:${PORT}/api/inquiries/health`
    );

    console.log(
      `🖼️ Cover Upload: http://localhost:${PORT}/api/upload-cover`
    );

    console.log(
      `📕 PDF Upload: http://localhost:${PORT}/api/upload-pdf`
    );

    console.log(
      `📁 Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      `🌍 Environment: ${NODE_ENV}`
    );

    console.log(
      `🔐 Auth Bypass: ${
        BYPASS_AUTH
          ? "⚠️ ENABLED"
          : "✓ DISABLED"
      }`
    );

    console.log("");

    console.log(
      "========================================"
    );

    console.log(
      "📧 EMAIL CONFIGURATION"
    );

    console.log(
      "========================================"
    );

    console.log(
      "SMTP Host:",
      process.env.SMTP_HOST ||
        "Missing"
    );

    console.log(
      "SMTP User:",
      process.env.SMTP_USER ||
        "Missing"
    );

    console.log(
      "SMTP Port:",
      process.env.SMTP_PORT ||
        "587"
    );

    console.log(
      "SMTP Secure:",
      process.env.SMTP_SECURE ||
        "false"
    );

    console.log(
      "Admin Email:",
      adminEmail
    );

    console.log(
      "SMTP Password:",
      process.env.SMTP_PASS
        ? "✓ Loaded"
        : "✗ Missing"
    );

    console.log(
      "Email Service:",
      smtpConfigured
        ? "✓ READY"
        : "✗ NOT CONFIGURED"
    );

    console.log(
      "========================================"
    );

    if (BYPASS_AUTH) {
      console.warn(
        "⚠️ WARNING: Authentication is BYPASSED"
      );
    }

    if (!smtpConfigured) {
      console.warn(
        "⚠️ WARNING: SMTP email service is NOT configured."
      );
    }

    console.log("");
  }
);

/* ==========================================================================
   SERVER ERROR HANDLING
========================================================================== */

server.on(
  "error",
  (error: any) => {
    console.error(
      "❌ HTTP SERVER ERROR:",
      error
    );

    if (
      error?.code ===
      "EADDRINUSE"
    ) {
      console.error(
        `❌ Port ${PORT} is already in use.`
      );
    }
  }
);

/* ==========================================================================
   GRACEFUL SHUTDOWN
========================================================================== */

const shutdown = (
  signal: string
) => {
  console.log("");

  console.log(
    `🛑 Received ${signal}. Shutting down server...`
  );

  server.close(
    () => {
      console.log(
        "✅ HTTP server closed."
      );

      process.exit(0);
    }
  );

  setTimeout(() => {
    console.error(
      "⚠️ Forced shutdown."
    );

    process.exit(1);
  }, 10000);
};

process.on(
  "SIGTERM",
  () =>
    shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () =>
    shutdown("SIGINT")
);

/* ==========================================================================
   UNHANDLED ERRORS
========================================================================== */

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "❌ UNHANDLED PROMISE REJECTION:",
      reason
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ UNCAUGHT EXCEPTION:",
      error
    );
  }
);

/* ==========================================================================
   EXPORT
========================================================================== */

export default app;