"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
exports.prisma = global.prisma ??
    new client_1.PrismaClient({
        log: ["query", "info", "warn", "error"],
    });
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        // Test the actual database connection
        await exports.prisma.$queryRaw `SELECT 1`;
        console.log("✅ Prisma connected to PostgreSQL successfully");
    }
    catch (error) {
        console.error("❌ Prisma database connection failed:");
        console.error(error);
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await exports.prisma.$disconnect();
        console.log("🔌 Prisma disconnected");
    }
    catch (error) {
        console.error("❌ Prisma disconnect error:", error);
    }
}
