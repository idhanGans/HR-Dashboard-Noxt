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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { UsersService } from "@/users/users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
  EmployeeStatisticsDto,
  UserPaginationQueryDto,
  Role,
} from "@/users/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Public } from "@/auth/decorators/public.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import type { UserPayload } from "@/auth/interfaces/user-payload.interface";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

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
  @ApiQuery({
    name: "employmentType",
    required: false,
    enum: ["PERMANENT", "TEMPORARY", "FORMER"],
    description: "Filter by employment type",
    example: "PERMANENT",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of users",
    type: PaginatedUsersResponseDto,
  })
  async findAll(
    @Query() paginationQuery: UserPaginationQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get("statistics")
  @Roles(Role.SUPERVISOR)
  @ApiOperation({ summary: "Get employee statistics" })
  @ApiResponse({
    status: 200,
    description: "Returns employee statistics",
    type: EmployeeStatisticsDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  async getStatistics(): Promise<EmployeeStatisticsDto> {
    return this.usersService.getStatistics();
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

  // ============ Avatar Endpoints ============

  @Post(":id/avatar")
  @Roles(Role.EMPLOYEE)
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: MAX_FILE_SIZE } }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload user avatar" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Avatar image file (JPEG, PNG, GIF, WebP - Max 5MB)",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Avatar uploaded successfully",
    schema: {
      type: "object",
      properties: {
        photoUrl: { type: "string", example: "user-avatar/1-1234567890.jpg" },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid file" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async uploadAvatar(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserPayload,
  ): Promise<{ photoUrl: string }> {
    // Users can only upload their own avatar unless they are SUPERADMIN
    if (currentUser.role !== Role.SUPERADMIN && currentUser.id !== id) {
      throw new BadRequestException("You can only upload your own avatar");
    }

    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
      );
    }

    return this.usersService.uploadAvatar(id, {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
  }

  @Get(":id/avatar")
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Get user avatar URL" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns avatar URL (presigned for GCS, API path for local)",
    schema: {
      type: "object",
      properties: {
        url: { type: "string", nullable: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getAvatarUrl(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ url: string | null }> {
    return this.usersService.getAvatarUrl(id);
  }

  @Delete(":id/avatar")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: "Delete user avatar" })
  @ApiParam({ name: "id", description: "User ID", example: 1, type: Number })
  @ApiResponse({ status: 204, description: "Avatar deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteAvatar(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
  ): Promise<void> {
    // Users can only delete their own avatar unless they are SUPERADMIN
    if (currentUser.role !== Role.SUPERADMIN && currentUser.id !== id) {
      throw new BadRequestException("You can only delete your own avatar");
    }

    return this.usersService.deleteAvatar(id);
  }

  @Get("avatar-file/:folder/:filename")
  @Public()
  @ApiOperation({ summary: "Serve avatar file (local storage only)" })
  @ApiResponse({ status: 200, description: "Returns the image file" })
  @ApiResponse({ status: 404, description: "File not found" })
  async getAvatarFile(
    @Param("folder") folder: string,
    @Param("filename") filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const key = `${folder}/${filename}`;
    const buffer = await this.usersService.getAvatarFile(key);

    // Determine content type from key extension
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };

    res.set({
      "Content-Type": contentTypes[ext || ""] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    });

    return new StreamableFile(buffer);
  }
}
