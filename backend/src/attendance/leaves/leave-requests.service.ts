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
  LeaveRequestResponseDto,
  LeaveRequestsQueryDto,
  PaginatedLeaveRequestsResponseDto,
} from "@/attendance/dto";
import { LeaveStatus, LeaveType, Prisma, PrismaClient } from "@prisma/client";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { Role } from "@/users/dto";
import { buildDateRangeFilter } from "@/common/utils/date-filters";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

const PAID_LEAVE_DAYS_PER_MONTH = 1;

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

    const leave = await this.prisma.$transaction(async (tx) => {
      const overlapping = await tx.leaveRequest.findFirst({
        where: {
          userId,
          status: {
            in: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
          },
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } },
          ],
        },
      });

      if (overlapping) {
        throw new BadRequestException(
          "Leave request overlaps with an existing request",
        );
      }

      // Check paid leave balance within transaction
      if (dto.type === LeaveType.PAID_LEAVE) {
        const daysRequested = this.calculateLeaveDays(startDate, endDate);
        const remainingPaid = await this.getPaidLeaveRemainingTx(tx, userId);
        if (daysRequested > remainingPaid) {
          throw new BadRequestException(
            `Insufficient paid leave balance. You have ${remainingPaid} days available but need ${daysRequested} days.`,
          );
        }
      }

      return tx.leaveRequest.create({
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

    const dateRange = buildDateRangeFilter(query.startDate, query.endDate);
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
    const { entitlementStart, entitlementMonths, extraPaidLeaveDays } =
      await this.getEntitlementContext(userId);

    const usedByType = await this.getApprovedLeaveUsageByType(
      userId,
      entitlementStart,
    );

    const paidEntitledDays = this.roundToTwoDecimals(
      entitlementMonths * PAID_LEAVE_DAYS_PER_MONTH + extraPaidLeaveDays,
    );
    const usedPaidDays = usedByType[LeaveType.PAID_LEAVE] ?? 0;
    const remainingPaidDays = this.roundToTwoDecimals(
      Math.max(paidEntitledDays - usedPaidDays, 0),
    );

    return (Object.values(LeaveType) as LeaveType[]).map((type) => {
      if (type === LeaveType.PAID_LEAVE) {
        return {
          type,
          entitledDays: paidEntitledDays,
          usedDays: usedPaidDays,
          remainingDays: remainingPaidDays,
          isUnlimited: false,
        };
      }

      return {
        type,
        entitledDays: 0,
        usedDays: usedByType[type] ?? 0,
        remainingDays: 0,
        isUnlimited: true,
      };
    });
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

  private async getEntitlementContext(userId: number): Promise<{
    entitlementStart: Date;
    entitlementMonths: number;
    extraPaidLeaveDays: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        startDate: true,
        createdAt: true,
        extraPaidLeaveDays: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const entitlementStart = user.startDate ?? user.createdAt;
    const entitlementMonths = this.getEntitlementMonths(entitlementStart);

    return {
      entitlementStart,
      entitlementMonths,
      extraPaidLeaveDays: user.extraPaidLeaveDays ?? 0,
    };
  }

  private async getApprovedLeaveUsageByType(
    userId: number,
    entitlementStart: Date,
  ): Promise<Record<LeaveType, number>> {
    const approvedLeaves = await this.prisma.leaveRequest.findMany({
      where: {
        userId,
        status: LeaveStatus.APPROVED,
        startDate: {
          gte: entitlementStart,
        },
      },
      select: {
        type: true,
        startDate: true,
        endDate: true,
      },
    });

    return approvedLeaves.reduce<Record<LeaveType, number>>(
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
  }

  private async getPaidLeaveRemaining(userId: number): Promise<number> {
    const { entitlementStart, entitlementMonths, extraPaidLeaveDays } =
      await this.getEntitlementContext(userId);
    const usedByType = await this.getApprovedLeaveUsageByType(
      userId,
      entitlementStart,
    );
    const entitledDays = this.roundToTwoDecimals(
      entitlementMonths * PAID_LEAVE_DAYS_PER_MONTH + extraPaidLeaveDays,
    );
    const usedPaidDays = usedByType[LeaveType.PAID_LEAVE] ?? 0;
    return this.roundToTwoDecimals(Math.max(entitledDays - usedPaidDays, 0));
  }

  private async getPaidLeaveRemainingTx(
    tx: TransactionClient,
    userId: number,
  ): Promise<number> {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        startDate: true,
        createdAt: true,
        extraPaidLeaveDays: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const entitlementStart = user.startDate ?? user.createdAt;
    const entitlementMonths = this.getEntitlementMonths(entitlementStart);
    const extraPaidLeaveDays = user.extraPaidLeaveDays ?? 0;

    const approvedLeaves = await tx.leaveRequest.findMany({
      where: {
        userId,
        status: LeaveStatus.APPROVED,
        type: LeaveType.PAID_LEAVE,
        startDate: { gte: entitlementStart },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const usedPaidDays = approvedLeaves.reduce((sum, leave) => {
      return sum + this.calculateLeaveDays(leave.startDate, leave.endDate);
    }, 0);

    const entitledDays = this.roundToTwoDecimals(
      entitlementMonths * PAID_LEAVE_DAYS_PER_MONTH + extraPaidLeaveDays,
    );

    return this.roundToTwoDecimals(Math.max(entitledDays - usedPaidDays, 0));
  }

  private getEntitlementMonths(startDate: Date, now = new Date()): number {
    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const months =
      (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1;

    return Math.max(months, 0);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
