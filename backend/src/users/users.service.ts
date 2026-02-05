import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
  EmployeeStatisticsDto,
  UserPaginationQueryDto,
} from "@/users/dto";
import { StorageService, StorageFile } from "@/storage/storage.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const AVATAR_FOLDER = "user-avatar";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Validate organizationId exists if provided
    if (createUserDto.organizationId) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: createUserDto.organizationId },
      });
      if (!organization) {
        throw new BadRequestException(
          `Organization with ID ${createUserDto.organizationId} not found`,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        position: createUserDto.position,
        role: createUserDto.role,
        employmentType: createUserDto.employmentType,
        taxNumber: createUserDto.taxNumber,
        identityNumber: createUserDto.identityNumber,
        startDate: createUserDto.startDate
          ? new Date(createUserDto.startDate)
          : null,
        leaveDate: createUserDto.leaveDate
          ? new Date(createUserDto.leaveDate)
          : null,
        location: createUserDto.location,
        bankNumber: createUserDto.bankNumber,
        bankName: createUserDto.bankName,
        bankAccountHolderName: createUserDto.bankAccountHolderName,
        photoUrl: createUserDto.photoUrl,
        extraPaidLeaveDays: createUserDto.extraPaidLeaveDays ?? null,
        organizationId: createUserDto.organizationId,
        nickname: createUserDto.nickname,
        gender: createUserDto.gender,
        dateOfBirth: createUserDto.dateOfBirth
          ? new Date(createUserDto.dateOfBirth)
          : null,
        typeOfWork: createUserDto.typeOfWork,
        workStatus: createUserDto.workStatus,
        division: createUserDto.division,
        level: createUserDto.level,
      },
      include: {
        organization: true,
      },
    });

    return user as UserResponseDto;
  }

  async findAll(
    paginationQuery: UserPaginationQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (paginationQuery.search) {
      where.fullName = {
        contains: paginationQuery.search,
        mode: "insensitive",
      };
    }

    if (paginationQuery.employmentType) {
      where.employmentType = paginationQuery.employmentType;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          position: true,
          role: true,
          employmentType: true,
          taxNumber: true,
          identityNumber: true,
          startDate: true,
          leaveDate: true,
          location: true,
          bankNumber: true,
          bankName: true,
          bankAccountHolderName: true,
          photoUrl: true,
          extraPaidLeaveDays: true,
          organizationId: true,
          organization: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          nickname: true,
          gender: true,
          dateOfBirth: true,
          typeOfWork: true,
          workStatus: true,
          division: true,
          level: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users as UserResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getStatistics(): Promise<EmployeeStatisticsDto> {
    const [total, permanent, temporary, former, organizationCounts] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { employmentType: "PERMANENT" } }),
        this.prisma.user.count({ where: { employmentType: "TEMPORARY" } }),
        this.prisma.user.count({ where: { employmentType: "FORMER" } }),
        this.prisma.organization.findMany({
          select: {
            name: true,
            _count: {
              select: { members: true },
            },
          },
        }),
      ]);

    const byOrganization = organizationCounts.map((org) => ({
      name: org.name,
      count: org._count.members,
    }));

    return {
      total,
      permanent,
      temporary,
      former,
      byOrganization,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user as UserResponseDto;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate organizationId exists if provided
    if (updateUserDto.organizationId !== undefined) {
      if (updateUserDto.organizationId !== null) {
        const organization = await this.prisma.organization.findUnique({
          where: { id: updateUserDto.organizationId },
        });
        if (!organization) {
          throw new BadRequestException(
            `Organization with ID ${updateUserDto.organizationId} not found`,
          );
        }
      }
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      fullName: updateUserDto.fullName,
      email: updateUserDto.email,
      phoneNumber: updateUserDto.phoneNumber,
      position: updateUserDto.position,
      role: updateUserDto.role,
      employmentType: updateUserDto.employmentType,
      taxNumber: updateUserDto.taxNumber,
      identityNumber: updateUserDto.identityNumber,
      startDate: updateUserDto.startDate
        ? new Date(updateUserDto.startDate)
        : undefined,
      leaveDate: updateUserDto.leaveDate
        ? new Date(updateUserDto.leaveDate)
        : undefined,
      location: updateUserDto.location,
      bankNumber: updateUserDto.bankNumber,
      bankName: updateUserDto.bankName,
      bankAccountHolderName: updateUserDto.bankAccountHolderName,
      photoUrl: updateUserDto.photoUrl,
      extraPaidLeaveDays: updateUserDto.extraPaidLeaveDays,
      nickname: updateUserDto.nickname,
      gender: updateUserDto.gender,
      dateOfBirth: updateUserDto.dateOfBirth
        ? new Date(updateUserDto.dateOfBirth)
        : undefined,
      typeOfWork: updateUserDto.typeOfWork,
      workStatus: updateUserDto.workStatus,
      division: updateUserDto.division,
      level: updateUserDto.level,
    };

    // Handle organization relation
    if (updateUserDto.organizationId !== undefined) {
      if (updateUserDto.organizationId === null) {
        updateData.organization = { disconnect: true };
      } else {
        updateData.organization = {
          connect: { id: updateUserDto.organizationId },
        };
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
      },
    });

    return user as UserResponseDto;
  }

  async remove(id: number): Promise<void> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        supervisedOrganizations: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent deletion if user supervises any organizations
    if (user.supervisedOrganizations.length > 0) {
      throw new BadRequestException(
        `Cannot delete user with ID ${id} because they supervise one or more organizations`,
      );
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  // ============ Avatar Methods ============

  /**
   * Upload avatar for a user
   * @param userId The user ID
   * @param file The uploaded file
   */
  async uploadAvatar(
    userId: number,
    file: StorageFile,
  ): Promise<{ photoUrl: string }> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete old avatar if exists
    if (user.photoUrl) {
      try {
        await this.storageService.deleteFile(user.photoUrl);
      } catch {
        // Ignore deletion errors for old file
      }
    }

    // Upload new avatar with UUID filename to avoid collisions
    const filename = randomUUID();
    const result = await this.storageService.uploadFile(
      file,
      AVATAR_FOLDER,
      filename,
    );

    // Update user photoUrl with the storage key
    await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: result.key },
    });

    return { photoUrl: result.key };
  }

  /**
   * Get avatar URL for a user (presigned URL for GCS, API path for local)
   * @param userId The user ID
   */
  async getAvatarUrl(userId: number): Promise<{ url: string | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.photoUrl) {
      return { url: null };
    }

    const url = await this.storageService.getFileUrl(user.photoUrl);
    return { url };
  }

  /**
   * Get avatar file buffer (for serving local files)
   * @param key The file storage key
   */
  async getAvatarFile(key: string): Promise<Buffer> {
    const exists = await this.storageService.fileExists(key);
    if (!exists) {
      throw new NotFoundException("Avatar file not found");
    }
    return this.storageService.getFileBuffer(key);
  }

  /**
   * Delete avatar for a user
   * @param userId The user ID
   */
  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.photoUrl) {
      await this.storageService.deleteFile(user.photoUrl);
      await this.prisma.user.update({
        where: { id: userId },
        data: { photoUrl: null },
      });
    }
  }
}
