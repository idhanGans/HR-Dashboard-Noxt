import { Module } from "@nestjs/common";
import { AttendanceRecordsController } from "@/attendance/records/attendance-records.controller";
import { AttendanceRecordsInternalController } from "@/attendance/records/attendance-records.internal.controller";
import { AttendanceRecordsService } from "@/attendance/records/attendance-records.service";
import { SchedulerTokenGuard } from "@/common/guards/scheduler-token.guard";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [
    AttendanceRecordsController,
    AttendanceRecordsInternalController,
  ],
  providers: [AttendanceRecordsService, SchedulerTokenGuard],
  exports: [AttendanceRecordsService],
})
export class AttendanceRecordsModule {}
