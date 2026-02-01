import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateLeaveRequestDto,
  LeaveBalanceDto,
  LeaveEntitlementDto,
  LeaveRequestResponseDto,
  LeaveRequestsQueryDto,
  UpdateLeaveEntitlementsDto,
  PaginatedLeaveRequestsResponseDto,
} from "@/attendance/dto";
import { LeaveStatus, LeaveType, Prisma } from "@prisma/client";
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

    return this.mapLeaveRequest(leave);
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
      data: requests.map((request) => this.mapLeaveRequest(request)),
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

    this.assertReviewerPermissions(reviewer);

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

    return this.mapLeaveRequest(updated);
  }

  async getLeaveBalances(userId: number): Promise<LeaveBalanceDto[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        startDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const entitlementYears = this.getEntitlementYears(
      user.startDate ?? user.createdAt,
    );

    const entitlements = await this.prisma.leaveEntitlement.findMany({
      select: {
        type: true,
        entitledDays: true,
      },
    });

    const entitledPerYearByType = entitlements.reduce<
      Record<LeaveType, number>
    >(
      (acc, entitlement) => {
        acc[entitlement.type] = entitlement.entitledDays;
        return acc;
      },
      {
        [LeaveType.PAID_LEAVE]: 0,
        [LeaveType.UNPAID_LEAVE]: 0,
        [LeaveType.SICK_LEAVE]: 0,
        [LeaveType.URGENT_LEAVE]: 0,
      },
    );

    const approvedLeaves = await this.prisma.leaveRequest.findMany({
      where: {
        userId,
        status: LeaveStatus.APPROVED,
        startDate: {
          gte: user.startDate ?? user.createdAt,
        },
      },
      select: {
        type: true,
        startDate: true,
        endDate: true,
      },
    });

    const usedByType = approvedLeaves.reduce<Record<LeaveType, number>>(
      (acc, leave) => {
        const days = this.calculateLeaveDays(leave.startDate, leave.endDate);
        acc[leave.type] = (acc[leave.type] ?? 0) + days;
        return acc;
      },
      {
        [LeaveType.PAID_LEAVE]: 0,
        [LeaveType.UNPAID_LEAVE]: 0,
        [LeaveType.SICK_LEAVE]: 0,
        [LeaveType.URGENT_LEAVE]: 0,
      },
    );

    return (Object.values(LeaveType) as LeaveType[]).map((type) => {
      const entitledDays =
        (entitledPerYearByType[type] ?? 0) * entitlementYears;
      const usedDays = usedByType[type] ?? 0;
      const remainingDays = Math.max(entitledDays - usedDays, 0);
      return {
        type,
        entitledDays,
        usedDays,
        remainingDays,
      };
    });
  }

  async updateEntitlements(
    dto: UpdateLeaveEntitlementsDto,
  ): Promise<LeaveEntitlementDto[]> {
    if (dto.entitlements.length === 0) {
      return [];
    }

    await this.prisma.$transaction(
      dto.entitlements.map((entitlement) =>
        this.prisma.leaveEntitlement.upsert({
          where: {
            type: entitlement.type,
          },
          update: {
            entitledDays: entitlement.entitledDays,
          },
          create: {
            type: entitlement.type,
            entitledDays: entitlement.entitledDays,
          },
        }),
      ),
    );

    const updated = await this.prisma.leaveEntitlement.findMany({
      select: {
        type: true,
        entitledDays: true,
      },
      orderBy: {
        type: "asc",
      },
    });

    return updated.map((entitlement) => ({
      type: entitlement.type,
      entitledDays: entitlement.entitledDays,
    }));
  }

  async getEntitlements(): Promise<LeaveEntitlementDto[]> {
    const entitlements = await this.prisma.leaveEntitlement.findMany({
      select: {
        type: true,
        entitledDays: true,
      },
      orderBy: {
        type: "asc",
      },
    });

    return entitlements.map((entitlement) => ({
      type: entitlement.type,
      entitledDays: entitlement.entitledDays,
    }));
  }

  async findRecentApprovals(limit = 10): Promise<LeaveRequestResponseDto[]> {
    const approvals = await this.prisma.leaveRequest.findMany({
      where: {
        status: LeaveStatus.APPROVED,
      },
      orderBy: {
        reviewedAt: "desc",
      },
      take: limit,
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

    return approvals.map((approval) => this.mapLeaveRequest(approval));
  }

  private assertReviewerPermissions(reviewer: UserPayload): void {
    if (reviewer.role !== Role.SUPERADMIN) {
      throw new ForbiddenException("Only superadmin can review leave requests");
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

  private mapLeaveRequest(
    request: Omit<LeaveRequestResponseDto, "days">,
  ): LeaveRequestResponseDto {
    return {
      ...request,
      days: this.calculateLeaveDays(request.startDate, request.endDate),
    };
  }

  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    const start = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
      ),
    );
    const end = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
      ),
    );

    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
  }

  private getEntitlementYears(startDate: Date): number {
    const startYear = startDate.getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();
    return Math.max(currentYear - startYear + 1, 1);
  }
}
