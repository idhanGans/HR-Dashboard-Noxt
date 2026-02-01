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
      position: "System Administrator",
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
      position: "Team Lead",
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

  // Create Organization
  let organization = await prisma.organization.findFirst({
    where: {
      supervisorId: supervisor.id,
    },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: "Engineering Department",
        supervisorId: supervisor.id,
      },
    });
    console.log("✅ Created organization:", organization.name);
  } else {
    console.log("✅ Found existing organization:", organization.name);
  }

  // Assign supervisor to organization
  await prisma.user.update({
    where: { id: supervisor.id },
    data: { organizationId: organization.id },
  });

  // Create Employee
  const employee = await prisma.user.upsert({
    where: { email: "employee@example.com" },
    update: {},
    create: {
      fullName: "Jane Employee",
      email: "employee@example.com",
      password: hashedPassword,
      phoneNumber: "+6281234567892",
      position: "Software Developer",
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

  // Create KPI Period for January 2026
  const january2026Period = await prisma.kpiPeriod.upsert({
    where: {
      organizationId_name_startDate_endDate: {
        organizationId: organization.id,
        name: "January 2026",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-01-31"),
      },
    },
    update: {},
    create: {
      name: "January 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-31"),
      organizationId: organization.id,
      isActive: true,
    },
  });

  console.log("✅ Created KPI period:", january2026Period.name);

  // Create KPI Metrics
  const metrics = [
    {
      name: "Customer Satisfaction",
      description: "Overall customer satisfaction rating",
      target: 9.0,
    },
    {
      name: "Project Completion Rate",
      description: "Percentage of projects completed on time",
      target: 8.5,
    },
    {
      name: "Code Quality Score",
      description: "Average code quality assessment score",
      target: 9.5,
    },
    {
      name: "Team Collaboration",
      description: "Team collaboration and communication effectiveness",
      target: 8.8,
    },
  ];

  for (const metricData of metrics) {
    const metric = await prisma.kpiMetric.upsert({
      where: {
        organizationId_name: {
          organizationId: organization.id,
          name: metricData.name,
        },
      },
      update: {},
      create: {
        name: metricData.name,
        description: metricData.description,
        organizationId: organization.id,
        isActive: true,
      },
    });

    // Create target for January 2026 period
    await prisma.kpiTarget.upsert({
      where: {
        metricId_periodId: {
          metricId: metric.id,
          periodId: january2026Period.id,
        },
      },
      update: {
        target: metricData.target,
      },
      create: {
        metricId: metric.id,
        periodId: january2026Period.id,
        organizationId: organization.id,
        target: metricData.target,
      },
    });

    console.log(
      `✅ Created metric "${metric.name}" with target ${metricData.target}`,
    );
  }

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
