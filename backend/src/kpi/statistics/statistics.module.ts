import { Module } from "@nestjs/common";
import { StatisticsController } from "@/kpi/statistics/statistics.controller";
import { StatisticsService } from "@/kpi/statistics/statistics.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { PeriodsModule } from "@/kpi/periods/periods.module";

@Module({
  imports: [PrismaModule, PeriodsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
