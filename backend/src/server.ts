import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import bookRoutes from "./routes/book.routes";
import adminBookRoutes from "./routes/admin.book.routes";
import uploadRoutes from "./routes/upload.routes";
import checkoutRoutes from "./routes/checkout.routes";
import invitationRoutes from "./routes/invitation.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import bookPreviewRoutes from "./routes/bookPreview.routes";
import authRoutes from "./routes/auth.routes";
import adminUserRoutes from "./routes/admin.user.routes";
import blogRoutes from "./routes/blog.routes";

// Load environment variables
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/* ==========================================================================
   MIDDLEWARE
========================================================================== */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ==========================================================================
   STATIC FILES
========================================================================== */

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* ==========================================================================
   HEALTH CHECK
========================================================================== */

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Cozy Book Nook API is running.",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================================
   API INFORMATION
========================================================================== */

app.get("/api", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Cozy Book Nook API",

    endpoints: {
      health: "/health",

      // Books
      books: "/api/books",
      adminBooks: "/api/admin/books",

      // Blogs
      blogs: "/api/blogs",
      adminBlogs: "/api/blogs/admin",

      // Authentication
      auth: "/api/auth",

      // Admin users
      adminUsers: "/api/admin/users",

      // Checkout
      checkout: "/api/checkout",

      // Orders
      orders: "/api/orders",

      // Payments
      payments: "/api/payments",

      // Inquiries
      inquiries: "/api/inquiries",

      // Invitations
      invitations: "/api/invite",

      // Uploads
      uploads: "/api/uploads",
    },
  });
});

/* ==========================================================================
   API ROUTES
========================================================================== */

/* --------------------------------------------------------------------------
   BLOG ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/blogs",
  blogRoutes
);

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
   CHECKOUT ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/checkout",
  checkoutRoutes
);

/* --------------------------------------------------------------------------
   INVITATION ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/invite",
  invitationRoutes
);

/* --------------------------------------------------------------------------
   INQUIRY ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/inquiries",
  inquiryRoutes
);

/* --------------------------------------------------------------------------
   ORDER ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/orders",
  orderRoutes
);

/* --------------------------------------------------------------------------
   PAYMENT ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/payments",
  paymentRoutes
);

/* --------------------------------------------------------------------------
   BOOK PREVIEW ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api",
  bookPreviewRoutes
);

/* --------------------------------------------------------------------------
   AUTHENTICATION ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/auth",
  authRoutes
);

/* --------------------------------------------------------------------------
   ADMIN USER ROUTES
-------------------------------------------------------------------------- */

app.use(
  "/api/admin/users",
  adminUserRoutes
);

/* ==========================================================================
   404 HANDLER
========================================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
    path: req.originalUrl,
  });
});

/* ==========================================================================
   GLOBAL ERROR HANDLER
========================================================================== */

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled server error:", error);

    res.status(error?.status || 500).json({
      success: false,
      error:
        error?.message ||
        "An unexpected server error occurred.",
    });
  }
);

/* ==========================================================================
   START SERVER
========================================================================== */

app.listen(PORT, () => {
  console.log("");
  console.log("==================================================");
  console.log("        COZY BOOK NOOK API SERVER");
  console.log("==================================================");
  console.log("");

  console.log(
    `🚀 Server: http://localhost:${PORT}`
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
    `📝 Blogs: http://localhost:${PORT}/api/blogs`
  );

  console.log(
    `🔐 Admin Blogs: http://localhost:${PORT}/api/blogs/admin`
  );

  console.log(
    `👤 Authentication: http://localhost:${PORT}/api/auth`
  );

  console.log(
    `👥 Admin Users: http://localhost:${PORT}/api/admin/users`
  );

  console.log("");
  console.log("==================================================");
  console.log("");
});

