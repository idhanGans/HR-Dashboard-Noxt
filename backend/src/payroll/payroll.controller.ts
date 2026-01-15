import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PayrollService } from "./payroll.service";
import {
  CreatePayrollDto,
  PayrollPeriodDto,
  PayrollResponseDto,
  UpdatePayrollDto,
} from "@/payroll/dto";

@ApiTags("payroll")
@Controller("payroll")
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post(":userId")
  @HttpCode(HttpStatus.CREATED)
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
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 409,
    description: "Payroll already exists for month/year",
  })
  async create(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() createPayrollDto: CreatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollService.create(userId, createPayrollDto);
  }

  @Put(":userId")
  @ApiOperation({ summary: "Update payroll for a user by period" })
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
  @ApiResponse({ status: 404, description: "User or payroll not found" })
  async updateByPeriod(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
    @Body() updatePayrollDto: UpdatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollService.updateByPeriod(
      userId,
      period.month,
      period.year,
      updatePayrollDto,
    );
  }
}
