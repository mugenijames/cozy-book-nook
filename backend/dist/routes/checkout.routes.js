"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/order.routes.ts
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
// Get all orders
router.get('/', order_controller_1.getOrders);
// Get single order by ID
router.get('/:id', order_controller_1.getOrderById);
exports.default = router;
