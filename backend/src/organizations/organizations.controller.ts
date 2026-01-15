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
import { OrganizationsService } from "@/organizations/organizations.service";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  PaginatedOrganizationsResponseDto,
} from "@/organizations/dto";
import { PaginationQueryDto } from "@/common/dto";
import { Role } from "@/users/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";

@ApiTags("organizations")
@Controller("organizations")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new organization" })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: 201,
    description: "Organization created successfully",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Supervisor not found" })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get all organizations (paginated and searchable)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by organization name (case-insensitive)",
    example: "engineering",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of organizations",
    type: PaginatedOrganizationsResponseDto,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrganizationsResponseDto> {
    return this.organizationsService.findAll(paginationQuery);
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get an organization by ID" })
  @ApiParam({
    name: "id",
    description: "Organization ID",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Returns the organization",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Organization not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Update an organization" })
  @ApiParam({
    name: "id",
    description: "Organization ID",
    example: 1,
    type: Number,
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: "Organization updated successfully",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Organization not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Delete an organization" })
  @ApiParam({
    name: "id",
    description: "Organization ID",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: "Organization deleted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Cannot delete organization (has members)",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Organization not found" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
