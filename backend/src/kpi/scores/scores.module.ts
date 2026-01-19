import { Module } from "@nestjs/common";
import { ScoresController } from "@/kpi/scores/scores.controller";
import { ScoresService } from "@/kpi/scores/scores.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { MetricsModule } from "@/kpi/metrics/metrics.module";
import { PeriodsModule } from "@/kpi/periods/periods.module";

@Module({
  imports: [PrismaModule, MetricsModule, PeriodsModule],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
