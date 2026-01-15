import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  PaginatedOrganizationsResponseDto,
} from "@/organizations/dto";
import { PaginationQueryDto } from "@/common/dto";
import { Role as PrismaRole } from "@prisma/client";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    // Validate supervisorId exists
    const supervisor = await this.prisma.user.findUnique({
      where: { id: createOrganizationDto.supervisorId },
    });

    if (!supervisor) {
      throw new NotFoundException(
        `User with ID ${createOrganizationDto.supervisorId} not found`,
      );
    }

    // Validate supervisor has appropriate role
    if (
      supervisor.role !== PrismaRole.SUPERVISOR &&
      supervisor.role !== PrismaRole.SUPERADMIN
    ) {
      throw new BadRequestException(
        `User with ID ${createOrganizationDto.supervisorId} must have SUPERVISOR or SUPERADMIN role`,
      );
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
        supervisorId: createOrganizationDto.supervisorId,
      },
      select: {
        id: true,
        name: true,
        supervisorId: true,
        supervisor: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        members: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return organization as OrganizationResponseDto;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrganizationsResponseDto> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          supervisorId: true,
          supervisor: {
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
              createdAt: true,
              updatedAt: true,
            },
          },
          members: {
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
              createdAt: true,
              updatedAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.organization.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: organizations as OrganizationResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        supervisorId: true,
        supervisor: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        members: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization as OrganizationResponseDto;
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    // Check if organization exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!existingOrg) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Validate supervisorId exists and has appropriate role if provided
    if (updateOrganizationDto.supervisorId !== undefined) {
      const supervisor = await this.prisma.user.findUnique({
        where: { id: updateOrganizationDto.supervisorId },
      });

      if (!supervisor) {
        throw new NotFoundException(
          `User with ID ${updateOrganizationDto.supervisorId} not found`,
        );
      }

      if (
        supervisor.role !== PrismaRole.SUPERVISOR &&
        supervisor.role !== PrismaRole.SUPERADMIN
      ) {
        throw new BadRequestException(
          `User with ID ${updateOrganizationDto.supervisorId} must have SUPERVISOR or SUPERADMIN role`,
        );
      }
    }

    const organization = await this.prisma.organization.update({
      where: { id },
      data: {
        name: updateOrganizationDto.name,
        supervisorId: updateOrganizationDto.supervisorId,
      },
      select: {
        id: true,
        name: true,
        supervisorId: true,
        supervisor: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        members: {
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
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return organization as OrganizationResponseDto;
  }

  async remove(id: number): Promise<void> {
    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Prevent deletion if organization has members
    if (organization.members.length > 0) {
      throw new BadRequestException(
        `Cannot delete organization with ID ${id} because it has ${organization.members.length} member(s)`,
      );
    }

    await this.prisma.organization.delete({
      where: { id },
    });
  }
}
