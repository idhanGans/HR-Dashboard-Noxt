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

  // Create KPI Periods dynamically based on current date (Feb 13, 2026)
  const today = new Date("2026-02-13");
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // Helper function to get period name and dates
  const getPeriodInfo = (year: number, month: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month
    return {
      name: `${monthNames[month]} ${year}`,
      startDate,
      endDate,
    };
  };

  // Create periods: previous month, current month (active), and next month
  const periods = [
    {
      ...getPeriodInfo(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth - 1,
      ),
      isActive: false,
    },
    {
      ...getPeriodInfo(currentYear, currentMonth),
      isActive: true, // Current month is active
    },
    {
      ...getPeriodInfo(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 0 : currentMonth + 1,
      ),
      isActive: false,
    },
  ];

  const periodObjects: Record<string, any> = {};

  for (const periodInfo of periods) {
    const period = await prisma.kpiPeriod.upsert({
      where: {
        organizationId_name_startDate_endDate: {
          organizationId: organization.id,
          name: periodInfo.name,
          startDate: periodInfo.startDate,
          endDate: periodInfo.endDate,
        },
      },
      update: { isActive: periodInfo.isActive },
      create: {
        name: periodInfo.name,
        startDate: periodInfo.startDate,
        endDate: periodInfo.endDate,
        organizationId: organization.id,
        isActive: periodInfo.isActive,
      },
    });
    periodObjects[periodInfo.name] = period;
    console.log(
      `✅ Created KPI period: ${period.name} (Active: ${period.isActive})`,
    );
  }

  // Create KPI Metrics with all targets set to 10
  const metrics = [
    {
      name: "Attendance",
      description: "Regular attendance and presence at work",
      target: 10,
    },
    {
      name: "Punctuality",
      description: "Timeliness in arrival and deadline adherence",
      target: 10,
    },
    {
      name: "Response",
      description: "Speed and quality of response to requests",
      target: 10,
    },
    {
      name: "Communication",
      description: "Effectiveness in conveying information",
      target: 10,
    },
    {
      name: "Work as Team",
      description: "Collaboration and teamwork skills",
      target: 10,
    },
    {
      name: "Productivity",
      description: "Output and efficiency of work completed",
      target: 10,
    },
    {
      name: "Quality of Work",
      description: "Accuracy and quality of deliverables",
      target: 10,
    },
    {
      name: "Initiative & Problem Solving",
      description: "Proactive approach and problem-solving ability",
      target: 10,
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

    // Create targets for all dynamic periods
    for (const periodName in periodObjects) {
      const periodId = periodObjects[periodName].id;
      await prisma.kpiTarget.upsert({
        where: {
          metricId_periodId: {
            metricId: metric.id,
            periodId,
          },
        },
        update: {
          target: metricData.target,
        },
        create: {
          metricId: metric.id,
          periodId,
          organizationId: organization.id,
          target: metricData.target,
        },
      });
    }

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
