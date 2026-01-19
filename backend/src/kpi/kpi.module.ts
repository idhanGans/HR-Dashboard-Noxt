import { Module } from "@nestjs/common";
import { MetricsModule } from "@/kpi/metrics/metrics.module";
import { PeriodsModule } from "@/kpi/periods/periods.module";
import { TargetsModule } from "@/kpi/targets/targets.module";
import { ScoresModule } from "@/kpi/scores/scores.module";
import { StatisticsModule } from "@/kpi/statistics/statistics.module";

@Module({
  imports: [
    MetricsModule,
    PeriodsModule,
    TargetsModule,
    ScoresModule,
    StatisticsModule,
  ],
  exports: [
    MetricsModule,
    PeriodsModule,
    TargetsModule,
    ScoresModule,
    StatisticsModule,
  ],
})
export class KpiModule {}
