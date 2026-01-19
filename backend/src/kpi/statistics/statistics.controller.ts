import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { StatisticsService } from "./statistics.service";
import {
  CompanyOverallResponseDto,
  TrendsResponseDto,
  DepartmentsResponseDto,
  TopPerformersResponseDto,
  PerformanceInsightsResponseDto,
  TrendsQueryDto,
  OverallQueryDto,
  DepartmentsQueryDto,
  TopPerformersQueryDto,
  InsightsQueryDto,
} from "../dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";

@ApiTags("kpi-statistics")
@Controller("kpi/statistics")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get("overall")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get overall company KPI score" })
  @ApiQuery({
    name: "periodId",
    required: false,
    type: Number,
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Returns overall company KPI score",
    type: CompanyOverallResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Period not found or no active period",
  })
  async getOverall(
    @Query() query: OverallQueryDto,
  ): Promise<CompanyOverallResponseDto> {
    return this.statisticsService.getOverall(query.periodId);
  }

  @Get("trends")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get KPI trend data with date range" })
  @ApiQuery({
    name: "startDate",
    required: true,
    type: String,
    description: "Start date for trend analysis (ISO string)",
    example: "2024-01-01T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: true,
    type: String,
    description: "End date for trend analysis (ISO string)",
    example: "2024-12-31T23:59:59Z",
  })
  @ApiQuery({
    name: "departmentId",
    required: false,
    type: Number,
    description: "Department ID to filter trends",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Returns KPI trend data",
    type: TrendsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid date range",
  })
  async getTrends(@Query() query: TrendsQueryDto): Promise<TrendsResponseDto> {
    return this.statisticsService.getTrends(query);
  }

  @Get("departments")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get department KPI statistics" })
  @ApiQuery({
    name: "periodId",
    required: false,
    type: Number,
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Returns department KPI statistics",
    type: DepartmentsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Period not found or no active period",
  })
  async getDepartments(
    @Query() query: DepartmentsQueryDto,
  ): Promise<DepartmentsResponseDto> {
    return this.statisticsService.getDepartments(query.periodId);
  }

  @Get("top-performers")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get top performing employees" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Limit of top performers to return (default: 3)",
    example: 3,
  })
  @ApiQuery({
    name: "periodId",
    required: false,
    type: Number,
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Returns top performing employees",
    type: TopPerformersResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Period not found or no active period",
  })
  async getTopPerformers(
    @Query() query: TopPerformersQueryDto,
  ): Promise<TopPerformersResponseDto> {
    return this.statisticsService.getTopPerformers(
      query.limit ?? 3,
      query.periodId,
    );
  }

  @Get("insights")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get performance insights" })
  @ApiQuery({
    name: "periodId",
    required: false,
    type: Number,
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Returns performance insights",
    type: PerformanceInsightsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Period not found or no active period",
  })
  async getInsights(
    @Query() query: InsightsQueryDto,
  ): Promise<PerformanceInsightsResponseDto> {
    return this.statisticsService.getInsights(query.periodId);
  }
}
