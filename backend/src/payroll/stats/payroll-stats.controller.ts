import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PayrollStatsService } from "@/payroll/stats/payroll-stats.service";
import {
  DepartmentPayrollTotalDto,
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
  @ApiOperation({ summary: "Get total payroll by department for the current month" })
  @ApiResponse({
    status: 200,
    description: "Totals by department",
    type: DepartmentPayrollTotalDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async getDepartmentTotals(): Promise<DepartmentPayrollTotalDto[]> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return this.payrollStatsService.getDepartmentTotals(month, year);
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
