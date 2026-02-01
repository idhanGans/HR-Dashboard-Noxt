import {
  Controller,
  Get,
  Post,
  Put,
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
import { TargetsService } from "@/kpi/targets/targets.service";
import {
  CreateTargetDto,
  UpdateTargetDto,
  TargetResponseDto,
  PaginatedTargetsResponseDto,
} from "@/kpi/dto";
import { PaginationQueryDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Role } from "@/users/dto";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { BadRequestException } from "@nestjs/common";

@ApiTags("kpi-targets")
@Controller("kpi/targets")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new KPI target" })
  @ApiBody({ type: CreateTargetDto })
  @ApiResponse({
    status: 201,
    description: "Target created successfully",
    type: TargetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or target already exists",
  })
  @ApiResponse({ status: 404, description: "Metric or period not found" })
  async create(
    @Body() createTargetDto: CreateTargetDto,
    @CurrentUser() user: UserPayload,
  ) {
    // For superadmins, allow override; for others, use their org
    const organizationId =
      user.role === Role.SUPERADMIN
        ? (createTargetDto.organizationId ?? user.organizationId)
        : user.organizationId;

    if (!organizationId) {
      throw new BadRequestException("User must belong to an organization");
    }

    return this.targetsService.create(createTargetDto, organizationId);
  }

  @Get()
  @Roles(Role.SUPERVISOR, Role.SUPERADMIN)
  @ApiOperation({ summary: "Get all KPI targets (paginated and filterable)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "periodId",
    required: false,
    type: Number,
    description: "Filter by period ID",
  })
  @ApiQuery({
    name: "metricId",
    required: false,
    type: Number,
    description: "Filter by metric ID",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of targets",
    type: PaginatedTargetsResponseDto,
  })
  async findAll(
    @Query()
    paginationQuery: PaginationQueryDto & {
      periodId?: number;
      metricId?: number;
    },
    @CurrentUser() user: UserPayload,
  ) {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.targetsService.findAll(paginationQuery, organizationId);
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR, Role.SUPERADMIN)
  @ApiOperation({ summary: "Get a target by ID" })
  @ApiParam({ name: "id", description: "Target ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns the target",
    type: TargetResponseDto,
  })
  @ApiResponse({ status: 404, description: "Target not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.targetsService.findOne(id, organizationId);
  }

  @Put(":id")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update a target" })
  @ApiParam({ name: "id", description: "Target ID", example: 1, type: Number })
  @ApiBody({ type: UpdateTargetDto })
  @ApiResponse({
    status: 200,
    description: "Target updated successfully",
    type: TargetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Cannot update target when period window is closed",
  })
  @ApiResponse({ status: 404, description: "Target not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTargetDto: UpdateTargetDto,
    @CurrentUser() user: UserPayload,
  ) {
    // For superadmins, don't filter by organization; for others, filter by their org
    const organizationId =
      user.role === Role.SUPERADMIN ? undefined : user.organizationId;

    return this.targetsService.update(id, updateTargetDto, organizationId);
  }
}
