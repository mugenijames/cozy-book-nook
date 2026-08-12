import { Router, Request, Response } from "express";
import { generateBookPreview } from "../services/bookPreview.service";

const router = Router();

/**
 * Generate a preview image for a book's PDF.
 *
 * POST /api/books/:id/generate-preview
 */
router.post(
  "/books/:id/generate-preview",
  async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;

      // Express can type route params as string | string[].
      // We only want the first value.
      const bookId = Array.isArray(idParam)
        ? idParam[0]
        : idParam;

      if (!bookId) {
        return res.status(400).json({
          error: "Book ID is required",
        });
      }

      console.log(
        "🖼️ Generating PDF preview for book:",
        bookId
      );

      const previewUrl =
        await generateBookPreview(bookId);

      if (!previewUrl) {
        return res.status(500).json({
          error:
            "Preview generation failed. No preview URL was returned.",
        });
      }

      console.log(
        "✅ PDF preview generated:",
        previewUrl
      );

      return res.json({
        success: true,
        previewUrl,
      });
    } catch (error: any) {
      console.error(
        "❌ PDF preview generation failed:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to generate PDF preview",
      });
    }
  }
);

export default router;