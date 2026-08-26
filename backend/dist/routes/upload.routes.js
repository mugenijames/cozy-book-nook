"use strict";
// backend/src/routes/upload.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/* ==========================================================================
   CLOUDINARY CONFIGURATION
   ========================================================================== */
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/* ==========================================================================
   MULTER CONFIGURATION
   ========================================================================== */
const storage = multer_1.default.memoryStorage();
/* ==========================================================================
   IMAGE FILTER
   ========================================================================== */
const imageFilter = (_req, file, cb) => {
    const allowedExtensions = [
        "jpeg",
        "jpg",
        "png",
        "gif",
        "webp",
    ];
    const extension = file.originalname
        .split(".")
        .pop()
        ?.toLowerCase() || "";
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    const valid = allowedExtensions.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype);
    if (valid) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, PNG, GIF and WEBP images are allowed."));
    }
};
/* ==========================================================================
   PDF FILTER
   ========================================================================== */
const pdfFilter = (_req, file, cb) => {
    if (file.mimetype ===
        "application/pdf" ||
        file.originalname
            .toLowerCase()
            .endsWith(".pdf")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF files are allowed."));
    }
};
/* ==========================================================================
   UPLOAD CONFIGURATION
   ========================================================================== */
const uploadImage = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: imageFilter,
});
const uploadPdf = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: pdfFilter,
});
/* ==========================================================================
   COVER IMAGE UPLOAD
   ========================================================================== */
/**
 * POST /api/upload-cover
 *
 * Uploads a book cover to Cloudinary.
 */
router.post("/upload-cover", authMiddleware_1.isAdmin, uploadImage.single("cover"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No cover image uploaded.",
            });
        }
        console.log("========================================");
        console.log("🖼️ COVER UPLOAD");
        console.log("File:", req.file.originalname);
        console.log("Size:", req.file.size);
        console.log("Type:", req.file.mimetype);
        console.log("========================================");
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: "cozy-book-nook/covers",
                resource_type: "image",
                quality: "auto",
                transformation: [
                    {
                        width: 500,
                        height: 750,
                        crop: "fill",
                    },
                ],
            }, (error, uploaded) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(uploaded);
                }
            });
            uploadStream.end(req.file.buffer);
        });
        if (!result?.secure_url) {
            throw new Error("Cloudinary did not return a cover URL.");
        }
        console.log("✅ Cover uploaded successfully.");
        console.log("Cover URL:", result.secure_url);
        console.log("Public ID:", result.public_id);
        return res.status(200).json({
            success: true,
            url: result.secure_url,
            filename: result.public_id,
            publicId: result.public_id,
            message: "Cover upload successful.",
        });
    }
    catch (error) {
        console.error("❌ Cover upload error:", error);
        return res.status(500).json({
            success: false,
            error: error?.message ||
                "Cover upload failed.",
        });
    }
});
/* ==========================================================================
   ORIGINAL PDF UPLOAD
   ========================================================================== */
/**
 * POST /api/upload-pdf
 *
 * Uploads ONLY the original PDF.
 *
 * IMPORTANT:
 *
 * - No PDF preview is generated.
 * - No PDF pages are converted to JPG.
 * - No pdf-lib is used.
 * - The PDF is stored as a RAW Cloudinary resource.
 * - The returned URL is stored by the frontend in pdfUrl.
 */
router.post("/upload-pdf", authMiddleware_1.isAdmin, uploadPdf.single("pdf"), async (req, res) => {
    try {
        /* --------------------------------------------------------------------
           VALIDATE FILE
        -------------------------------------------------------------------- */
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No PDF file uploaded.",
            });
        }
        console.log("========================================");
        console.log("📕 ORIGINAL PDF UPLOAD");
        console.log("File:", req.file.originalname);
        console.log("Size:", req.file.size);
        console.log("Type:", req.file.mimetype);
        console.log("========================================");
        /* --------------------------------------------------------------------
           UPLOAD PDF TO CLOUDINARY
        -------------------------------------------------------------------- */
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                /*
                 * VERY IMPORTANT
                 *
                 * The original book remains
                 * a RAW resource.
                 */
                resource_type: "raw",
                folder: "cozy-book-nook/pdfs",
                /*
                 * Generate a predictable
                 * Cloudinary public ID.
                 *
                 * Cloudinary will keep the
                 * original PDF extension.
                 */
                public_id: `book-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 10)}`,
            }, (error, uploaded) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(uploaded);
                }
            });
            uploadStream.end(req.file.buffer);
        });
        /* --------------------------------------------------------------------
           VALIDATE CLOUDINARY RESPONSE
        -------------------------------------------------------------------- */
        if (!result?.secure_url) {
            throw new Error("Cloudinary did not return a PDF URL.");
        }
        const pdfUrl = result.secure_url;
        const publicId = result.public_id;
        /* --------------------------------------------------------------------
           LOG RESULT
        -------------------------------------------------------------------- */
        console.log("========================================");
        console.log("✅ PDF UPLOAD SUCCESSFUL");
        console.log("PDF URL:");
        console.log(pdfUrl);
        console.log("Public ID:");
        console.log(publicId);
        console.log("Resource type:");
        console.log(result.resource_type);
        console.log("Format:");
        console.log(result.format);
        console.log("========================================");
        /* --------------------------------------------------------------------
           RESPONSE
        -------------------------------------------------------------------- */
        return res.status(200).json({
            success: true,
            pdfUrl,
            publicId,
            resourceType: result.resource_type,
            format: result.format,
            filename: req.file.originalname,
            message: "PDF upload successful.",
        });
    }
    catch (error) {
        console.error("========================================");
        console.error("❌ PDF UPLOAD FAILED");
        console.error(error);
        console.error("========================================");
        return res.status(500).json({
            success: false,
            error: error?.message ||
                "PDF upload failed.",
        });
    }
});
/* ==========================================================================
   UPLOAD TEST
   ========================================================================== */
/**
 * GET /api/upload-test
 *
 * Simple endpoint for checking whether
 * the upload routes are registered.
 */
router.get("/upload-test", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Upload routes working.",
        cloudinary: !!process.env
            .CLOUDINARY_CLOUD_NAME,
        cloudinaryApiKey: !!process.env
            .CLOUDINARY_API_KEY,
        cloudinaryApiSecret: !!process.env
            .CLOUDINARY_API_SECRET,
    });
});
/* ==========================================================================
   EXPORT
   ========================================================================== */
exports.default = router;
//# sourceMappingURL=upload.routes.js.map