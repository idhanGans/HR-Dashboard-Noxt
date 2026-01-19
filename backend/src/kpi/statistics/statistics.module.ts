import { Module } from "@nestjs/common";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { PeriodsModule } from "../periods/periods.module";

@Module({
  imports: [PrismaModule, PeriodsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
