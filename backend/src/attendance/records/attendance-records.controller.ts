import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AttendanceRecordsService } from "@/attendance/records/attendance-records.service";
import {
  AttendanceRecordResponseDto,
  AttendanceRecordsQueryDto,
  CreateCheckInDto,
  PaginatedAttendanceRecordsResponseDto,
} from "@/attendance/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";

@ApiTags("attendance-records")
@Controller("attendance/records")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceRecordsController {
  constructor(private readonly recordsService: AttendanceRecordsService) {}

  @Post("check-in")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Check in for the current user" })
  @ApiBody({ type: CreateCheckInDto, required: false })
  @ApiResponse({
    status: 400,
    description: "Already checked in today or has an open record",
  })
  @ApiResponse({
    status: 201,
    description: "Checked in successfully",
    type: AttendanceRecordResponseDto,
  })
  async checkIn(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateCheckInDto,
  ): Promise<AttendanceRecordResponseDto> {
    return this.recordsService.checkIn(user.id, body.timezone);
  }

  @Post("check-out")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Check out for the current user" })
  @ApiResponse({
    status: 200,
    description: "Checked out successfully",
    type: AttendanceRecordResponseDto,
  })
  async checkOut(
    @CurrentUser() user: UserPayload,
  ): Promise<AttendanceRecordResponseDto> {
    return this.recordsService.checkOut(user.id);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get attendance records for all users" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "startDate",
    required: false,
    type: String,
    example: "2024-02-01T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    type: String,
    example: "2024-02-28T23:59:59Z",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated attendance records",
    type: PaginatedAttendanceRecordsResponseDto,
  })
  async findAll(
    @Query() query: AttendanceRecordsQueryDto,
  ): Promise<PaginatedAttendanceRecordsResponseDto> {
    return this.recordsService.findAll(query);
  }

  @Get("me")
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Get current user's attendance records" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "startDate",
    required: false,
    type: String,
    example: "2024-02-01T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    type: String,
    example: "2024-02-28T23:59:59Z",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated attendance records",
    type: PaginatedAttendanceRecordsResponseDto,
  })
  async findMine(
    @CurrentUser() user: UserPayload,
    @Query() query: AttendanceRecordsQueryDto,
  ): Promise<PaginatedAttendanceRecordsResponseDto> {
    return this.recordsService.findAll(query, user.id);
  }
}
