import { Module } from "@nestjs/common";
import { MetricsController } from "@/kpi/metrics/metrics.controller";
import { MetricsService } from "@/kpi/metrics/metrics.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
