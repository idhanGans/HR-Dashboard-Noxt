import { Module } from "@nestjs/common";
import { PayrollsController } from "@/payroll/payrolls/payrolls.controller";
import { PayrollsService } from "@/payroll/payrolls/payrolls.service";

@Module({
  controllers: [PayrollsController],
  providers: [PayrollsService],
})
export class PayrollsModule {}
