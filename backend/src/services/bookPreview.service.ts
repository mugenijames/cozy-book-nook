// backend/src/services/bookPreview.service.ts

import { prisma } from "../lib/prisma";

/**
 * Generate a preview image for a book.
 *
 * The book must already have a PDF URL saved in the database.
 *
 * IMPORTANT:
 * This service currently handles the database lookup and
 * prepares the preview-generation flow.
 */
export async function generateBookPreview(
  bookId: string
): Promise<string | null> {
  console.log(
    "🖼️ Starting book preview generation:",
    bookId
  );

  /* ---------------------------------------------------------------------- */
  /* FIND BOOK                                                              */
  /* ---------------------------------------------------------------------- */

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  console.log(
    "📚 Book found:",
    book.title
  );

  /* ---------------------------------------------------------------------- */
  /* CHECK PDF                                                              */
  /* ---------------------------------------------------------------------- */

  if (!book.pdfUrl) {
    throw new Error(
      "This book does not have a PDF attached"
    );
  }

  console.log(
    "📕 PDF URL:",
    book.pdfUrl
  );

  /* ---------------------------------------------------------------------- */
  /* EXISTING PREVIEW                                                       */
  /* ---------------------------------------------------------------------- */

  if (book.pdfPreviewImage) {
    console.log(
      "✅ Book already has a preview image:",
      book.pdfPreviewImage
    );

    return book.pdfPreviewImage;
  }

  /*
   * IMPORTANT
   *
   * We deliberately do not pretend that a preview has been generated here.
   *
   * The actual PDF → image conversion needs to be implemented using
   * the PDF file stored at book.pdfUrl.
   *
   * For now this service returns null so that we don't save a fake URL
   * into the database.
   */

  console.log(
    "⚠️ No preview image exists yet."
  );

  return null;
}