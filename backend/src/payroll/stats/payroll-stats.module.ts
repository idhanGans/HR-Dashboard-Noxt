import { Module } from "@nestjs/common";
import { PayrollStatsController } from "@/payroll/stats/payroll-stats.controller";
import { PayrollStatsService } from "@/payroll/stats/payroll-stats.service";

@Module({
  controllers: [PayrollStatsController],
  providers: [PayrollStatsService],
})
export class PayrollStatsModule {}
