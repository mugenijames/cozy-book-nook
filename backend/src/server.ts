import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import bookRoutes from "./routes/book.routes";
import checkoutRoutes from "./routes/checkout.routes";
import uploadRoutes from "./routes/upload.routes";
import invitationRoutes from "./routes/invitation.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import bookPreviewRoutes from "./routes/bookPreview.routes";

dotenv.config();

/* ==========================================================================
   ENVIRONMENT / SERVICE STATUS
   ========================================================================== */

console.log(
  "OpenAI Key Loaded:",
  process.env.OPENAI_API_KEY ? "YES" : "NO"
);

console.log(
  "Database URL Loaded:",
  process.env.DATABASE_URL ? "YES" : "NO"
);

console.log(
  "Cloudinary Loaded:",
  process.env.CLOUDINARY_CLOUD_NAME ? "YES" : "NO"
);

/* ==========================================================================
   APP
   ========================================================================== */

const app = express();

/* ==========================================================================
   ENVIRONMENT
   ========================================================================== */

const isDevelopment =
  process.env.NODE_ENV === "development";

const BYPASS_AUTH =
  isDevelopment ||
  process.env.BYPASS_AUTH === "true";

/* ==========================================================================
   UPLOADS DIRECTORY
   ========================================================================== */

const uploadsDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });

  console.log(
    "Created uploads directory:",
    uploadsDir
  );
}

/* ==========================================================================
   CORS
   ========================================================================== */

const allowedOrigins = [
  "http://localhost:8080",
  "http://192.168.100.8:8080",
  "http://localhost:3000",
  "https://emuriadavid.netlify.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

console.log(
  "Allowed CORS origins:",
  allowedOrigins
);

app.use(
  cors({
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
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    if (
      !req.originalUrl.includes("favicon")
    ) {
      console.log(
        `>>> ${req.method} ${req.originalUrl}`
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
   API ROUTES
   ========================================================================== */

/*
 * Books
 *
 * GET    /api/books
 * GET    /api/books/:id
 * POST   /api/books
 * PUT    /api/books/:id
 * DELETE /api/books/:id
 */
app.use(
  "/api/books",
  bookRoutes
);

/*
 * Checkout
 */
app.use(
  "/api/checkout",
  checkoutRoutes
);

/*
 * Uploads
 *
 * /api/upload-cover
 * /api/upload-pdf
 */
app.use(
  "/api",
  uploadRoutes
);

/*
 * Invitations
 */
app.use(
  "/api/invite",
  invitationRoutes
);

/*
 * Orders
 */
app.use(
  "/api/orders",
  orderRoutes
);

/*
 * Payments
 */
app.use(
  "/api/payments",
  paymentRoutes
);

/*
 * Book preview / AI summary routes
 *
 * These may include endpoints such as:
 *
 * GET  /api/books/:id/preview
 * POST /api/books/:id/generate-preview
 * POST /api/books/:id/generate-summary
 *
 * depending on your bookPreview.routes.ts implementation.
 */
app.use(
  "/api",
  bookPreviewRoutes
);

/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

app.get(
  "/health",
  (_req, res) => {
    res.json({
      status: "OK",

      environment:
        process.env.NODE_ENV ||
        "development",

      auth_bypass:
        BYPASS_AUTH,

      timestamp:
        new Date().toISOString(),

      database:
        process.env.DATABASE_URL
          ? "configured"
          : "missing",

      services: {
        openai:
          !!process.env.OPENAI_API_KEY,

        stripe:
          !!process.env.STRIPE_SECRET_KEY,

        mpesa:
          !!process.env.MPESA_CONSUMER_KEY,

        paypal:
          !!process.env.PAYPAL_CLIENT_ID,

        cloudinary:
          !!process.env.CLOUDINARY_CLOUD_NAME,

        email:
          !!process.env.SMTP_HOST,
      },
    });
  }
);

/* ==========================================================================
   ROOT
   ========================================================================== */

app.get(
  "/",
  (_req, res) => {
    res.json({
      message:
        "Cozy Book Nook API",

      version:
        "2.0.0",

      status:
        "running",

      endpoints: {
        books:
          "/api/books",

        checkout:
          "/api/checkout/status",

        uploadCover:
          "/api/upload-cover",

        uploadPdf:
          "/api/upload-pdf",

        payments:
          "/api/payments",

        health:
          "/health",
      },
    });
  }
);

/* ==========================================================================
   GLOBAL ERROR HANDLER
   ========================================================================== */

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(
      "Global Error:",
      err
    );

    res
      .status(
        err?.status || 500
      )
      .json({
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
   SERVER
   ========================================================================== */

const PORT = parseInt(
  process.env.PORT || "5000",
  10
);

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "========================================"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      "Environment:",
      process.env.NODE_ENV ||
        "development"
    );

    console.log(
      "Auth Bypass:",
      BYPASS_AUTH
        ? "ENABLED"
        : "DISABLED"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Books API:",
      "/api/books"
    );

    console.log(
      "Checkout API:",
      "/api/checkout/status"
    );

    console.log(
      "Upload Cover API:",
      "/api/upload-cover"
    );

    console.log(
      "Upload PDF API:",
      "/api/upload-pdf"
    );

    console.log(
      "Book Preview API:",
      "/api/*preview*"
    );

    console.log(
      "Payments API:",
      "/api/payments"
    );

    console.log(
      "Health Check:",
      "/health"
    );

    console.log(
      "Uploads Directory:",
      uploadsDir
    );

    console.log(
      "========================================"
    );

    console.log(
      "Email Configuration"
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
        ? "Loaded"
        : "Missing"
    );

    console.log(
      "========================================"
    );

    if (BYPASS_AUTH) {
      console.log(
        "WARNING: Authentication is BYPASSED"
      );
    }
  }
);

export default app;