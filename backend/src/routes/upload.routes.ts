// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '../middleware/authMiddleware';
import { prisma } from '../lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const storage = multer.memoryStorage();

const imageFilter = (req: any, file: any, cb: any) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(file.originalname.split('.').pop()?.toLowerCase() || '') && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const pdfFilter = (req: any, file: any, cb: any) => {
  file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF files are allowed'));
};

const uploadImage = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadPdf = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: pdfFilter });

// Upload cover image
router.post('/upload-cover', isAdmin, uploadImage.single('cover'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'cozy-book-nook/covers', resource_type: 'auto', quality: 'auto', transformation: [{ width: 500, height: 750, crop: 'fill' }] },
        (err, r) => err ? reject(err) : resolve(r)
      ).end(req.file!.buffer);
    });

    res.json({ url: result.secure_url, filename: result.public_id, message: 'Upload successful' });
  } catch (error) {
    console.error('Cover upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload PDF + generate AI summary + PDF preview image
router.post('/upload-pdf', isAdmin, uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const bookId = req.body.bookId as string | undefined;
    console.log(`📤 Uploading PDF: ${req.file.originalname}`);

    // 1. Upload PDF to Cloudinary as image type so page previews work
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'cozy-book-nook/pdfs', resource_type: 'image', format: 'jpg', pages: true },
        (err, r) => err ? reject(err) : resolve(r)
      ).end(req.file!.buffer);
    });

    const pdfUrl = result.secure_url;
    const publicId = result.public_id;

    // 2. Build first-page preview URL correctly using image/upload
    // Cloudinary stores multi-page PDFs as image — page 1 is accessed directly
    const pdfPreviewImage = cloudinary.url(publicId, {
      resource_type: 'image',
      format: 'jpg',
      page: 1,
      width: 800,
      crop: 'scale',
      quality: 'auto',
      secure: true,
    });

    console.log('✅ PDF uploaded:', pdfUrl);
    console.log('🖼️ PDF preview URL:', pdfPreviewImage);

    // 3. Generate AI summary from PDF text
    let preview: string | null = null;
    try {
      const parsed = await pdfParse(req.file.buffer);
      const rawText = parsed.text?.trim();

      if (rawText && rawText.length > 100) {
        const excerpt = rawText.slice(0, 4000);
        console.log('🤖 Generating AI preview...');

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 800,
          messages: [{
            role: 'user',
            content: `You are a book editor. Based on the following excerpt, write a compelling 4-6 paragraph preview summary that:
- Introduces the main themes and purpose of the book
- Highlights key ideas or lessons a reader will learn
- Uses an engaging, warm tone matching the book's style
- Does NOT include spoilers or full conclusions
- Ends with a sentence that makes the reader want to read more

Book excerpt:
"""
${excerpt}
"""

Write only the preview summary, no headings or labels.`,
          }],
        });

        const block = message.content.find(b => b.type === 'text');
        if (block?.type === 'text') {
          preview = block.text.trim();
          console.log('✅ AI preview generated');
        }
      }
    } catch (aiErr) {
      console.warn('⚠️ AI preview generation failed (non-fatal):', aiErr);
    }

    // 4. Save to book if bookId provided
    if (bookId) {
      try {
        await prisma.book.update({
          where: { id: bookId },
          data: {
            pdfUrl,
            pdfPreviewImage,
            ...(preview ? { aiSummary: preview } : {}),
          },
        });
        console.log(`✅ Book ${bookId} updated with PDF, preview image and AI summary`);
      } catch (dbErr) {
        console.warn('⚠️ Could not update book:', dbErr);
      }
    }

    res.json({
      success: true,
      pdfUrl,
      pdfPreviewImage,
      preview,
      publicId,
      message: 'PDF upload successful',
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ error: 'PDF upload failed' });
  }
});

// Test endpoint
router.get('/upload-test', (req, res) => {
  res.json({
    message: 'Upload routes working',
    cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
  });
});

export default router;