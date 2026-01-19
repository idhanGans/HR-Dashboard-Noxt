import { Module } from "@nestjs/common";
import { TargetsController } from "./targets.controller";
import { TargetsService } from "./targets.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { MetricsModule } from "../metrics/metrics.module";
import { PeriodsModule } from "../periods/periods.module";

@Module({
  imports: [PrismaModule, MetricsModule, PeriodsModule],
  controllers: [TargetsController],
  providers: [TargetsService],
  exports: [TargetsService],
})
export class TargetsModule {}
