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

const BYPASS_AUTH =
  isDevelopment ||
  process.env.BYPASS_AUTH === "true";

/* ==========================================================================
   ENVIRONMENT STATUS
   ========================================================================== */

console.log("");
console.log("========================================");
console.log("📚 COZY BOOK NOOK BACKEND");
console.log("========================================");

console.log(
  "Environment:",
  NODE_ENV
);

console.log(
  "Port:",
  PORT
);

console.log(
  "Database URL:",
  process.env.DATABASE_URL
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
  "SMTP:",
  process.env.SMTP_HOST
    ? "✓ Loaded"
    : "✗ Missing"
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

/*
 * Frontend:
 *
 * http://localhost:8080
 *
 * Backend:
 *
 * http://localhost:5000
 */

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",

  "http://localhost:3000",
  "http://127.0.0.1:3000",

  "http://192.168.100.8:8080",

  "https://emuriadavid.netlify.app",

  process.env.FRONTEND_URL,
]
  .filter(
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
       * Allow requests without an Origin header.
       *
       * This is useful for:
       * - Postman
       * - curl
       * - server-to-server requests
       */

      if (!origin) {
        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
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
  express.static(
    uploadsDir
  )
);

/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

app.get(
  "/health",
  async (
    _req: Request,
    res: Response
  ) => {
    res.json({
      status: "OK",

      environment:
        NODE_ENV,

      timestamp:
        new Date().toISOString(),

      port:
        PORT,

      auth_bypass:
        BYPASS_AUTH,

      database:
        process.env.DATABASE_URL
          ? "configured"
          : "missing",

      services: {
        cloudinary:
          Boolean(
            process.env
              .CLOUDINARY_CLOUD_NAME
          ),

        anthropic:
          Boolean(
            process.env
              .ANTHROPIC_API_KEY
          ),

        openai:
          Boolean(
            process.env
              .OPENAI_API_KEY
          ),

        stripe:
          Boolean(
            process.env
              .STRIPE_SECRET_KEY
          ),

        mpesa:
          Boolean(
            process.env
              .MPESA_CONSUMER_KEY
          ),

        paypal:
          Boolean(
            process.env
              .PAYPAL_CLIENT_ID
          ),

        email:
          Boolean(
            process.env.SMTP_HOST
          ),
      },
    });
  }
);

/* ==========================================================================
   ROOT
   ========================================================================== */

app.get(
  "/",
  (
    _req: Request,
    res: Response
  ) => {
    res.json({
      message:
        "Cozy Book Nook API",

      version:
        "2.0.0",

      status:
        "running",

      environment:
        NODE_ENV,

      endpoints: {
        health:
          "/health",

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

        orders:
          "/api/orders",

        payments:
          "/api/payments",
      },
    });
  }
);

/* ==========================================================================
   API ROUTES
   ========================================================================== */

/* --------------------------------------------------------------------------
   PUBLIC BOOK ROUTES

   Mounted as:

   GET    /api/books
   GET    /api/books/:id
   POST   /api/books
   PUT    /api/books/:id
   DELETE /api/books/:id

   IMPORTANT:
   Public controller should sanitize pdfUrl.
   -------------------------------------------------------------------------- */

app.use(
  "/api/books",
  bookRoutes
);

/* --------------------------------------------------------------------------
   ADMIN BOOK ROUTES

   Mounted as:

   GET    /api/admin/books
   GET    /api/admin/books/:id
   POST   /api/admin/books
   PUT    /api/admin/books/:id
   DELETE /api/admin/books/:id

   IMPORTANT:
   The admin controller MUST export:

   getAdminBooks
   getAdminBook

   Otherwise TypeScript will fail.
   -------------------------------------------------------------------------- */

app.use(
  "/api/admin/books",
  adminBookRoutes
);

/* --------------------------------------------------------------------------
   UPLOAD ROUTES

   Mounted as:

   POST /api/upload-cover
   POST /api/upload-pdf
   GET  /api/upload-test
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
   DEAR DAD INQUIRIES

   Mounted as:

   POST /api/inquiries
   GET  /api/inquiries/health
   -------------------------------------------------------------------------- */

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
   BOOK PREVIEW / AI ROUTES

   Mounted under /api.

   Your bookPreview.routes.ts determines the exact endpoints.
   -------------------------------------------------------------------------- */

app.use(
  "/api",
  bookPreviewRoutes
);

/* ==========================================================================
   API 404 HANDLER
   ========================================================================== */

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
      error:
        "API endpoint not found",

      method:
        req.method,

      path:
        req.originalUrl,
    });
  }
);

/* --------------------------------------------------------------------------
   ADMIN AUTHENTICATION
   -------------------------------------------------------------------------- */

app.use(
  "/api/auth",
  authRoutes
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
    console.error("");

    if (
      res.headersSent
    ) {
      return;
    }

    const status =
      Number(err?.status) ||
      Number(err?.statusCode) ||
      500;

    res.status(status).json({
      error:
        err?.message ||
        "Internal Server Error",

      ...(isDevelopment && {
        stack:
          err?.stack,
      }),
    });
  }
);

/* ==========================================================================
   SERVER START
   ========================================================================== */

const server =
  app.listen(
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
        `🔐 Auth Bypass: ${BYPASS_AUTH
          ? "⚠️ ENABLED"
          : "✓ DISABLED"
        }`
      );

      console.log(
        "========================================"
      );

      console.log(
        "📧 EMAIL CONFIGURATION"
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
        "Admin Email:",
        process.env.ADMIN_EMAIL ||
        "Missing"
      );

      console.log(
        "SMTP Password:",
        process.env.SMTP_PASS
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "========================================"
      );

      if (BYPASS_AUTH) {
        console.warn(
          "⚠️ WARNING: Authentication is BYPASSED"
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

  setTimeout(
    () => {
      console.error(
        "⚠️ Forced shutdown."
      );

      process.exit(1);
    },
    10000
  );
};

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
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

export default app;