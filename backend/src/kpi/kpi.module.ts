import { Module } from "@nestjs/common";
import { MetricsModule } from "./metrics/metrics.module";
import { PeriodsModule } from "./periods/periods.module";
import { TargetsModule } from "./targets/targets.module";
import { ScoresModule } from "./scores/scores.module";
import { StatisticsModule } from "./statistics/statistics.module";

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
