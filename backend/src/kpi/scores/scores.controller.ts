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
import { ScoresService } from "@/kpi/scores/scores.service";
import {
  CreateScoreDto,
  UpdateScoreDto,
  BulkCreateScoreDto,
  BulkScoreResponseDto,
  ScoreResponseDto,
  PaginatedScoresResponseDto,
} from "@/kpi/dto";
import { PaginationQueryDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { Role } from "@/users/dto";
import { Role as PrismaRole } from "@prisma/client";

@ApiTags("kpi-scores")
@Controller("kpi/scores")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Create a new KPI score" })
  @ApiBody({ type: CreateScoreDto })
  @ApiResponse({
    status: 201,
    description: "Score created successfully",
    type: ScoreResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Validation failed, scoring window closed, or score already exists",
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden - Supervisors can only score employees from their departments",
  })
  @ApiResponse({
    status: 404,
    description: "Period, metric, or user not found",
  })
  async create(
    @Body() createScoreDto: CreateScoreDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.scoresService.create(
      createScoreDto,
      user.id,
      user.role as PrismaRole,
    );
  }

  @Post("bulk")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Create or update multiple KPI scores at once" })
  @ApiBody({ type: BulkCreateScoreDto })
  @ApiResponse({
    status: 201,
    description: "Scores created/updated successfully",
    type: BulkScoreResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Validation failed, scoring window closed, or inactive metrics",
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden - Supervisors can only score employees from their departments",
  })
  @ApiResponse({
    status: 404,
    description: "Period, metric, or user not found",
  })
  async bulkCreate(
    @Body() bulkCreateScoreDto: BulkCreateScoreDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.scoresService.bulkCreate(
      bulkCreateScoreDto,
      user.id,
      user.role as PrismaRole,
    );
  }

  @Get()
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get all KPI scores (paginated and filterable)" })
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
  @ApiQuery({
    name: "scoredUserId",
    required: false,
    type: Number,
    description: "Filter by scored user ID",
  })
  @ApiQuery({
    name: "scorerId",
    required: false,
    type: Number,
    description: "Filter by scorer ID",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of scores",
    type: PaginatedScoresResponseDto,
  })
  async findAll(
    @Query()
    paginationQuery: PaginationQueryDto & {
      periodId?: number;
      metricId?: number;
      scoredUserId?: number;
      scorerId?: number;
    },
  ) {
    return this.scoresService.findAll(paginationQuery);
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get a score by ID" })
  @ApiParam({ name: "id", description: "Score ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns the score",
    type: ScoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Score not found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.scoresService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Update a score" })
  @ApiParam({ name: "id", description: "Score ID", example: 1, type: Number })
  @ApiBody({ type: UpdateScoreDto })
  @ApiResponse({
    status: 200,
    description: "Score updated successfully",
    type: ScoreResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Cannot update score when period window is closed",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Cannot update score created by another user",
  })
  @ApiResponse({ status: 404, description: "Score not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateScoreDto: UpdateScoreDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.scoresService.update(id, updateScoreDto, user.id);
  }
}
