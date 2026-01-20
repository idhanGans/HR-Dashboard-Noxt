import { Module } from "@nestjs/common";
import { AttendanceRecordsModule } from "@/attendance/records/attendance-records.module";
import { LeaveRequestsModule } from "@/attendance/leaves/leave-requests.module";

@Module({
  imports: [AttendanceRecordsModule, LeaveRequestsModule],
  exports: [AttendanceRecordsModule, LeaveRequestsModule],
})
export class AttendanceModule {}
