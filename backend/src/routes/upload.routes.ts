// backend/src/routes/upload.routes.ts

import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const imageFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WebP and GIF images are allowed."));
  }
};

const pdfFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
};

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
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: pdfFilter,
});

/*
|--------------------------------------------------------------------------
| COVER IMAGE
|--------------------------------------------------------------------------
| POST /api/upload-cover
|
| IMPORTANT:
| Frontend must send:
| formData.append("cover", file)
|--------------------------------------------------------------------------
*/

router.post(
  "/upload-cover",
  isAdmin,
  uploadImage.single("cover"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No cover image uploaded.",
        });
      }

      console.log(
        `📤 Uploading cover: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cozy-book-nook/covers",
            resource_type: "image",
            transformation: [
              {
                width: 500,
                height: 750,
                crop: "fill",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file!.buffer);
      });

      console.log("✅ Cover uploaded");
      console.log("🖼 Cover URL:", result.secure_url);

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        secure_url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        message: "Cover uploaded successfully.",
      });
    } catch (error: any) {
      console.error("❌ Cover upload failed:", error);

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Failed to upload cover image.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| PDF
|--------------------------------------------------------------------------
| POST /api/upload-pdf
|
| Frontend must send:
| formData.append("pdf", file)
|--------------------------------------------------------------------------
*/

router.post(
  "/upload-pdf",
  isAdmin,
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No PDF uploaded.",
        });
      }

      console.log(
        `📤 Uploading PDF: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cozy-book-nook/pdfs",
            resource_type: "raw",
            use_filename: true,
            unique_filename: true,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file!.buffer);
      });

      console.log("✅ PDF Uploaded");
      console.log("📕 PDF URL:", result.secure_url);

      const previewImage = cloudinary.url(
        result.public_id,
        {
          resource_type: "raw",
          format: "jpg",
          page: 1,
          secure: true,
        }
      );

      console.log(
        "🖼 PDF Preview:",
        previewImage
      );

      return res.status(200).json({
        success: true,
        pdfUrl: result.secure_url,
        pdfPreviewImage: previewImage,
        publicId: result.public_id,
        filename: req.file.originalname,
        message: "PDF uploaded successfully.",
      });
    } catch (error: any) {
      console.error("❌ PDF upload failed:", error);

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Failed to upload PDF.",
      });
    }
  }
);

router.get("/upload-test", (req, res) => {
  res.json({
    success: true,
    message: "Upload routes are working.",
    cloudinaryConfigured:
      !!process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;