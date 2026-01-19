import { Module } from "@nestjs/common";
import { PeriodsController } from "@/kpi/periods/periods.controller";
import { PeriodsService } from "@/kpi/periods/periods.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PeriodsController],
  providers: [PeriodsService],
  exports: [PeriodsService],
})
export class PeriodsModule {}
