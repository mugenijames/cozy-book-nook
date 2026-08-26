"use strict";
// backend/src/middleware/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.requireSuperAdmin = exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* ============================================================
   AUTHENTICATE
   ============================================================ */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader &&
        authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!token) {
        return res.status(401).json({
            error: "Access denied. Authentication required.",
        });
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("❌ JWT_SECRET is not configured.");
        return res.status(500).json({
            error: "Authentication system is not configured.",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.id ||
            !decoded.role) {
            return res.status(401).json({
                error: "Invalid authentication token.",
            });
        }
        if (decoded.role !== "ADMIN" &&
            decoded.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                error: "This account does not have administrator privileges.",
            });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error("❌ JWT verification failed:", error);
        return res.status(401).json({
            error: "Invalid or expired authentication token.",
        });
    }
};
exports.authenticate = authenticate;
/* ============================================================
   ADMIN OR SUPER ADMIN
   ============================================================ */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Authentication required.",
        });
    }
    if (req.user.role !== "ADMIN" &&
        req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            error: "Administrator access required.",
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
/* ============================================================
   SUPER ADMIN ONLY
   ============================================================ */
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Authentication required.",
        });
    }
    if (req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            error: "Super administrator access required.",
        });
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
/* ============================================================
   BACKWARD COMPATIBILITY
   ============================================================ */
exports.isAdmin = exports.requireAdmin;
//# sourceMappingURL=authMiddleware.js.map