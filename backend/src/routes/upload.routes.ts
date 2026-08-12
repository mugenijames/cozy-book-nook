// backend/src/routes/upload.routes.ts

import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { isAdmin } from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";

import Anthropic from "@anthropic-ai/sdk";

import * as pdfParseModule from "pdf-parse";

const pdfParse =
  (pdfParseModule as any).default ??
  pdfParseModule;

const router = Router();

/* -------------------------------------------------------------------------- */
/* CLOUDINARY CONFIG                                                          */
/* -------------------------------------------------------------------------- */

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

/* -------------------------------------------------------------------------- */
/* ANTHROPIC                                                                  */
/* -------------------------------------------------------------------------- */

const anthropic =
  new Anthropic({
    apiKey:
      process.env.ANTHROPIC_API_KEY,
  });

/* -------------------------------------------------------------------------- */
/* MULTER                                                                     */
/* -------------------------------------------------------------------------- */

const storage =
  multer.memoryStorage();

/* -------------------------------------------------------------------------- */
/* IMAGE FILTER                                                               */
/* -------------------------------------------------------------------------- */

const imageFilter = (
  req: any,
  file: any,
  cb: any
) => {
  const allowedExtensions =
    [
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

  const validExtension =
    allowedExtensions.includes(
      extension
    );

  const validMime =
    /^image\/(jpeg|jpg|png|gif|webp)$/i.test(
      file.mimetype
    );

  if (
    validExtension &&
    validMime
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, GIF and WEBP image files are allowed"
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
  if (
    file.mimetype ===
    "application/pdf"
  ) {
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
/* MULTER INSTANCES                                                           */
/* -------------------------------------------------------------------------- */

const uploadImage =
  multer({
    storage,
    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
    fileFilter:
      imageFilter,
  });

const uploadPdf =
  multer({
    storage,
    limits: {
      fileSize:
        20 * 1024 * 1024,
    },
    fileFilter:
      pdfFilter,
  });

/* -------------------------------------------------------------------------- */
/* UPLOAD COVER                                                               */
/* -------------------------------------------------------------------------- */

router.post(
  "/upload-cover",
  isAdmin,
  uploadImage.single("cover"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error:
            "No cover image uploaded",
        });
      }

      console.log(
        "========================================"
      );

      console.log(
        "🖼️ COVER UPLOAD"
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
        "========================================"
      );

      const result: any =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder:
                    "cozy-book-nook/covers",

                  resource_type:
                    "image",

                  quality:
                    "auto",

                  transformation: [
                    {
                      width: 500,
                      height: 750,
                      crop: "fill",
                    },
                  ],
                },

                (
                  error,
                  uploaded
                ) => {
                  if (error) {
                    reject(
                      error
                    );
                  } else {
                    resolve(
                      uploaded
                    );
                  }
                }
              )
              .end(
                req.file!.buffer
              );
          }
        );

      console.log(
        "✅ Cover uploaded:",
        result.secure_url
      );

      return res.json({
        success: true,

        url:
          result.secure_url,

        filename:
          result.public_id,

        publicId:
          result.public_id,

        message:
          "Cover upload successful",
      });
    } catch (error: any) {
      console.error(
        "❌ Cover upload error:",
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

/**
 * IMPORTANT:
 *
 * The PDF is uploaded to Cloudinary as an IMAGE resource.
 *
 * This allows Cloudinary to render individual PDF pages.
 *
 * We DO NOT set:
 *
 * format: "jpg"
 *
 * because that would convert the actual PDF into an image.
 */
router.post(
  "/upload-pdf",
  isAdmin,
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error:
            "No PDF file uploaded",
        });
      }

      const bookId =
        req.body.bookId
          ? String(
              req.body.bookId
            )
          : undefined;

      console.log(
        "========================================"
      );

      console.log(
        "📕 PDF UPLOAD"
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
        "MIME:",
        req.file.mimetype
      );

      console.log(
        "Book ID:",
        bookId || "Not provided"
      );

      console.log(
        "========================================"
      );

      /* -------------------------------------------------------------------- */
      /* UPLOAD PDF TO CLOUDINARY                                             */
      /* -------------------------------------------------------------------- */

      const result: any =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder:
                    "cozy-book-nook/pdfs",

                  /*
                   * IMPORTANT:
                   *
                   * Do NOT specify format: "jpg".
                   *
                   * Cloudinary will keep this as a PDF while
                   * allowing page transformations.
                   */
                  resource_type:
                    "image",

                  type:
                    "upload",

                  use_filename:
                    false,

                  unique_filename:
                    true,
                },

                (
                  error,
                  uploaded
                ) => {
                  if (error) {
                    reject(
                      error
                    );
                  } else {
                    resolve(
                      uploaded
                    );
                  }
                }
              )
              .end(
                req.file!.buffer
              );
          }
        );

      const pdfUrl =
        result.secure_url;

      const publicId =
        result.public_id;

      console.log(
        "✅ PDF uploaded successfully"
      );

      console.log(
        "📕 PDF URL:",
        pdfUrl
      );

      console.log(
        "🆔 Public ID:",
        publicId
      );

      /* -------------------------------------------------------------------- */
      /* GENERATE FIRST PAGE PREVIEW                                          */
      /* -------------------------------------------------------------------- */

      let pdfPreviewImage:
        | string
        | null = null;

      try {
        pdfPreviewImage =
          cloudinary.url(
            publicId,
            {
              secure: true,

              resource_type:
                "image",

              type:
                "upload",

              format:
                "jpg",

              transformation: [
                {
                  page: 1,
                },
                {
                  width: 900,
                  crop: "scale",
                },
                {
                  quality: "auto",
                },
              ],
            }
          );

        console.log(
          "🖼️ PDF preview URL:",
          pdfPreviewImage
        );
      } catch (previewError) {
        console.warn(
          "⚠️ Could not generate PDF preview URL:",
          previewError
        );
      }

      /* -------------------------------------------------------------------- */
      /* AI BOOK PREVIEW                                                      */
      /* -------------------------------------------------------------------- */

      let preview:
        | string
        | null = null;

      try {
        console.log(
          "📖 Extracting PDF text..."
        );

        const parsed =
          await pdfParse(
            req.file.buffer
          );

        const rawText =
          parsed.text
            ?.trim();

        if (
          rawText &&
          rawText.length > 100
        ) {
          const excerpt =
            rawText.slice(
              0,
              4000
            );

          console.log(
            "🤖 Generating AI preview..."
          );

          const message =
            await anthropic.messages.create(
              {
                model:
                  "claude-sonnet-4-6",

                max_tokens:
                  800,

                messages: [
                  {
                    role:
                      "user",

                    content: `
You are a professional book editor.

Based on the following excerpt, write a compelling book preview summary.

Requirements:
- Introduce the main themes and purpose of the book.
- Highlight key ideas or lessons.
- Use an engaging and warm tone.
- Do not reveal major conclusions or spoilers.
- Make the reader want to read the complete book.
- Write 4-6 paragraphs.
- Do not use headings.
- Do not mention that the text came from an excerpt.

Book excerpt:

"""
${excerpt}
"""

Write only the preview summary.
`,
                  },
                ],
              }
            );

          const block =
            message.content.find(
              (
                item
              ) =>
                item.type ===
                "text"
            );

          if (
            block &&
            block.type ===
              "text"
          ) {
            preview =
              block.text.trim();

            console.log(
              "✅ AI preview generated"
            );
          }
        } else {
          console.log(
            "⚠️ PDF contains insufficient text for AI preview"
          );
        }
      } catch (aiError) {
        console.warn(
          "⚠️ AI preview generation failed:",
          aiError
        );
      }

      /* -------------------------------------------------------------------- */
      /* SAVE TO DATABASE                                                     */
      /* -------------------------------------------------------------------- */

      if (bookId) {
        try {
          const updateData: any = {
            pdfUrl,
          };

          if (
            pdfPreviewImage
          ) {
            updateData.pdfPreviewImage =
              pdfPreviewImage;
          }

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
            "✅ BOOK UPDATED WITH PDF"
          );

          console.log({
            id:
              updatedBook.id,

            title:
              updatedBook.title,

            hasPdf:
              Boolean(
                updatedBook.pdfUrl
              ),

            pdfUrl:
              updatedBook.pdfUrl,

            hasPreview:
              Boolean(
                updatedBook.pdfPreviewImage
              ),

            pdfPreviewImage:
              updatedBook.pdfPreviewImage,

            hasAiSummary:
              Boolean(
                updatedBook.aiSummary
              ),
          });

          console.log(
            "========================================"
          );
        } catch (dbError: any) {
          console.error(
            "❌ Database update failed:",
            dbError
          );

          /*
           * Do not fail the entire upload because the Cloudinary
           * upload itself succeeded.
           */
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

        publicId,

        filename:
          req.file.originalname,

        message:
          "PDF upload successful",
      });
    } catch (error: any) {
      console.error(
        "❌ PDF upload error:",
        error
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
/* UPLOAD TEST                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default router;