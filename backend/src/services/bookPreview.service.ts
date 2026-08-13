// backend/src/services/bookPreview.service.ts

import { prisma } from "../lib/prisma";
import { PDFDocument } from "pdf-lib";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import streamifier from "streamifier";

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

const PREVIEW_PAGE_COUNT = 3;

const MAX_PDF_SIZE =
  50 * 1024 * 1024;

/* ==========================================================================
   CLOUDINARY
   ========================================================================== */

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

/* ==========================================================================
   UPLOAD PREVIEW PDF
   ========================================================================== */

async function uploadPreviewToCloudinary(
  buffer: Buffer,
  bookId: string
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",

            folder:
              "cozy-book-nook/previews",

            public_id:
              `book-preview-${bookId}`,

            format: "pdf",

            overwrite: true,
          },

          (error, result) => {
            if (error) {
              console.error(
                "❌ Cloudinary preview upload error:",
                error
              );

              reject(error);
              return;
            }

            if (
              !result ||
              !result.secure_url
            ) {
              reject(
                new Error(
                  "Cloudinary did not return a preview URL."
                )
              );

              return;
            }

            resolve(
              result.secure_url
            );
          }
        );

      streamifier
        .createReadStream(buffer)
        .pipe(uploadStream);
    }
  );
}

/* ==========================================================================
   DOWNLOAD PDF
   ========================================================================== */

/**
 * Downloads the original PDF from Cloudinary.
 *
 * We explicitly type the returned data as ArrayBuffer
 * so TypeScript does not treat response.data as unknown.
 */
async function downloadPdf(
  pdfUrl: string
): Promise<Buffer> {
  console.log(
    "📥 Downloading original PDF..."
  );

  const response =
    await axios.get<ArrayBuffer>(
      pdfUrl,
      {
        responseType:
          "arraybuffer",

        timeout:
          120000,
      }
    );

  /*
   * Axios in your current project is returning
   * response.data as unknown despite the generic.
   *
   * Explicitly cast it here.
   */
  const data =
    response.data as ArrayBuffer;

  if (!data) {
    throw new Error(
      "Downloaded PDF data is empty."
    );
  }

  const buffer =
    Buffer.from(data);

  console.log(
    "📄 Downloaded PDF size:",
    (
      buffer.length /
      1024 /
      1024
    ).toFixed(2),
    "MB"
  );

  if (
    buffer.length >
    MAX_PDF_SIZE
  ) {
    throw new Error(
      "The PDF is too large. Maximum allowed size is 50 MB."
    );
  }

  return buffer;
}

/* ==========================================================================
   GENERATE BOOK PREVIEW
   ========================================================================== */

export async function generateBookPreview(
  bookId: string
): Promise<string> {
  console.log(
    "========================================"
  );

  console.log(
    "🖼️ STARTING BOOK PREVIEW GENERATION"
  );

  console.log(
    "Book ID:",
    bookId
  );

  console.log(
    "========================================"
  );

  /* ------------------------------------------------------------------------
     1. FIND BOOK
     ------------------------------------------------------------------------ */

  const book =
    await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

  if (!book) {
    throw new Error(
      "Book not found."
    );
  }

  console.log(
    "📚 Book found:",
    book.title
  );

  /* ------------------------------------------------------------------------
     2. CHECK PDF
     ------------------------------------------------------------------------ */

  if (!book.pdfUrl) {
    throw new Error(
      "This book does not have a PDF attached."
    );
  }

  console.log(
    "📕 Full PDF exists."
  );

  console.log(
    "PDF URL:",
    book.pdfUrl
  );

  /* ------------------------------------------------------------------------
     3. CHECK CLOUDINARY
     ------------------------------------------------------------------------ */

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary environment variables are missing."
    );
  }

  /* ------------------------------------------------------------------------
     4. EXISTING PREVIEW
     ------------------------------------------------------------------------ */

  if (book.pdfPreviewImage) {
    console.log(
      "⚠️ Existing preview found:"
    );

    console.log(
      book.pdfPreviewImage
    );

    /*
     * We deliberately reuse it.
     *
     * If you have an old broken preview URL
     * in the database, delete it before generating
     * a new preview.
     */
    return book.pdfPreviewImage;
  }

  /* ------------------------------------------------------------------------
     5. DOWNLOAD ORIGINAL PDF
     ------------------------------------------------------------------------ */

  const originalPdfBuffer =
    await downloadPdf(
      book.pdfUrl
    );

  /* ------------------------------------------------------------------------
     6. READ ORIGINAL PDF
     ------------------------------------------------------------------------ */

  console.log(
    "📖 Reading PDF..."
  );

  const originalPdf =
    await PDFDocument.load(
      originalPdfBuffer
    );

  const totalPages =
    originalPdf.getPageCount();

  console.log(
    `📚 Original PDF contains ${totalPages} pages.`
  );

  if (
    totalPages === 0
  ) {
    throw new Error(
      "The PDF contains no pages."
    );
  }

  /* ------------------------------------------------------------------------
     7. DETERMINE PREVIEW PAGES
     ------------------------------------------------------------------------ */

  const previewPages =
    Math.min(
      PREVIEW_PAGE_COUNT,
      totalPages
    );

  console.log(
    `👀 Creating ${previewPages}-page preview...`
  );

  /* ------------------------------------------------------------------------
     8. CREATE NEW PDF
     ------------------------------------------------------------------------ */

  const previewPdf =
    await PDFDocument.create();

  const pageIndexes =
    Array.from(
      {
        length:
          previewPages,
      },

      (_, index) =>
        index
    );

  const copiedPages =
    await previewPdf.copyPages(
      originalPdf,
      pageIndexes
    );

  for (
    const page of copiedPages
  ) {
    previewPdf.addPage(page);
  }

  /* ------------------------------------------------------------------------
     9. SAVE PREVIEW PDF
     ------------------------------------------------------------------------ */

  const previewBytes =
    await previewPdf.save();

  const previewBuffer =
    Buffer.from(
      previewBytes
    );

  console.log(
    "✅ Preview PDF created."
  );

  console.log(
    "Preview size:",
    (
      previewBuffer.length /
      1024
    ).toFixed(1),
    "KB"
  );

  /* ------------------------------------------------------------------------
     10. UPLOAD PREVIEW
     ------------------------------------------------------------------------ */

  console.log(
    "☁️ Uploading preview to Cloudinary..."
  );

  const previewUrl =
    await uploadPreviewToCloudinary(
      previewBuffer,
      bookId
    );

  console.log(
    "✅ Preview uploaded:"
  );

  console.log(
    previewUrl
  );

  /* ------------------------------------------------------------------------
     11. SAVE DATABASE
     ------------------------------------------------------------------------ */

  console.log(
    "💾 Saving preview URL..."
  );

  await prisma.book.update({
    where: {
      id: bookId,
    },

    data: {
      pdfPreviewImage:
        previewUrl,
    },
  });

  console.log(
    "✅ Preview URL saved to database."
  );

  console.log(
    "========================================"
  );

  console.log(
    "🎉 PREVIEW GENERATION COMPLETE"
  );

  console.log(
    "========================================"
  );

  return previewUrl;
}