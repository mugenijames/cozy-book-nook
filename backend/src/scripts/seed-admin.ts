// backend/src/scripts/seed-admin.ts
//
// Creates (or resets) the super admin and admin accounts.
// Reads credentials from environment variables so no password is
// ever written in code:
//
//   SEED_SUPER_ADMIN_EMAIL / SEED_SUPER_ADMIN_PASSWORD / SEED_SUPER_ADMIN_NAME
//   SEED_ADMIN_EMAIL       / SEED_ADMIN_PASSWORD       / SEED_ADMIN_NAME
//
// Run:  npx ts-node src/scripts/seed-admin.ts
// Running it again resets that account's password and re-activates it.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const accounts = [
  {
    role: "SUPER_ADMIN" as const,
    email: process.env.SEED_SUPER_ADMIN_EMAIL,
    password: process.env.SEED_SUPER_ADMIN_PASSWORD,
    name: process.env.SEED_SUPER_ADMIN_NAME || "Super Admin",
  },
  {
    role: "ADMIN" as const,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    name: process.env.SEED_ADMIN_NAME || "Admin",
  },
];

async function main() {
  for (const account of accounts) {
    if (!account.email || !account.password) {
      console.log(`- Skipping ${account.role}: email or password not set`);
      continue;
    }

    if (account.password.length < 10) {
      throw new Error(
        `${account.role} password must be at least 10 characters`
      );
    }

    const email = account.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(account.password, 12);

    await prisma.adminUser.upsert({
      where: { email },
      update: {
        name: account.name,
        role: account.role,
        passwordHash,
        isActive: true,
      },
      create: {
        email,
        name: account.name,
        role: account.role,
        passwordHash,
      },
    });

    console.log(`✓ ${account.role} ready: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());