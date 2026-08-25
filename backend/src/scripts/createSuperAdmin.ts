import "dotenv/config";

import bcrypt from "bcryptjs";
import {
  PrismaClient,
  AdminRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email =
    process.env.SUPER_ADMIN_EMAIL;

  const password =
    process.env.SUPER_ADMIN_PASSWORD;

  const name =
    process.env.SUPER_ADMIN_NAME ||
    "Super Administrator";

  if (!email || !password) {
    throw new Error(
      "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be configured."
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const passwordHash =
    await bcrypt.hash(password, 12);

  const admin =
    await prisma.adminUser.upsert({
      where: {
        email: normalizedEmail,
      },

      update: {
        name,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      },

      create: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      },
    });

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "✅ SUPER ADMIN CREATED"
  );
  console.log(
    "========================================"
  );
  console.log(
    "Name:",
    admin.name
  );
  console.log(
    "Email:",
    admin.email
  );
  console.log(
    "Role:",
    admin.role
  );
  console.log(
    "========================================"
  );
}

main()
  .catch((error) => {
    console.error(
      "❌ Failed to create super admin:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });