import { BadRequestException, Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { PrismaService } from "@/prisma/prisma.service";
import {
  AttendanceRecordResponseDto,
  AttendanceRecordsQueryDto,
  PaginatedAttendanceRecordsResponseDto,
} from "@/attendance/dto";
import {
  AttendanceCheckoutSource,
  AttendanceStatus,
  EmploymentType,
  Prisma,
  Role,
} from "@prisma/client";
import {
  buildDateRangeFilter,
  buildMonthFilter,
} from "@/common/utils/date-filters";
import { LoggerService } from "@/common/logging";

@Injectable()
export class AttendanceRecordsService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {
    this.logger.setContext("AttendanceRecordsService");
  }

  async checkIn(
    userId: number,
    timezone?: string,
  ): Promise<AttendanceRecordResponseDto> {
    const now = new Date();
    const zone = this.normalizeTimezone(timezone);
    const { startOfDay, endOfDay } = this.getDayBounds(now, zone);

    const existingOpen = await this.prisma.attendanceRecord.findFirst({
      where: {
        userId,
        checkOutAt: null,
      },
    });

    if (existingOpen) {
      throw new BadRequestException(
        "You already have an open attendance record",
      );
    }

    const existingToday = await this.prisma.attendanceRecord.findFirst({
      where: {
        userId,
        checkInAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingToday) {
      throw new BadRequestException("Attendance already recorded for today");
    }

    const status = this.getCheckInStatus(now, zone);
    const record = await this.prisma.attendanceRecord.create({
      data: {
        userId,
        checkInAt: now,
        status,
        timezone: zone,
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

    return record as AttendanceRecordResponseDto;
  }

  async checkOut(userId: number): Promise<AttendanceRecordResponseDto> {
    const openRecord = await this.prisma.attendanceRecord.findFirst({
      where: {
        userId,
        checkOutAt: null,
      },
      orderBy: {
        checkInAt: "desc",
      },
    });

    if (!openRecord) {
      throw new BadRequestException("No open attendance record to check out");
    }

    const record = await this.prisma.attendanceRecord.update({
      where: { id: openRecord.id },
      data: {
        checkOutAt: new Date(),
        checkOutSource: AttendanceCheckoutSource.MANUAL,
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

    return record as AttendanceRecordResponseDto;
  }

  async findAll(
    query: AttendanceRecordsQueryDto,
    userId?: number,
  ): Promise<PaginatedAttendanceRecordsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceRecordWhereInput = {};

    // User filter (from param or query)
    if (userId) {
      where.userId = userId;
    } else if (query.userId) {
      where.userId = query.userId;
    }

    // Status filter
    if (query.status) {
      where.status = query.status;
    }

    // Date filter: month/year takes precedence over startDate/endDate
    if (query.month && query.year) {
      where.checkInAt = buildMonthFilter(query.month, query.year);
    } else {
      const checkInRange = buildDateRangeFilter(query.startDate, query.endDate);
      if (checkInRange) {
        where.checkInAt = checkInRange;
      }
    }

    const [records, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          checkInAt: "desc",
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
      }),
      this.prisma.attendanceRecord.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: records as AttendanceRecordResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findMine(
    userId: number,
    query: AttendanceRecordsQueryDto,
  ): Promise<PaginatedAttendanceRecordsResponseDto> {
    return this.findAll(query, userId);
  }

  async autoCheckoutOpenRecords(): Promise<number> {
    const now = new Date();
    const openRecords = await this.prisma.attendanceRecord.findMany({
      where: {
        checkOutAt: null,
      },
      select: {
        id: true,
        checkInAt: true,
        timezone: true,
      },
    });

    // Group records by their end-of-day time to batch updates
    const recordsByEndTime = new Map<
      string,
      { ids: number[]; endOfDay: Date }
    >();

    for (const record of openRecords) {
      const zone = this.normalizeTimezone(record.timezone);
      const endOfDay = this.getEndOfDayUtc(record.checkInAt, zone);

      if (now >= endOfDay) {
        const key = endOfDay.toISOString();
        const existing = recordsByEndTime.get(key);
        if (existing) {
          existing.ids.push(record.id);
        } else {
          recordsByEndTime.set(key, { ids: [record.id], endOfDay });
        }
      }
    }

    // Count total records to be updated
    const totalRecords = Array.from(recordsByEndTime.values()).reduce(
      (sum, { ids }) => sum + ids.length,
      0,
    );

    // Batch update all records with the same end-of-day time
    const updates = Array.from(recordsByEndTime.values()).map(
      ({ ids, endOfDay }) =>
        this.prisma.attendanceRecord.updateMany({
          where: { id: { in: ids } },
          data: {
            checkOutAt: endOfDay,
            checkOutSource: AttendanceCheckoutSource.AUTO,
          },
        }),
    );

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    if (totalRecords > 0) {
      this.logger.logEvent("auto_checkout", `Auto checkout completed`, {
        records_processed: totalRecords,
        open_records_found: openRecords.length,
      });
    }

    return totalRecords;
  }

  async markAbsentRecords(): Promise<number> {
    const zone = this.normalizeTimezone(DateTime.local().zoneName);
    const targetDate = DateTime.local().minus({ days: 1 }).toJSDate();
    const { startOfDay, endOfDay } = this.getDayBounds(targetDate, zone);

    const users = await this.prisma.user.findMany({
      where: {
        role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
        employmentType: { not: EmploymentType.FORMER },
      },
      select: { id: true },
    });

    if (!users.length) {
      this.logger.logEvent("mark_absent", "No users found for absent marking", {
        records_processed: 0,
        target_date: targetDate.toISOString(),
      });
      return 0;
    }

    const userIds = users.map((user) => user.id);
    const existing = await this.prisma.attendanceRecord.findMany({
      where: {
        userId: { in: userIds },
        checkInAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { userId: true },
    });

    const existingUserIds = new Set(existing.map((record) => record.userId));
    const absentUserIds = userIds.filter((id) => !existingUserIds.has(id));

    if (!absentUserIds.length) {
      this.logger.logEvent("mark_absent", "No absent records to create", {
        records_processed: 0,
        total_users: users.length,
        users_with_attendance: existing.length,
        target_date: targetDate.toISOString(),
      });
      return 0;
    }

    await this.prisma.attendanceRecord.createMany({
      data: absentUserIds.map((userId) => ({
        userId,
        checkInAt: startOfDay,
        checkOutAt: endOfDay,
        checkOutSource: AttendanceCheckoutSource.AUTO,
        status: AttendanceStatus.ABSENT,
        timezone: zone,
      })),
    });

    this.logger.logEvent("mark_absent", `Marked absent records`, {
      records_processed: absentUserIds.length,
      total_users: users.length,
      users_with_attendance: existing.length,
      target_date: targetDate.toISOString(),
    });

    return absentUserIds.length;
  }

  private getDayBounds(
    date: Date,
    timezone: string,
  ): { startOfDay: Date; endOfDay: Date } {
    const zoned = DateTime.fromJSDate(date, { zone: timezone });
    const startLocal = zoned.startOf("day");
    const endLocal = zoned.endOf("day");

    return {
      startOfDay: startLocal.toUTC().toJSDate(),
      endOfDay: endLocal.toUTC().toJSDate(),
    };
  }

  private getEndOfDayUtc(date: Date, timezone: string): Date {
    return this.getDayBounds(date, timezone).endOfDay;
  }

  private normalizeTimezone(timezone?: string | null): string {
    if (!timezone) {
      return "UTC";
    }

    const candidate = DateTime.now().setZone(timezone);
    return candidate.isValid ? timezone : "UTC";
  }

  private getCheckInStatus(date: Date, timezone: string): AttendanceStatus {
    const local = DateTime.fromJSDate(date, { zone: timezone });
    //TODO: Temporary logic, needs to make sure what "LATE" means
    const isLate = local.hour > 10 || (local.hour === 10 && local.minute > 0);
    return isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
  }
}
