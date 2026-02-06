import { Module } from "@nestjs/common";
import { OrgChartController } from "@/org-chart/org-chart.controller";
import { OrgChartService } from "@/org-chart/org-chart.service";

@Module({
  controllers: [OrgChartController],
  providers: [OrgChartService],
  exports: [OrgChartService],
})
export class OrgChartModule {}
