import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { DashboardService } from "@/dashboard/dashboard.service";
import {
  DashboardOverviewQueryDto,
  DashboardOverviewResponseDto,
} from "@/dashboard/dto/dashboard.dto";

@ApiTags("dashboard")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({
    summary:
      "Get dashboard overview (employees, attendance, KPI trend, top performers)",
  })
  @ApiResponse({
    status: 200,
    description: "Dashboard overview payload",
    type: DashboardOverviewResponseDto,
  })
  async getOverview(
    @Query() query: DashboardOverviewQueryDto,
  ): Promise<DashboardOverviewResponseDto> {
    return this.dashboardService.getOverview({
      timezone: query.timezone,
      months: query.months,
    });
  }
}
