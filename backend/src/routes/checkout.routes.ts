// backend/src/routes/checkout.routes.ts
import { Router } from 'express';
import express from 'express';
import {
  checkoutStatus,
  createCheckoutSession,
  handleStripeWebhook,
  checkPurchaseStatus,
  getUserPurchases,
  getDownloadUrl,
} from '../controllers/checkout.controller';

const router = Router();

// Webhook endpoint (must be raw body, no JSON parsing)
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);

// Public routes
router.get('/status', checkoutStatus);
router.post('/session', createCheckoutSession);

// Purchase verification
router.get('/purchase/:bookId', checkPurchaseStatus);
router.get('/my-purchases', getUserPurchases);
router.get('/download/:bookId', getDownloadUrl);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Checkout routes are working!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      status: '/api/checkout/status',
      session: '/api/checkout/session',
      purchase: '/api/checkout/purchase/:bookId',
      download: '/api/checkout/download/:bookId',
      myPurchases: '/api/checkout/my-purchases'
    }
  });
});

export default router;