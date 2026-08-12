"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/checkout.routes.ts
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = (0, express_1.Router)();
// Webhook endpoint (must be raw body, no JSON parsing)
router.post('/webhook', express_2.default.raw({ type: 'application/json' }), checkout_controller_1.handleStripeWebhook);
// Public routes
router.get('/status', checkout_controller_1.checkoutStatus);
router.post('/session', checkout_controller_1.createCheckoutSession);
// Purchase verification
router.get('/purchase/:bookId', checkout_controller_1.checkPurchaseStatus);
router.get('/my-purchases', checkout_controller_1.getUserPurchases);
router.get('/download/:bookId', checkout_controller_1.getDownloadUrl);
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
exports.default = router;
