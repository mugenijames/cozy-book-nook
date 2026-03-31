"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/checkout.routes.ts
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
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
// Admin only - manual payment approval
router.post('/approve-manual', authMiddleware_1.isAdmin, checkout_controller_1.approveManualPayment);
exports.default = router;
