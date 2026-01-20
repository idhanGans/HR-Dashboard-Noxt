import { Module } from "@nestjs/common";
import { PayslipsController } from "@/payroll/payslips/payslips.controller";
import { PayslipsService } from "@/payroll/payslips/payslips.service";

@Module({
  controllers: [PayslipsController],
  providers: [PayslipsService],
})
export class PayslipsModule {}
