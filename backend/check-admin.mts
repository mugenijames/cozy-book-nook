import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@davidemuria.com".trim().toLowerCase();

  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      passwordHash: true,
    },
  });

  if (!admin) {
    console.log("RESULT: ADMIN_NOT_FOUND");
    return;
  }

  console.log("RESULT: ADMIN_FOUND");
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
  console.log("Active:", admin.isActive);
  console.log("Password hash present:", Boolean(admin.passwordHash));
  console.log(
    "Password hash format:",
    admin.passwordHash?.startsWith("$2") ? "bcrypt-style" : "other or unexpected"
  );
}

main()
  .catch((error) => {
    console.error("DATABASE_CHECK_FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
