import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { LoggingModule } from "@/common/logging";
import { CorrelationIdMiddleware } from "@/common/correlation";
import { OrgChartModule } from "@/org-chart/org-chart.module";
import { validate } from "@/config";
import { DashboardModule } from "@/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    LoggingModule,
    PrismaModule,
    StorageModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    KpiModule,
    PayrollModule,
    AttendanceModule,
    OrgChartModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply correlation ID middleware to all routes
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
