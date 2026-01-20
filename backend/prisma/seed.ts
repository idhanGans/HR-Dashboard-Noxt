import { PrismaClient, Role, EmploymentType } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for all users (using same salt rounds as auth service)
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Superadmin
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      phoneNumber: "+6281234567890",
      roleName: "System Administrator",
      role: Role.SUPERADMIN,
      employmentType: EmploymentType.PERMANENT,
      taxNumber: "123456789",
      identityNumber: "3201012345678901",
      startDate: new Date("2024-01-01"),
      location: "Jakarta",
      bankNumber: "1234567890",
      bankName: "Bank Central Asia",
      bankAccountHolderName: "Super Admin",
    },
  });

  console.log("✅ Created superadmin:", superadmin.email);

  // Create Supervisor
  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@example.com" },
    update: {},
    create: {
      fullName: "John Supervisor",
      email: "supervisor@example.com",
      password: hashedPassword,
      phoneNumber: "+6281234567891",
      roleName: "Team Lead",
      role: Role.SUPERVISOR,
      employmentType: EmploymentType.PERMANENT,
      taxNumber: "123456790",
      identityNumber: "3201012345678902",
      startDate: new Date("2024-02-01"),
      location: "Bandung",
      bankNumber: "1234567891",
      bankName: "Bank Mandiri",
      bankAccountHolderName: "John Supervisor",
    },
  });

  console.log("✅ Created supervisor:", supervisor.email);

  // Create Employee
  const employee = await prisma.user.upsert({
    where: { email: "employee@example.com" },
    update: {},
    create: {
      fullName: "Jane Employee",
      email: "employee@example.com",
      password: hashedPassword,
      phoneNumber: "+6281234567892",
      roleName: "Software Developer",
      role: Role.EMPLOYEE,
      employmentType: EmploymentType.PERMANENT,
      taxNumber: "123456791",
      identityNumber: "3201012345678903",
      startDate: new Date("2024-03-01"),
      location: "Surabaya",
      bankNumber: "1234567892",
      bankName: "Bank Negara Indonesia",
      bankAccountHolderName: "Jane Employee",
    },
  });

  console.log("✅ Created employee:", employee.email);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Test credentials (all use password: password123):");
  console.log("   Superadmin: superadmin@example.com");
  console.log("   Supervisor: supervisor@example.com");
  console.log("   Employee:   employee@example.com");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
