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
import { LoggerService } from "@/common/logging";
import { runWithCorrelationId } from "@/common/correlation";

/**
 * Generate a timestamp-based execution ID for scheduled tasks
 * Format: task-name_YYYYMMDD_HHmmss_ms
 */
function generateExecutionId(taskName: string): string {
  const now = new Date();
  const datePart = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const msPart = now.getMilliseconds().toString().padStart(3, "0");
  return `${taskName}_${datePart}_${msPart}`;
}

@ApiTags("internal")
@ApiHeader({
  name: "x-scheduler-token",
  description: "Shared secret for scheduled task authentication",
  required: true,
})
@Controller("internal/attendance/records")
@UseGuards(SchedulerTokenGuard)
export class AttendanceRecordsInternalController {
  constructor(
    private readonly recordsService: AttendanceRecordsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext("ScheduledTask");
  }

  @Post("auto-checkout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Run auto checkout for open attendance records" })
  @ApiResponse({ status: 204, description: "Auto checkout completed" })
  async autoCheckout(): Promise<void> {
    const executionId = generateExecutionId("auto-checkout");

    await runWithCorrelationId(executionId, async () => {
      const startTime = Date.now();

      this.logger.logEvent(
        "scheduled_task_start",
        "Auto checkout task started",
        {
          task_name: "auto-checkout",
          execution_id: executionId,
        },
      );

      try {
        const recordsProcessed =
          await this.recordsService.autoCheckoutOpenRecords();
        const duration = Date.now() - startTime;

        this.logger.logEvent(
          "scheduled_task_end",
          "Auto checkout task completed",
          {
            task_name: "auto-checkout",
            execution_id: executionId,
            duration_ms: duration,
            status: "success",
            records_processed: recordsProcessed,
          },
        );
      } catch (error) {
        const duration = Date.now() - startTime;

        this.logger.logError(
          "Auto checkout task failed",
          error instanceof Error ? error : new Error(String(error)),
          {
            task_name: "auto-checkout",
            execution_id: executionId,
            duration_ms: duration,
            status: "failed",
          },
        );

        throw error;
      }
    });
  }

  @Post("mark-absent")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark absent records for the previous day" })
  @ApiResponse({ status: 204, description: "Absent records marked" })
  async markAbsent(): Promise<void> {
    const executionId = generateExecutionId("mark-absent");

    await runWithCorrelationId(executionId, async () => {
      const startTime = Date.now();

      this.logger.logEvent("scheduled_task_start", "Mark absent task started", {
        task_name: "mark-absent",
        execution_id: executionId,
      });

      try {
        const recordsProcessed = await this.recordsService.markAbsentRecords();
        const duration = Date.now() - startTime;

        this.logger.logEvent(
          "scheduled_task_end",
          "Mark absent task completed",
          {
            task_name: "mark-absent",
            execution_id: executionId,
            duration_ms: duration,
            status: "success",
            records_processed: recordsProcessed,
          },
        );
      } catch (error) {
        const duration = Date.now() - startTime;

        this.logger.logError(
          "Mark absent task failed",
          error instanceof Error ? error : new Error(String(error)),
          {
            task_name: "mark-absent",
            execution_id: executionId,
            duration_ms: duration,
            status: "failed",
          },
        );

        throw error;
      }
    });
  }
}
