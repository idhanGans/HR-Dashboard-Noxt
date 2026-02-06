import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { UsersModule } from "@/users/users.module";
import { OrganizationsModule } from "@/organizations/organizations.module";
import { AuthModule } from "@/auth/auth.module";
import { KpiModule } from "@/kpi/kpi.module";
import { PayrollModule } from "./payroll/payroll.module";
import { AttendanceModule } from "@/attendance/attendance.module";
import { StorageModule } from "@/storage/storage.module";
import { OrgChartModule } from "@/org-chart/org-chart.module";
import { validate } from "@/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    KpiModule,
    PayrollModule,
    AttendanceModule,
    OrgChartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
