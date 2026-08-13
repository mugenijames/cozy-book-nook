// backend/src/routes/bookPreview.routes.ts

import {
  Router,
  Request,
  Response,
} from "express";

import { prisma } from "../lib/prisma";

import {
  generateBookPreview,
} from "../services/bookPreview.service";

const router =
  Router();

/* ==========================================================================
   HELPER
   ========================================================================== */

function getSingleParam(
  value:
    | string
    | string[]
    | undefined
): string {
  if (!value) {
    throw new Error(
      "Missing required parameter"
    );
  }

  return Array.isArray(value)
    ? value[0]
    : value;
}

/* ==========================================================================
   GENERATE PREVIEW
   ========================================================================== */

/**
 * POST
 *
 * /api/books/:id/generate-preview
 */
router.post(
  "/books/:id/generate-preview",

  async (
    req: Request,
    res: Response
  ) => {
    try {
      const bookId =
        getSingleParam(
          req.params.id
        );

      console.log(
        "========================================"
      );

      console.log(
        "🖼️ GENERATE PREVIEW REQUEST"
      );

      console.log(
        "Book ID:",
        bookId
      );

      console.log(
        "========================================"
      );

      const previewUrl =
        await generateBookPreview(
          bookId
        );

      return res.status(200).json({
        success: true,

        bookId,

        previewUrl,
      });
    } catch (error: any) {
      console.error(
        "❌ Preview generation failed:",
        error
      );

      return res.status(500).json({
        success: false,

        error:
          error?.message ||
          "Failed to generate book preview.",
      });
    }
  }
);

/* ==========================================================================
   GET PREVIEW
   ========================================================================== */

/**
 * GET
 *
 * /api/books/:id/preview
 *
 * Returns ONLY the protected 3-page preview.
 *
 * NEVER returns the original pdfUrl.
 */
router.get(
  "/books/:id/preview",

  async (
    req: Request,
    res: Response
  ) => {
    try {
      const bookId =
        getSingleParam(
          req.params.id
        );

      const book =
        await prisma.book.findUnique({
          where: {
            id: bookId,
          },

          select: {
            id: true,
            title: true,
            pdfPreviewImage: true,
          },
        });

      if (!book) {
        return res.status(404).json({
          success: false,
          error: "Book not found.",
        });
      }

      if (
        !book.pdfPreviewImage
      ) {
        return res.status(404).json({
          success: false,

          error:
            "Preview has not been generated for this book yet.",
        });
      }

      return res.status(200).json({
        success: true,

        bookId:
          book.id,

        title:
          book.title,

        previewUrl:
          book.pdfPreviewImage,
      });
    } catch (error: any) {
      console.error(
        "❌ Failed to retrieve preview:",
        error
      );

      return res.status(500).json({
        success: false,

        error:
          error?.message ||
          "Failed to retrieve book preview.",
      });
    }
  }
);

/* ==========================================================================
   FULL PDF ACCESS
   ========================================================================== */

/**
 * GET
 *
 * /api/books/:id/access?transactionCode=XXXX
 *
 * Only verified purchasers receive the original PDF.
 */
router.get(
  "/books/:id/access",

  async (
    req: Request,
    res: Response
  ) => {
    try {
      const bookId =
        getSingleParam(
          req.params.id
        );

      const transactionCode =
        typeof req.query
          .transactionCode ===
        "string"
          ? req.query
              .transactionCode
              .trim()
          : "";

      if (!transactionCode) {
        return res.status(401).json({
          success: false,

          error:
            "Purchase verification is required.",
        });
      }

      /* --------------------------------------------------------------------
         VERIFY ORDER
         -------------------------------------------------------------------- */

      const order =
        await prisma.order.findFirst({
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
        return res.status(403).json({
          success: false,

          error:
            "This book has not been purchased or the purchase could not be verified.",
        });
      }

      /* --------------------------------------------------------------------
         GET ORIGINAL PDF
         -------------------------------------------------------------------- */

      const book =
        await prisma.book.findUnique({
          where: {
            id: bookId,
          },

          select: {
            id: true,
            title: true,
            pdfUrl: true,
          },
        });

      if (!book) {
        return res.status(404).json({
          success: false,

          error:
            "Book not found.",
        });
      }

      if (!book.pdfUrl) {
        return res.status(404).json({
          success: false,

          error:
            "The full PDF is not available.",
        });
      }

      console.log(
        "🔓 Full PDF access granted:",
        {
          bookId:
            book.id,

          title:
            book.title,

          transactionCode,
        }
      );

      return res.status(200).json({
        success: true,

        bookId:
          book.id,

        title:
          book.title,

        pdfUrl:
          book.pdfUrl,
      });
    } catch (error: any) {
      console.error(
        "❌ Full book access failed:",
        error
      );

      return res.status(500).json({
        success: false,

        error:
          error?.message ||
          "Failed to verify book purchase.",
      });
    }
  }
);

export default router;