import { prisma } from "../lib/prisma";
import { PDFDocument } from "pdf-lib";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import streamifier from "streamifier";

/**
 * Number of pages customers can read before purchasing.
 */
const PREVIEW_PAGE_COUNT = 3;

/**
 * Configure Cloudinary.
 *
 * These should already exist in your backend .env because
 * your existing upload system is already using Cloudinary.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a generated PDF buffer to Cloudinary.
 */
async function uploadPreviewToCloudinary(
  buffer: Buffer,
  bookId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "cozy-book-nook/previews",
        public_id: `book-preview-${bookId}`,
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(
            new Error(
              "Cloudinary did not return a preview URL."
            )
          );
          return;
        }

        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/**
 * Generate a limited PDF preview.
 *
 * IMPORTANT:
 * This does NOT expose the original full PDF.
 *
 * Only the first PREVIEW_PAGE_COUNT pages are copied
 * into a completely separate PDF file.
 */
export async function generateBookPreview(
  bookId: string
): Promise<string> {
  console.log(
    "🖼️ Starting protected preview generation:",
    bookId
  );

  // ---------------------------------------------------------
  // 1. Find the book
  // ---------------------------------------------------------

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw new Error("Book not found.");
  }

  console.log("📚 Book found:", book.title);

  // ---------------------------------------------------------
  // 2. Make sure the book has a PDF
  // ---------------------------------------------------------

  if (!book.pdfUrl) {
    throw new Error(
      "This book does not have a PDF attached."
    );
  }

  console.log("📕 Full PDF exists.");

  // ---------------------------------------------------------
  // 3. If preview already exists, reuse it
  // ---------------------------------------------------------

  if (book.pdfPreviewImage) {
    console.log(
      "✅ Existing preview found:",
      book.pdfPreviewImage
    );

    return book.pdfPreviewImage;
  }

  // ---------------------------------------------------------
  // 4. Download the original PDF
  // ---------------------------------------------------------

  console.log("📥 Downloading original PDF...");

  const response = await axios.get<ArrayBuffer>(
    book.pdfUrl,
    {
      responseType: "arraybuffer",
      timeout: 120000,
    }
  );

  const originalPdfBuffer = Buffer.from(
    response.data
  );

  console.log(
    `📄 Downloaded ${(
      originalPdfBuffer.length /
      1024 /
      1024
    ).toFixed(2)} MB`
  );

  // ---------------------------------------------------------
  // 5. Load original PDF
  // ---------------------------------------------------------

  console.log("📖 Reading PDF...");

  const originalPdf =
    await PDFDocument.load(originalPdfBuffer);

  const totalPages =
    originalPdf.getPageCount();

  console.log(
    `📚 Original PDF contains ${totalPages} pages.`
  );

  if (totalPages === 0) {
    throw new Error(
      "The PDF does not contain any pages."
    );
  }

  // ---------------------------------------------------------
  // 6. Determine number of preview pages
  // ---------------------------------------------------------

  const previewPages = Math.min(
    PREVIEW_PAGE_COUNT,
    totalPages
  );

  console.log(
    `👀 Creating preview with ${previewPages} page(s)...`
  );

  // ---------------------------------------------------------
  // 7. Create a completely NEW PDF
  // ---------------------------------------------------------

  const previewPdf =
    await PDFDocument.create();

  const pageIndexes = Array.from(
    { length: previewPages },
    (_, index) => index
  );

  const copiedPages =
    await previewPdf.copyPages(
      originalPdf,
      pageIndexes
    );

  copiedPages.forEach((page) => {
    previewPdf.addPage(page);
  });

  // ---------------------------------------------------------
  // 8. Save preview PDF
  // ---------------------------------------------------------

  const previewBytes =
    await previewPdf.save();

  const previewBuffer =
    Buffer.from(previewBytes);

  console.log(
    `✅ Preview PDF created (${(
      previewBuffer.length /
      1024
    ).toFixed(1)} KB)`
  );

  // ---------------------------------------------------------
  // 9. Upload preview to Cloudinary
  // ---------------------------------------------------------

  console.log(
    "☁️ Uploading preview to Cloudinary..."
  );

  const previewUrl =
    await uploadPreviewToCloudinary(
      previewBuffer,
      bookId
    );

  console.log(
    "✅ Preview uploaded:",
    previewUrl
  );

  // ---------------------------------------------------------
  // 10. Save preview URL
  // ---------------------------------------------------------

  await prisma.book.update({
    where: {
      id: bookId,
    },

    data: {
      pdfPreviewImage: previewUrl,
    },
  });

  console.log(
    "💾 Preview URL saved to database."
  );

  return previewUrl;
}