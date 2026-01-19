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
import { PeriodsService } from "./periods.service";
import {
  CreatePeriodDto,
  PeriodResponseDto,
  PaginatedPeriodsResponseDto,
} from "../dto";
import { PaginationQueryDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";

@ApiTags("kpi-periods")
@Controller("kpi/periods")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new KPI period" })
  @ApiBody({ type: CreatePeriodDto })
  @ApiResponse({
    status: 201,
    description: "Period created successfully",
    type: PeriodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed or period overlaps",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  async create(
    @Body() createPeriodDto: CreatePeriodDto,
  ): Promise<PeriodResponseDto> {
    return this.periodsService.create(createPeriodDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get all KPI periods (paginated and searchable)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by period name (case-insensitive)",
    example: "January",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of periods",
    type: PaginatedPeriodsResponseDto,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedPeriodsResponseDto> {
    return this.periodsService.findAll(paginationQuery);
  }

  @Get("current")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get current active period" })
  @ApiResponse({
    status: 200,
    description: "Returns the current active period",
    type: PeriodResponseDto,
  })
  @ApiResponse({ status: 404, description: "No active period found" })
  async findCurrent(): Promise<PeriodResponseDto | null> {
    return this.periodsService.findCurrent();
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get a period by ID" })
  @ApiParam({ name: "id", description: "Period ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns the period",
    type: PeriodResponseDto,
  })
  @ApiResponse({ status: 404, description: "Period not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PeriodResponseDto> {
    return this.periodsService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update a period" })
  @ApiParam({ name: "id", description: "Period ID", example: 1, type: Number })
  @ApiBody({ type: CreatePeriodDto })
  @ApiResponse({
    status: 200,
    description: "Period updated successfully",
    type: PeriodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Cannot update period that has scores",
  })
  @ApiResponse({ status: 404, description: "Period not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePeriodDto: Partial<CreatePeriodDto>,
  ): Promise<PeriodResponseDto> {
    return this.periodsService.update(id, updatePeriodDto);
  }
}
