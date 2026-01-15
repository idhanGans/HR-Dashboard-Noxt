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
import { UsersService } from "@/users/users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
  Role,
} from "@/users/dto";
import { PaginationQueryDto } from "@/common/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get all users (paginated and searchable)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by user full name (case-insensitive)",
    example: "john",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of users",
    type: PaginatedUsersResponseDto,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get(":id")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns the user",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiResponse({
    status: 204,
    description: "User deleted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Cannot delete user (supervises organizations)",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
