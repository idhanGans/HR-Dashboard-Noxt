import { Module } from "@nestjs/common";
import { AttendanceRecordsController } from "@/attendance/records/attendance-records.controller";
import { AttendanceRecordsService } from "@/attendance/records/attendance-records.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceRecordsController],
  providers: [AttendanceRecordsService],
  exports: [AttendanceRecordsService],
})
export class AttendanceRecordsModule {}
