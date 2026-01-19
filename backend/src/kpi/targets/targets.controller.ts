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
import { TargetsService } from "./targets.service";
import {
  CreateTargetDto,
  UpdateTargetDto,
  TargetResponseDto,
  PaginatedTargetsResponseDto,
} from "../dto";
import { PaginationQueryDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";

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
  ): Promise<TargetResponseDto> {
    return this.targetsService.create(createTargetDto);
  }

  @Get()
  @Roles(Role.SUPERVISOR)
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
  ): Promise<PaginatedTargetsResponseDto> {
    return this.targetsService.findAll(paginationQuery);
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR)
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
  ): Promise<TargetResponseDto> {
    return this.targetsService.findOne(id);
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
  ): Promise<TargetResponseDto> {
    return this.targetsService.update(id, updateTargetDto);
  }
}
