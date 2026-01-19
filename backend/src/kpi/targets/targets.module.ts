import { Module } from "@nestjs/common";
import { TargetsController } from "@/kpi/targets/targets.controller";
import { TargetsService } from "@/kpi/targets/targets.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { MetricsModule } from "@/kpi/metrics/metrics.module";
import { PeriodsModule } from "@/kpi/periods/periods.module";

@Module({
  imports: [PrismaModule, MetricsModule, PeriodsModule],
  controllers: [TargetsController],
  providers: [TargetsService],
  exports: [TargetsService],
})
export class TargetsModule {}
