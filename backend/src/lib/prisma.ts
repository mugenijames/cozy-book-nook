import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple Prisma clients during tsx/ts-node-dev hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();

    // Test the actual database connection
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Prisma connected to PostgreSQL successfully");
  } catch (error) {
    console.error("❌ Prisma database connection failed:");
    console.error(error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log("🔌 Prisma disconnected");
  } catch (error) {
    console.error("❌ Prisma disconnect error:", error);
  }
}