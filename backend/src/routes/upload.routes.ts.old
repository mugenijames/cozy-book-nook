import { handleUpload, type HandleUploadBody } from '@vercel/blob';
import { Router } from 'express';
import { isAdmin } from '../middleware/admin'; // your admin check

const router = Router();

router.post('/upload-cover', isAdmin, async (req, res) => {
  try {
    const body = req.body as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Optional: add authorization check here
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          tokenPayload: JSON.stringify({ userId: req.user?.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: save blob.url to database here
        console.log('Upload completed:', blob.url);
        // You can update Book.coverImage = blob.url in your controller
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;