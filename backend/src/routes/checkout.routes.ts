// backend/src/routes/checkout.routes.ts
import { Router } from 'express';
import express from 'express';
import {
  checkoutStatus,
  createCheckoutSession,
  handleStripeWebhook,
  approveManualPayment,
  checkPurchaseStatus,
  getUserPurchases,
  getDownloadUrl,
} from '../controllers/checkout.controller';
import { isAdmin } from '../middleware/authMiddleware';

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

// Admin only - manual payment approval
router.post('/approve-manual', isAdmin, approveManualPayment);

export default router;