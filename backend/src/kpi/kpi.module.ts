import { Module } from "@nestjs/common";
import { MetricsModule } from "./metrics/metrics.module";
import { PeriodsModule } from "./periods/periods.module";
import { TargetsModule } from "./targets/targets.module";
import { ScoresModule } from "./scores/scores.module";

@Module({
  imports: [MetricsModule, PeriodsModule, TargetsModule, ScoresModule],
  exports: [MetricsModule, PeriodsModule, TargetsModule, ScoresModule],
})
export class KpiModule {}
