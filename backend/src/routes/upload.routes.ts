import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import * as pdfParseModule from "pdf-parse";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CLOUDINARY                                                                 */
/* -------------------------------------------------------------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------------------------------------------------------------- */
/* ANTHROPIC                                                                  */
/* -------------------------------------------------------------------------- */

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/* -------------------------------------------------------------------------- */
/* PDF PARSER                                                                 */
/* -------------------------------------------------------------------------- */

const pdfParse =
  (pdfParseModule as any).default ?? pdfParseModule;

/* -------------------------------------------------------------------------- */
/* MULTER                                                                     */
/* -------------------------------------------------------------------------- */

const storage = multer.memoryStorage();

/* -------------------------------------------------------------------------- */
/* IMAGE FILTER                                                               */
/* -------------------------------------------------------------------------- */

const imageFilter = (
  req: any,
  file: any,
  cb: any
) => {
  const allowedExtensions =
    /\.(jpeg|jpg|png|gif|webp)$/i;

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const extensionOk =
    allowedExtensions.test(file.originalname);

  const mimeOk =
    allowedMimeTypes.includes(file.mimetype);

  if (extensionOk && mimeOk) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPEG, JPG, PNG, GIF and WEBP images are allowed"
      )
    );
  }
};

/* -------------------------------------------------------------------------- */
/* PDF FILTER                                                                 */
/* -------------------------------------------------------------------------- */

const pdfFilter = (
  req: any,
  file: any,
  cb: any
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed"
      )
    );
  }
};

/* -------------------------------------------------------------------------- */
/* UPLOAD INSTANCES                                                           */
/* -------------------------------------------------------------------------- */

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: imageFilter,
});

const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: pdfFilter,
});

/* -------------------------------------------------------------------------- */
/* HELPER: CLOUDINARY UPLOAD                                                  */
/* -------------------------------------------------------------------------- */

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: Record<string, any>
): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      stream.end(buffer);
    }
  );
}

/* -------------------------------------------------------------------------- */
/* HELPER: PDF PREVIEW URL                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Cloudinary stores PDFs as image assets.
 *
 * Original PDF:
 *
 * /image/upload/.../book.pdf
 *
 * First page preview:
 *
 * /image/upload/pg_1/.../book.jpg
 *
 * IMPORTANT:
 * Do NOT use /raw/upload here.
 */
function createPdfPreviewUrl(
  publicId: string
): string {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME is not configured"
    );
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/pg_1,w_800,q_auto/${publicId}.jpg`;
}

/* -------------------------------------------------------------------------- */
/* UPLOAD COVER                                                               */
/* -------------------------------------------------------------------------- */

router.post(
  "/upload-cover",
  isAdmin,
  uploadImage.single("cover"),
  async (req, res) => {
    try {
      console.log(
        "========================================"
      );

      console.log(
        "🖼️ STARTING COVER UPLOAD"
      );

      console.log(
        "========================================"
      );

      if (!req.file) {
        return res.status(400).json({
          error: "No cover image uploaded",
        });
      }

      console.log(
        "File:",
        req.file.originalname
      );

      console.log(
        "Size:",
        req.file.size
      );

      console.log(
        "Type:",
        req.file.mimetype
      );

      const result =
        await uploadBufferToCloudinary(
          req.file.buffer,
          {
            folder:
              "cozy-book-nook/covers",

            resource_type: "image",

            transformation: [
              {
                width: 500,
                height: 750,
                crop: "fill",
              },
            ],

            quality: "auto",

            fetch_format: "auto",

            use_filename: true,

            unique_filename: true,
          }
        );

      console.log(
        "✅ COVER UPLOADED"
      );

      console.log(
        "URL:",
        result.secure_url
      );

      return res.json({
        success: true,

        url: result.secure_url,

        filename:
          result.public_id,

        publicId:
          result.public_id,

        message:
          "Cover upload successful",
      });
    } catch (error: any) {
      console.error(
        "❌ COVER UPLOAD ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Cover upload failed",

        details:
          error?.message ||
          "Unknown error",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* UPLOAD PDF                                                                 */
/* -------------------------------------------------------------------------- */

router.post(
  "/upload-pdf",
  isAdmin,
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      console.log(
        "========================================"
      );

      console.log(
        "📕 STARTING PDF UPLOAD"
      );

      console.log(
        "========================================"
      );

      if (!req.file) {
        return res.status(400).json({
          error: "No PDF file uploaded",
        });
      }

      const bookId =
        req.body.bookId
          ? String(req.body.bookId)
          : undefined;

      console.log(
        "File:",
        req.file.originalname
      );

      console.log(
        "Size:",
        req.file.size
      );

      console.log(
        "Type:",
        req.file.mimetype
      );

      console.log(
        "Book ID:",
        bookId || "Not provided"
      );

      /* -------------------------------------------------------------------- */
      /* UPLOAD PDF TO CLOUDINARY                                             */
      /* -------------------------------------------------------------------- */

      /**
       * IMPORTANT
       *
       * PDF must remain a PDF.
       *
       * Cloudinary supports PDFs as image assets.
       * This allows us to later request page 1 as JPG.
       *
       * DO NOT use:
       *
       * resource_type: "raw"
       *
       * because then PDF page transformations will not work.
       *
       * DO NOT use:
       *
       * format: "jpg"
       *
       * during upload because that changes what is stored.
       */

      const result =
        await uploadBufferToCloudinary(
          req.file.buffer,
          {
            folder:
              "cozy-book-nook/pdfs",

            resource_type: "image",

            format: "pdf",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          }
        );

      const pdfUrl =
        result.secure_url;

      const publicId =
        result.public_id;

      console.log(
        "========================================"
      );

      console.log(
        "✅ PDF UPLOADED TO CLOUDINARY"
      );

      console.log(
        "PDF URL:",
        pdfUrl
      );

      console.log(
        "Public ID:",
        publicId
      );

      console.log(
        "Pages:",
        result.pages || "Unknown"
      );

      /* -------------------------------------------------------------------- */
      /* GENERATE PREVIEW URL                                                 */
      /* -------------------------------------------------------------------- */

      const pdfPreviewImage =
        createPdfPreviewUrl(
          publicId
        );

      console.log(
        "🖼️ PDF PREVIEW URL:"
      );

      console.log(
        pdfPreviewImage
      );

      /* -------------------------------------------------------------------- */
      /* VERIFY PREVIEW URL                                                    */
      /* -------------------------------------------------------------------- */

      console.log(
        "========================================"
      );

      console.log(
        "🔎 PDF PREVIEW CONFIGURATION"
      );

      console.log(
        "Resource type: image"
      );

      console.log(
        "Page: 1"
      );

      console.log(
        "Format: jpg"
      );

      console.log(
        "========================================"
      );

      /* -------------------------------------------------------------------- */
      /* AI SUMMARY                                                            */
      /* -------------------------------------------------------------------- */

      let preview:
        | string
        | null = null;

      try {
        const parsed =
          await pdfParse(
            req.file.buffer
          );

        const rawText =
          parsed?.text?.trim();

        console.log(
          "📄 Extracted PDF text:",
          rawText
            ? `${rawText.length} characters`
            : "No text"
        );

        if (
          rawText &&
          rawText.length > 100 &&
          process.env.ANTHROPIC_API_KEY
        ) {
          const excerpt =
            rawText.slice(
              0,
              4000
            );

          console.log(
            "🤖 GENERATING AI BOOK PREVIEW"
          );

          const message =
            await anthropic.messages.create(
              {
                model:
                  "claude-sonnet-4-6",

                max_tokens: 800,

                messages: [
                  {
                    role: "user",

                    content: `
You are a professional book editor.

Based on the following excerpt, write a compelling 4-6 paragraph preview summary.

Requirements:
- Introduce the main themes and purpose of the book.
- Highlight key ideas or lessons.
- Use an engaging and warm tone.
- Do not reveal major conclusions or spoilers.
- Make the reader interested in reading the complete book.
- Write only the preview summary.
- Do not include headings.

Book excerpt:

"""
${excerpt}
"""
`,
                  },
                ],
              }
            );

          const block =
            message.content.find(
              (item: any) =>
                item.type === "text"
            );

          if (
            block &&
            block.type === "text"
          ) {
            preview =
              block.text.trim();

            console.log(
              "✅ AI PREVIEW GENERATED"
            );
          }
        } else {
          console.log(
            "ℹ️ AI preview skipped"
          );
        }
      } catch (aiError: any) {
        console.warn(
          "⚠️ AI PREVIEW FAILED"
        );

        console.warn(
          aiError?.message ||
            aiError
        );

        // AI failure must NOT stop PDF upload.
      }

      /* -------------------------------------------------------------------- */
      /* SAVE PDF TO DATABASE                                                  */
      /* -------------------------------------------------------------------- */

      if (bookId) {
        try {
          const updateData: any = {
            pdfUrl,

            pdfPreviewImage,
          };

          if (preview) {
            updateData.aiSummary =
              preview;
          }

          const updatedBook =
            await prisma.book.update(
              {
                where: {
                  id: bookId,
                },

                data:
                  updateData,
              }
            );

          console.log(
            "========================================"
          );

          console.log(
            "✅ PDF SAVED TO DATABASE"
          );

          console.log(
            "Book ID:",
            updatedBook.id
          );

          console.log(
            "PDF:",
            updatedBook.pdfUrl
          );

          console.log(
            "Preview:",
            updatedBook.pdfPreviewImage
          );

          console.log(
            "========================================"
          );
        } catch (dbError: any) {
          console.error(
            "❌ DATABASE UPDATE FAILED:"
          );

          console.error(
            dbError
          );

          return res.status(500).json(
            {
              error:
                "PDF uploaded but could not be saved to the book",

              details:
                dbError?.message,

              pdfUrl,

              pdfPreviewImage,
            }
          );
        }
      }

      /* -------------------------------------------------------------------- */
      /* RESPONSE                                                              */
      /* -------------------------------------------------------------------- */

      return res.json({
        success: true,

        pdfUrl,

        pdfPreviewImage,

        preview,

        publicId,

        pages:
          result.pages || null,

        message:
          "PDF upload successful",
      });
    } catch (error: any) {
      console.error(
        "========================================"
      );

      console.error(
        "❌ PDF UPLOAD ERROR"
      );

      console.error(
        error
      );

      console.error(
        "========================================"
      );

      return res.status(500).json({
        error:
          "PDF upload failed",

        details:
          error?.message ||
          "Unknown error",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* TEST ENDPOINT                                                              */
/* -------------------------------------------------------------------------- */

router.get(
  "/upload-test",
  (req, res) => {
    res.json({
      message:
        "Upload routes working",

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
    });
  }
);

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default router;