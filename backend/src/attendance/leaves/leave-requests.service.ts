import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateLeaveRequestDto,
  LeaveRequestResponseDto,
  LeaveRequestsQueryDto,
  LeaveStatus,
  PaginatedLeaveRequestsResponseDto,
} from "@/attendance/dto";
import { Prisma, Role as PrismaRole } from "@prisma/client";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { Role } from "@/users/dto";

@Injectable()
export class LeaveRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    dto: CreateLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException("End date must be after start date");
    }

    const overlapping = await this.prisma.leaveRequest.findFirst({
      where: {
        userId,
        status: {
          in: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
        },
        AND: [
          {
            startDate: {
              lte: endDate,
            },
          },
          {
            endDate: {
              gte: startDate,
            },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        "Leave request overlaps with an existing request",
      );
    }

    const leave = await this.prisma.leaveRequest.create({
      data: {
        userId,
        type: dto.type,
        reason: dto.reason,
        startDate,
        endDate,
        status: LeaveStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return leave as LeaveRequestResponseDto;
  }

  async findAll(
    query: LeaveRequestsQueryDto,
  ): Promise<PaginatedLeaveRequestsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LeaveRequestWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const dateRange = this.buildDateRangeFilter(query.startDate, query.endDate);
    if (dateRange) {
      where.startDate = dateRange;
    }

    const [requests, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: requests as LeaveRequestResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findMine(
    userId: number,
    query: LeaveRequestsQueryDto,
  ): Promise<PaginatedLeaveRequestsResponseDto> {
    return this.findAll({
      ...query,
      userId,
    });
  }

  async approve(
    id: number,
    reviewer: UserPayload,
  ): Promise<LeaveRequestResponseDto> {
    return this.updateStatus(id, reviewer, LeaveStatus.APPROVED);
  }

  async reject(
    id: number,
    reviewer: UserPayload,
  ): Promise<LeaveRequestResponseDto> {
    return this.updateStatus(id, reviewer, LeaveStatus.REJECTED);
  }

  private async updateStatus(
    id: number,
    reviewer: UserPayload,
    status: LeaveStatus,
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            organizationId: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new BadRequestException("Leave request is not pending");
    }

    await this.assertReviewerPermissions(reviewer, request.user);

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewedById: reviewer.id,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return updated as LeaveRequestResponseDto;
  }

  private async assertReviewerPermissions(
    reviewer: UserPayload,
    requestUser: {
      id: number;
      role: PrismaRole;
      organizationId?: number | null;
    },
  ): Promise<void> {
    if (reviewer.role === Role.SUPERADMIN) {
      return;
    }

    if (reviewer.role !== Role.SUPERVISOR) {
      throw new ForbiddenException("Insufficient permissions to review leaves");
    }

    if (requestUser.role !== PrismaRole.EMPLOYEE) {
      throw new ForbiddenException("Superadmin must review supervisor leaves");
    }

    if (!requestUser.organizationId) {
      throw new ForbiddenException("Leave requester has no organization");
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: requestUser.organizationId },
      select: { supervisorId: true },
    });

    if (!organization || organization.supervisorId !== reviewer.id) {
      throw new ForbiddenException("You are not the supervisor for this user");
    }
  }

  private buildDateRangeFilter(
    startDate?: string,
    endDate?: string,
  ): Prisma.DateTimeFilter | undefined {
    if (!startDate && !endDate) {
      return undefined;
    }

    const range: Prisma.DateTimeFilter = {};
    if (startDate) {
      range.gte = new Date(startDate);
    }

    if (endDate) {
      range.lte = new Date(endDate);
    }

    return range;
  }
}
