import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@/common/dto";
import { AttendanceRecordResponseDto } from "@/attendance/dto/attendance-record-response.dto";

export class PaginatedAttendanceRecordsResponseDto extends PaginatedResponseDto<AttendanceRecordResponseDto> {
  @ApiProperty({
    description: "List of attendance records",
    type: [AttendanceRecordResponseDto],
  })
  declare data: AttendanceRecordResponseDto[];
}
