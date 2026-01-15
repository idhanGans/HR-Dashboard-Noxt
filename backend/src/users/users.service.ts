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
} from "@/users/dto";
import { PaginationQueryDto } from "@/common/dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

    const user = await this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
        phoneNumber: createUserDto.phoneNumber,
        roleName: createUserDto.roleName,
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
        organizationId: createUserDto.organizationId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleName: true,
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
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return user as UserResponseDto;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = paginationQuery.search
      ? {
          fullName: {
            contains: paginationQuery.search,
            mode: "insensitive",
          },
        }
      : {};

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
          roleName: true,
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
          organizationId: true,
          organization: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          },
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

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleName: true,
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
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
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

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: updateUserDto.fullName,
        email: updateUserDto.email,
        password: updateUserDto.password,
        phoneNumber: updateUserDto.phoneNumber,
        roleName: updateUserDto.roleName,
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
        organizationId: updateUserDto.organizationId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleName: true,
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
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
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
}
