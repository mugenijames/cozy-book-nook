// backend/src/routes/payment.routes.ts
import { Router } from 'express';
import {
  initiateMpesaPayment,
  mpesaCallback,
  checkPaymentStatus,
} from '../controllers/payment.controller';
import {
  createPayPalOrder,
  capturePayPalOrder,
} from '../controllers/paypal.controller';

const router = Router();

// M-Pesa routes
router.post('/mpesa/stkpush', initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.get('/mpesa/status/:checkoutRequestID', checkPaymentStatus);

// PayPal routes
router.post('/paypal/create-order', createPayPalOrder);
router.post('/paypal/capture-order/:orderId', capturePayPalOrder);

export default router;