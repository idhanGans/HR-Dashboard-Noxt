import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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
  CreatePayrollDto,
  PayrollPeriodDto,
  PayrollResponseDto,
  UpdatePayrollDto,
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
  @ApiResponse({ status: 404, description: "Payroll not found" })
  async findByPeriod(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollsService.findByPeriod(
      userId,
      period.month,
      period.year,
    );
  }

  @Post(":userId")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create payroll for a user" })
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: 1,
    type: Number,
  })
  @ApiBody({ type: CreatePayrollDto })
  @ApiResponse({
    status: 201,
    description: "Payroll created successfully",
    type: PayrollResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 409,
    description: "Payroll already exists for month/year",
  })
  async create(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() createPayrollDto: CreatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollsService.create(userId, createPayrollDto);
  }

  @Put(":userId")
  @ApiOperation({ summary: "Update payroll for a user by period" })
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
  @ApiBody({ type: UpdatePayrollDto })
  @ApiResponse({
    status: 200,
    description: "Payroll updated successfully",
    type: PayrollResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid update payload" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User or payroll not found" })
  async updateByPeriod(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
    @Body() updatePayrollDto: UpdatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollsService.updateByPeriod(
      userId,
      period.month,
      period.year,
      updatePayrollDto,
    );
  }
}
