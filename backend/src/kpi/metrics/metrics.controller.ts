import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MetricsService } from "@/kpi/metrics/metrics.service";
import {
  CreateMetricDto,
  UpdateMetricDto,
  MetricResponseDto,
  PaginatedMetricsResponseDto,
} from "@/kpi/dto";
import { PaginationQueryDto, PaginatedResponseDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Role } from "@/users/dto";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { BadRequestException } from "@nestjs/common";
import { KpiMetric } from "@prisma/client";

@ApiTags("kpi-metrics")
@Controller("kpi/metrics")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new KPI metric" })
  @ApiBody({ type: CreateMetricDto })
  @ApiResponse({
    status: 201,
    description: "Metric created successfully",
    type: MetricResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  async create(
    @Body() createMetricDto: CreateMetricDto,
    @CurrentUser() user: UserPayload,
  ): Promise<KpiMetric> {
    // For superadmins, allow override; for others, use their org
    const organizationId =
      user.role === Role.SUPERADMIN
        ? (createMetricDto.organizationId ?? user.organizationId)
        : user.organizationId;

    if (!organizationId) {
      throw new BadRequestException("User must belong to an organization");
    }

    return this.metricsService.create(createMetricDto, organizationId);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: "Get all KPI metrics (paginated and searchable)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by metric name (case-insensitive)",
    example: "customer",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of metrics",
    type: PaginatedMetricsResponseDto,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() user: UserPayload,
  ): Promise<PaginatedResponseDto<KpiMetric>> {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.metricsService.findAll(paginationQuery, organizationId);
  }

  @Get(":id")
  @Roles(Role.SUPERADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: "Get a metric by ID" })
  @ApiParam({ name: "id", description: "Metric ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns the metric",
    type: MetricResponseDto,
  })
  @ApiResponse({ status: 404, description: "Metric not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ): Promise<KpiMetric> {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.metricsService.findOne(id, organizationId);
  }

  @Put(":id")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update a metric" })
  @ApiParam({ name: "id", description: "Metric ID", example: 1, type: Number })
  @ApiBody({ type: UpdateMetricDto })
  @ApiResponse({
    status: 200,
    description: "Metric updated successfully",
    type: MetricResponseDto,
  })
  @ApiResponse({ status: 404, description: "Metric not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMetricDto: UpdateMetricDto,
    @CurrentUser() user: UserPayload,
  ): Promise<KpiMetric> {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.metricsService.update(id, updateMetricDto, organizationId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Soft delete a metric" })
  @ApiParam({ name: "id", description: "Metric ID", example: 1, type: Number })
  @ApiResponse({
    status: 204,
    description: "Metric soft deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Metric not found" })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.metricsService.remove(id, organizationId);
  }
}
