import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@/common/dto";
import { LeaveRequestResponseDto } from "@/attendance/dto/leave-request-response.dto";

export class PaginatedLeaveRequestsResponseDto extends PaginatedResponseDto<LeaveRequestResponseDto> {
  @ApiProperty({
    description: "List of leave requests",
    type: [LeaveRequestResponseDto],
  })
  declare data: LeaveRequestResponseDto[];
}
