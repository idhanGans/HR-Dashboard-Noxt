import { Module } from "@nestjs/common";
import { ScoresController } from "./scores.controller";
import { ScoresService } from "./scores.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { MetricsModule } from "../metrics/metrics.module";
import { PeriodsModule } from "../periods/periods.module";

@Module({
  imports: [PrismaModule, MetricsModule, PeriodsModule],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
