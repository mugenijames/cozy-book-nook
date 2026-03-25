"use strict";
// api/upload-cover.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handler;
const blob_1 = require("@vercel/blob");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const jsonResponse = await (0, blob_1.handleUpload)({
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
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-me');
                    if (decoded.role !== 'admin') {
                        throw new Error('Forbidden – admin access required');
                    }
                }
                catch (err) {
                    throw new Error('Invalid or expired token');
                }
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
                    tokenPayload: JSON.stringify({ userId: decoded.id }),
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
    }
    catch (error) {
        console.error('Upload error:', error);
        const message = error instanceof Error ? error.message : 'Upload failed';
        return res.status(500).json({ error: message });
    }
}
// Disable body parser — required for Vercel Blob to handle multipart/form-data
exports.config = {
    api: {
        bodyParser: false,
    },
};
