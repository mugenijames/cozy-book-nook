// api/upload-cover.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload } from '@vercel/blob';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,

      // Security: only admins can upload
      onBeforeGenerateToken: async (pathname) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('Unauthorized – no token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-me'
          ) as { id: string; role: string };

          if (decoded.role !== 'admin') {
            throw new Error('Forbidden – admin access required');
          }
        } catch (err) {
          throw new Error('Invalid or expired token');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          tokenPayload: JSON.stringify({ userId: (decoded as any).id }),
        };
      },

      // Optional: log when upload completes
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', {
          url: blob.url,
          size: blob.size,
          pathname: blob.pathname,
        });
        // Optional: save to database here if needed
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return res.status(500).json({ error: message });
  }
}

// Disable body parser — required for Vercel Blob to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};