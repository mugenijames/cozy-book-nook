"use strict";
// backend/src/middleware/admin.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
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
exports.isAdmin = isAdmin;
const isSuperAdmin = (req, res, next) => {
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
exports.isSuperAdmin = isSuperAdmin;
//# sourceMappingURL=admin.js.map