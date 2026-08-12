// backend/src/routes/bookPreview.routes.ts

import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateBookPreview } from "../services/bookPreview.service";

const router = Router();

/* -------------------------------------------------------------------------- */
/* HELPER                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Express can type route parameters as string | string[].
 * We only want the first value as a string.
 */
function getSingleParam(
  value: string | string[] | undefined
): string {
  if (!value) {
    throw new Error("Missing required parameter");
  }

  return Array.isArray(value) ? value[0] : value;
}

/* -------------------------------------------------------------------------- */
/* GENERATE BOOK PREVIEW                                                      */
/* -------------------------------------------------------------------------- */

/**
 * POST /api/books/:id/generate-preview
 *
 * Generates the protected/limited preview for a book.
 *
 * This endpoint does NOT expose the full PDF.
 */
router.post(
  "/books/:id/generate-preview",
  async (req: Request, res: Response) => {
    try {
      const bookId = getSingleParam(req.params.id);

      console.log(
        "🖼️ Generating protected preview:",
        bookId
      );

      const previewUrl =
        await generateBookPreview(bookId);

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

/* -------------------------------------------------------------------------- */
/* GET BOOK PREVIEW                                                           */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/books/:id/preview
 *
 * Returns the limited preview URL.
 *
 * IMPORTANT:
 * This does NOT return book.pdfUrl.
 */
router.get(
  "/books/:id/preview",
  async (req: Request, res: Response) => {
    try {
      const bookId = getSingleParam(req.params.id);

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
          error: "Book not found.",
        });
      }

      if (!book.pdfPreviewImage) {
        return res.status(404).json({
          error:
            "Preview has not been generated for this book yet.",
        });
      }

      return res.status(200).json({
        success: true,
        bookId: book.id,
        title: book.title,
        previewUrl: book.pdfPreviewImage,
      });
    } catch (error: any) {
      console.error(
        "❌ Failed to get book preview:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to retrieve book preview.",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* GET FULL BOOK AFTER PURCHASE                                               */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/books/:id/access?transactionCode=XXXX
 *
 * Verifies that the book was purchased before
 * providing access to the full PDF.
 *
 * The public books endpoints NEVER expose pdfUrl.
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

      /* -------------------------------------------------------------------- */
      /* VALIDATE REQUEST                                                     */
      /* -------------------------------------------------------------------- */

      if (!transactionCode) {
        return res.status(401).json({
          error:
            "Purchase verification is required.",
        });
      }

      /* -------------------------------------------------------------------- */
      /* VERIFY PURCHASE                                                      */
      /* -------------------------------------------------------------------- */

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
          error:
            "This book has not been purchased or the purchase could not be verified.",
        });
      }

      /* -------------------------------------------------------------------- */
      /* GET PRIVATE PDF                                                      */
      /* -------------------------------------------------------------------- */

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
          error: "Book not found.",
        });
      }

      if (!book.pdfUrl) {
        return res.status(404).json({
          error:
            "The full PDF is not available.",
        });
      }

      /* -------------------------------------------------------------------- */
      /* PURCHASE VERIFIED                                                    */
      /* -------------------------------------------------------------------- */

      console.log(
        "🔓 Full PDF access granted:",
        {
          bookId: book.id,
          title: book.title,
          transactionCode,
        }
      );

      return res.status(200).json({
        success: true,
        bookId: book.id,
        title: book.title,
        pdfUrl: book.pdfUrl,
      });
    } catch (error: any) {
      console.error(
        "❌ Full book access failed:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to verify book purchase.",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default router;