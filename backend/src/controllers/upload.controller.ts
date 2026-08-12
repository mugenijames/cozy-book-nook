import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import * as pdfParseModule from "pdf-parse";

const pdfParse =
  (pdfParseModule as any).default ?? pdfParseModule;

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
  const allowedExtensions = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "webp",
  ];

  const extension =
    file.originalname
      .split(".")
      .pop()
      ?.toLowerCase() || "";

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (
    allowedExtensions.includes(extension) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, GIF and WEBP images are allowed"
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
      new Error("Only PDF files are allowed")
    );
  }
};

/* -------------------------------------------------------------------------- */
/* UPLOAD CONFIG                                                              */
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

/* ========================================================================== */
/* COVER UPLOAD                                                               */
/* ========================================================================== */

router.post(
  "/upload-cover",
  isAdmin,
  uploadImage.single("cover"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No cover image uploaded",
        });
      }

      console.log("");
      console.log("========================================");
      console.log("🖼️ COVER UPLOAD");
      console.log("========================================");
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

      const result: any =
        await new Promise(
          (resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "cozy-book-nook/covers",

                resource_type: "image",

                quality: "auto",

                transformation: [
                  {
                    width: 500,
                    height: 750,
                    crop: "fill",
                  },
                ],
              },

              (error, uploaded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(uploaded);
                }
              }
            ).end(req.file!.buffer);
          }
        );

      console.log(
        "✅ Cover uploaded:",
        result.secure_url
      );

      return res.json({
        success: true,
        url: result.secure_url,
        filename: result.public_id,
        publicId: result.public_id,
        message:
          "Cover uploaded successfully",
      });
    } catch (error: any) {
      console.error(
        "❌ Cover upload error:",
        error
      );

      return res.status(500).json({
        error: "Cover upload failed",
        details:
          error?.message,
      });
    }
  }
);

/* ========================================================================== */
/* PDF UPLOAD                                                                 */
/* ========================================================================== */

router.post(
  "/upload-pdf",
  isAdmin,
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No PDF file uploaded",
        });
      }

      const bookId =
        req.body.bookId
          ? String(req.body.bookId)
          : undefined;

      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "📕 PDF UPLOAD STARTED"
      );
      console.log(
        "========================================"
      );
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
        bookId || "none"
      );

      /* -------------------------------------------------------------------- */
      /* UPLOAD PDF AS CLOUDINARY IMAGE RESOURCE                              */
      /* -------------------------------------------------------------------- */

      const result: any =
        await new Promise(
          (resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "cozy-book-nook/pdfs",

                /*
                 * IMPORTANT
                 *
                 * PDF must be uploaded as an IMAGE resource.
                 * This allows Cloudinary to generate page
                 * transformations.
                 */
                resource_type: "image",

                format: "pdf",

                /*
                 * Generate first page JPG immediately.
                 */
                eager: [
                  {
                    format: "jpg",

                    transformation: [
                      {
                        page: 1,
                      },
                      {
                        width: 800,
                        crop: "scale",
                      },
                      {
                        quality: "auto",
                      },
                    ],
                  },
                ],

                eager_async: false,
              },

              (error, uploaded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(uploaded);
                }
              }
            ).end(req.file!.buffer);
          }
        );

      /* -------------------------------------------------------------------- */
      /* PDF URL                                                               */
      /* -------------------------------------------------------------------- */

      const pdfUrl =
        result.secure_url;

      /* -------------------------------------------------------------------- */
      /* PREVIEW URL                                                           */
      /* -------------------------------------------------------------------- */

      let pdfPreviewImage: string | null =
        null;

      /*
       * Cloudinary's eager transformation is the
       * safest preview URL because the JPG is actually
       * generated during upload.
       */

      if (
        result.eager &&
        result.eager.length > 0 &&
        result.eager[0]?.secure_url
      ) {
        pdfPreviewImage =
          result.eager[0].secure_url;
      }

      /*
       * Fallback in case eager URL isn't returned.
       */

      if (!pdfPreviewImage) {
        pdfPreviewImage =
          cloudinary.url(
            result.public_id,
            {
              secure: true,
              resource_type: "image",
              format: "jpg",
              transformation: [
                {
                  page: 1,
                },
                {
                  width: 800,
                  crop: "scale",
                },
                {
                  quality: "auto",
                },
              ],
            }
          );
      }

      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "☁️ CLOUDINARY PDF RESULT"
      );
      console.log(
        "========================================"
      );
      console.log(
        "Public ID:",
        result.public_id
      );
      console.log(
        "PDF URL:",
        pdfUrl
      );
      console.log(
        "Preview URL:",
        pdfPreviewImage
      );

      /* -------------------------------------------------------------------- */
      /* EXTRACT PDF TEXT                                                     */
      /* -------------------------------------------------------------------- */

      let preview: string | null =
        null;

      try {
        console.log(
          "📖 Extracting PDF text..."
        );

        const parsed =
          await pdfParse(
            req.file.buffer
          );

        const rawText =
          parsed.text?.trim();

        if (
          rawText &&
          rawText.length > 100
        ) {
          const excerpt =
            rawText.slice(0, 4000);

          console.log(
            "🤖 Generating AI book preview..."
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

Based on the following book excerpt, write a compelling 4-6 paragraph preview summary.

Requirements:
- Introduce the main themes and purpose of the book.
- Highlight important ideas or lessons.
- Use an engaging and warm tone.
- Do not reveal spoilers or the conclusion.
- Make the reader interested in reading the complete book.
- Do not use headings.
- Do not say "preview".
- Write only the summary.

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
              "✅ AI preview generated"
            );
          }
        } else {
          console.log(
            "⚠️ PDF contains little/no extractable text"
          );
        }
      } catch (aiError: any) {
        console.warn(
          "⚠️ AI preview generation failed:",
          aiError?.message ||
            aiError
        );
      }

      /* -------------------------------------------------------------------- */
      /* SAVE PDF TO DATABASE                                                 */
      /* -------------------------------------------------------------------- */

      if (bookId) {
        try {
          const book =
            await prisma.book.findUnique(
              {
                where: {
                  id: bookId,
                },
              }
            );

          if (!book) {
            console.warn(
              "⚠️ Book ID not found:",
              bookId
            );
          } else {
            const updated =
              await prisma.book.update(
                {
                  where: {
                    id: bookId,
                  },

                  data: {
                    pdfUrl,

                    pdfPreviewImage,

                    ...(preview
                      ? {
                          aiSummary:
                            preview,
                        }
                      : {}),
                  },
                }
              );

            console.log("");
            console.log(
              "========================================"
            );
            console.log(
              "✅ PDF SAVED TO DATABASE"
            );
            console.log(
              "========================================"
            );
            console.log(
              "Book:",
              updated.title
            );
            console.log(
              "PDF:",
              Boolean(
                updated.pdfUrl
              )
            );
            console.log(
              "Preview:",
              Boolean(
                updated.pdfPreviewImage
              )
            );
          }
        } catch (dbError: any) {
          console.error(
            "❌ Database update failed:",
            dbError
          );
        }
      }

      /* -------------------------------------------------------------------- */
      /* RESPONSE                                                             */
      /* -------------------------------------------------------------------- */

      return res.json({
        success: true,

        pdfUrl,

        pdfPreviewImage,

        preview,

        publicId:
          result.public_id,

        originalFilename:
          req.file.originalname,

        message:
          "PDF uploaded successfully",
      });
    } catch (error: any) {
      console.error("");
      console.error(
        "========================================"
      );
      console.error(
        "❌ PDF UPLOAD FAILED"
      );
      console.error(
        "========================================"
      );
      console.error(error);

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

/* ========================================================================== */
/* TEST                                                                       */
/* ========================================================================== */

router.get(
  "/upload-test",
  (req, res) => {
    return res.json({
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

export default router;