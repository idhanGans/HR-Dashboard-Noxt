import { Module } from "@nestjs/common";
import { PayrollsModule } from "@/payroll/payrolls/payrolls.module";
import { PayrollStatsModule } from "@/payroll/stats/payroll-stats.module";
import { PayslipsModule } from "@/payroll/payslips/payslips.module";

@Module({
  imports: [PayrollsModule, PayrollStatsModule, PayslipsModule],
  exports: [PayrollsModule, PayrollStatsModule, PayslipsModule],
})
export class PayrollModule {}
