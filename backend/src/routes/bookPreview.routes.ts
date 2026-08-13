// backend/src/routes/bookPreview.routes.ts

import { Router, Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";

const router = Router();

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getSingleParam(
  value: string | string[] | undefined
): string {
  if (!value) {
    throw new Error("Missing required parameter.");
  }

  return Array.isArray(value) ? value[0] : value;
}

/* ==========================================================================
   FREE BOOK INFORMATION
   ========================================================================== */

/**
 * GET /api/books/:id/preview
 *
 * IMPORTANT:
 * This endpoint NO LONGER generates or downloads a PDF.
 *
 * Unpaid users receive only basic book information and summaries.
 */
router.get(
  "/books/:id/preview",
  async (req: Request, res: Response) => {
    try {
      const bookId = getSingleParam(req.params.id);

      console.log("========================================");
      console.log("📖 FREE BOOK INFORMATION REQUEST");
      console.log("Book ID:", bookId);
      console.log("========================================");

      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },

        select: {
          id: true,
          title: true,
          author: true,
          description: true,
          genre: true,
          publishedYear: true,
          pages: true,
          rating: true,

          /*
           * These are text fields and are safe to
           * expose before purchase.
           */
          shortSummary: true,
          pdfSummary: true,
          aiSummary: true,
          keyThemes: true,
          keywords: true,
          readingTime: true,
          targetAudience: true,

          /*
           * Cover is public.
           */
          coverImage: true,

          /*
           * DO NOT return:
           *
           * pdfUrl
           * pdfPreviewImage
           */
        },
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          error: "Book not found.",
        });
      }

      console.log("✅ Book information returned.");

      return res.status(200).json({
        success: true,

        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          genre: book.genre,
          publishedYear: book.publishedYear,
          pages: book.pages,
          rating: book.rating,
          coverImage: book.coverImage,

          /*
           * Free reading information.
           */
          shortSummary: book.shortSummary,
          pdfSummary: book.pdfSummary,
          aiSummary: book.aiSummary,
          keyThemes: book.keyThemes,
          keywords: book.keywords,
          readingTime: book.readingTime,
          targetAudience: book.targetAudience,
        },

        access: {
          purchased: false,
          fullPdfAvailableAfterPurchase: true,
        },
      });
    } catch (error: any) {
      console.error(
        "❌ Failed to get free book information:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Unable to retrieve book information.",
      });
    }
  }
);

/* ==========================================================================
   FULL PDF ACCESS
   ========================================================================== */

/**
 * GET /api/books/:id/access?transactionCode=XXXX
 *
 * Full PDF access is ONLY granted after successful
 * purchase verification.
 */
router.get(
  "/books/:id/access",
  async (req: Request, res: Response) => {
    try {
      const bookId = getSingleParam(req.params.id);

      const transactionCode =
        typeof req.query.transactionCode === "string"
          ? req.query.transactionCode.trim()
          : "";

      console.log("========================================");
      console.log("🔐 FULL BOOK ACCESS REQUEST");
      console.log("Book ID:", bookId);
      console.log(
        "Transaction:",
        transactionCode ? "PROVIDED" : "MISSING"
      );
      console.log("========================================");

      /* ----------------------------------------------------------------------
         1. Validate transaction code
         ---------------------------------------------------------------------- */

      if (!transactionCode) {
        return res.status(401).json({
          success: false,
          error: "Purchase verification is required.",
        });
      }

      /* ----------------------------------------------------------------------
         2. Verify purchase
         ---------------------------------------------------------------------- */

      const order = await prisma.order.findFirst({
        where: {
          bookId,

          transactionCode,

          status: {
            in: [
              "PAID",
              "paid",
              "COMPLETED",
              "completed",
              "SUCCESS",
              "success",
            ],
          },
        },

        select: {
          id: true,
          bookId: true,
          transactionCode: true,
          status: true,
        },
      });

      if (!order) {
        console.log(
          "❌ Purchase verification failed."
        );

        return res.status(403).json({
          success: false,
          error:
            "This book has not been purchased or the purchase could not be verified.",
        });
      }

      console.log("✅ Purchase verified.");
      console.log("Order ID:", order.id);

      /* ----------------------------------------------------------------------
         3. Find book
         ---------------------------------------------------------------------- */

      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },

        select: {
          id: true,
          title: true,
          author: true,
          pdfUrl: true,
        },
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          error: "Book not found.",
        });
      }

      if (!book.pdfUrl) {
        return res.status(404).json({
          success: false,
          error: "Full PDF is not available.",
        });
      }

      /* ----------------------------------------------------------------------
         4. Download PDF from Cloudinary
         ---------------------------------------------------------------------- */

      console.log(
        "📥 Downloading purchased PDF..."
      );

      console.log(
        "PDF URL:",
        book.pdfUrl
      );

      const response =
        await axios.get<ArrayBuffer>(
          book.pdfUrl,
          {
            responseType: "arraybuffer",
            timeout: 120000,

            /*
             * These options are intentionally kept
             * compatible with Axios versions that
             * may be installed in the project.
             */
            validateStatus: (status) =>
              status >= 200 && status < 300,
          }
        );

      const pdfBuffer = Buffer.from(
        response.data as ArrayBuffer
      );

      if (!pdfBuffer.length) {
        throw new Error(
          "Downloaded PDF is empty."
        );
      }

      console.log(
        "✅ PDF downloaded successfully."
      );

      console.log(
        "PDF size:",
        (
          pdfBuffer.length /
          1024 /
          1024
        ).toFixed(2),
        "MB"
      );

      /* ----------------------------------------------------------------------
         5. Send FULL PDF
         ---------------------------------------------------------------------- */

      console.log(
        "🔓 Sending full PDF to verified customer."
      );

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `inline; filename="${sanitizeFilename(
          book.title
        )}.pdf"`
      );

      res.setHeader(
        "Content-Length",
        pdfBuffer.length
      );

      /*
       * Prevent browser/proxy caching.
       */
      res.setHeader(
        "Cache-Control",
        "private, no-store, max-age=0"
      );

      res.setHeader(
        "Pragma",
        "no-cache"
      );

      return res.send(pdfBuffer);
    } catch (error: any) {
      console.error(
        "❌ Full PDF access failed:",
        error?.response?.status ||
          error?.message ||
          error
      );

      if (error?.response) {
        console.error(
          "Cloudinary response status:",
          error.response.status
        );

        console.error(
          "Cloudinary response headers:",
          error.response.headers
        );
      }

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Unable to provide full book access.",
      });
    }
  }
);

/* ==========================================================================
   FILE NAME HELPER
   ========================================================================== */

function sanitizeFilename(
  filename: string
): string {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150) || "book";
}

/* ==========================================================================
   EXPORT
   ========================================================================== */

export default router;