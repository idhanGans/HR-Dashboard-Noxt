import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AttendanceRecordsService } from "@/attendance/records/attendance-records.service";
import { SchedulerTokenGuard } from "@/common/guards/scheduler-token.guard";

@ApiTags("internal")
@ApiHeader({
  name: "x-scheduler-token",
  description: "Shared secret for Cloud Scheduler",
  required: true,
})
@Controller("internal/attendance/records")
@UseGuards(SchedulerTokenGuard)
export class AttendanceRecordsInternalController {
  constructor(private readonly recordsService: AttendanceRecordsService) {}

  @Post("auto-checkout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Run auto checkout for open attendance records" })
  @ApiResponse({ status: 204, description: "Auto checkout completed" })
  async autoCheckout(): Promise<void> {
    await this.recordsService.autoCheckoutOpenRecords();
  }

  @Post("mark-absent")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark absent records for the previous day" })
  @ApiResponse({ status: 204, description: "Absent records marked" })
  async markAbsent(): Promise<void> {
    await this.recordsService.markAbsentRecords();
  }
}
