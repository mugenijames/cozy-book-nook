"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const BYPASS_AUTH = isDevelopment || isTest || process.env.BYPASS_AUTH === 'true';
const authenticate = (req, res, next) => {
    // BYPASS for development and testing
    if (BYPASS_AUTH) {
        if (isDevelopment) {
            console.log('⚠️ [DEV MODE] Authentication bypassed');
        }
        req.user = { id: '1', role: 'admin' };
        return next();
    }
    // Production authentication
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    // BYPASS for development and testing
    if (BYPASS_AUTH) {
        if (isDevelopment) {
            console.log('⚠️ [DEV MODE] Admin check bypassed');
        }
        if (!req.user) {
            req.user = { id: '1', role: 'admin' };
        }
        next();
        return;
    }
    // Production admin check
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
};
exports.isAdmin = isAdmin;
