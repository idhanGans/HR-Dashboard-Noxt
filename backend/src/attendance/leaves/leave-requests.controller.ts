import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LeaveRequestsService } from "@/attendance/leaves/leave-requests.service";
import {
  CreateLeaveRequestDto,
  LeaveBalanceDto,
  LeaveEntitlementDto,
  LeaveRequestResponseDto,
  LeaveRequestsMeQueryDto,
  LeaveRequestsQueryDto,
  PaginatedLeaveRequestsResponseDto,
  UpdateLeaveEntitlementsDto,
} from "@/attendance/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";

@ApiTags("attendance-leaves")
@Controller("attendance/leaves")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Create a leave request" })
  @ApiBody({ type: CreateLeaveRequestDto })
  @ApiResponse({
    status: 201,
    description: "Leave request created",
    type: LeaveRequestResponseDto,
  })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto> {
    return this.leaveRequestsService.create(user.id, dto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get leave requests (paginated and filtered)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "userId", required: false, type: Number, example: 1 })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    example: "PENDING",
  })
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
    description: "Returns paginated leave requests",
    type: PaginatedLeaveRequestsResponseDto,
  })
  async findAll(
    @Query() query: LeaveRequestsQueryDto,
  ): Promise<PaginatedLeaveRequestsResponseDto> {
    return this.leaveRequestsService.findAll(query);
  }

  @Get("balance")
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Get leave balance for current user" })
  @ApiResponse({
    status: 200,
    description: "Returns leave balances by type",
    type: [LeaveBalanceDto],
  })
  async getBalance(@CurrentUser() user: UserPayload): Promise<LeaveBalanceDto[]> {
    return this.leaveRequestsService.getLeaveBalances(user.id);
  }

  @Get("recent-approvals")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get recently approved leave requests" })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: "Returns recent approvals",
    type: [LeaveRequestResponseDto],
  })
  async findRecentApprovals(
    @Query("limit") limit?: string,
  ): Promise<LeaveRequestResponseDto[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const safeLimit =
      parsedLimit && parsedLimit > 0 ? Math.min(parsedLimit, 100) : undefined;
    return this.leaveRequestsService.findRecentApprovals(safeLimit);
  }

  @Put("entitlements")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update global leave entitlements" })
  @ApiBody({ type: UpdateLeaveEntitlementsDto })
  @ApiResponse({
    status: 200,
    description: "Updated leave entitlements",
    type: [LeaveEntitlementDto],
  })
  async updateEntitlements(
    @Body() dto: UpdateLeaveEntitlementsDto,
  ): Promise<LeaveEntitlementDto[]> {
    return this.leaveRequestsService.updateEntitlements(dto);
  }

  @Get("me")
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Get current user's leave requests" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    example: "PENDING",
  })
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
    description: "Returns paginated leave requests",
    type: PaginatedLeaveRequestsResponseDto,
  })
  async findMine(
    @CurrentUser() user: UserPayload,
    @Query() query: LeaveRequestsMeQueryDto,
  ): Promise<PaginatedLeaveRequestsResponseDto> {
    return this.leaveRequestsService.findMine(user.id, query);
  }

  @Put(":id/approve")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Approve a leave request" })
  @ApiParam({ name: "id", description: "Leave request ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Leave request approved",
    type: LeaveRequestResponseDto,
  })
  async approve(
    @CurrentUser() user: UserPayload,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<LeaveRequestResponseDto> {
    return this.leaveRequestsService.approve(id, user);
  }

  @Put(":id/reject")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Reject a leave request" })
  @ApiParam({ name: "id", description: "Leave request ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Leave request rejected",
    type: LeaveRequestResponseDto,
  })
  async reject(
    @CurrentUser() user: UserPayload,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<LeaveRequestResponseDto> {
    return this.leaveRequestsService.reject(id, user);
  }
}
