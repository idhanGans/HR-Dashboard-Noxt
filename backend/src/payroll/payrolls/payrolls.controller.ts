import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PayrollsService } from "@/payroll/payrolls/payrolls.service";
import {
  PayrollPeriodDto,
  PayrollResponseDto,
  UpsertPayrollDto,
} from "@/payroll/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { SelfOrRoles, Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { SelfOrRolesGuard } from "@/auth/guards/self-or-roles.guard";

@ApiTags("payroll")
@Controller("payroll")
@UseGuards(JwtAuthGuard, SelfOrRolesGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Get(":userId")
  @ApiOperation({ summary: "Get payroll for a user by period" })
  @SelfOrRoles("userId", Role.SUPERADMIN)
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "month",
    description: "Payroll Month",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "year",
    description: "Payroll Year",
    example: 2024,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Payroll retrieved successfully",
    type: PayrollResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid month/year parameters" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async findByPeriod(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
  ): Promise<PayrollResponseDto | null> {
    return this.payrollsService.findByPeriod(userId, period.month, period.year);
  }

  @Put(":userId")
  @ApiOperation({ summary: "Upsert payroll for a user by period" })
  @Roles(Role.SUPERADMIN)
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "month",
    description: "Payroll Month",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "year",
    description: "Payroll Year",
    example: 2024,
    type: Number,
  })
  @ApiBody({ type: UpsertPayrollDto })
  @ApiResponse({
    status: 200,
    description: "Payroll upserted successfully",
    type: PayrollResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid payload" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async upsertByPeriod(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
    @Body() upsertPayrollDto: UpsertPayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollsService.upsertByPeriod(
      userId,
      period.month,
      period.year,
      upsertPayrollDto,
    );
  }
}
