import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PayrollStatsService } from "@/payroll/stats/payroll-stats.service";
import {
  DepartmentPayrollTotalDto,
  PayrollPeriodDto,
  PayrollTotalDto,
} from "@/payroll/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";

@ApiTags("payroll")
@Controller("payroll/stats")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollStatsController {
  constructor(private readonly payrollStatsService: PayrollStatsService) {}

  @Get("department")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({
    summary: "Get total payroll by department for a given period",
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
    description: "Totals by department",
    type: DepartmentPayrollTotalDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: "Invalid month/year parameters" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async getDepartmentTotals(
    @Query() period: PayrollPeriodDto,
  ): Promise<DepartmentPayrollTotalDto[]> {
    return this.payrollStatsService.getDepartmentTotals(
      period.month,
      period.year,
    );
  }

  @Get("total-current-month")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get total payroll for the current month" })
  @ApiResponse({
    status: 200,
    description: "Total payroll for current month",
    type: PayrollTotalDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async getTotalForCurrentMonth(): Promise<PayrollTotalDto> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return this.payrollStatsService.getTotalForMonth(month, year);
  }
}
