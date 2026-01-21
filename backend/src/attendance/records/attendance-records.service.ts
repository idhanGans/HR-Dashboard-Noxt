import { BadRequestException, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { DateTime } from "luxon";
import { PrismaService } from "@/prisma/prisma.service";
import {
  AttendanceRecordResponseDto,
  AttendanceRecordsQueryDto,
  PaginatedAttendanceRecordsResponseDto,
} from "@/attendance/dto";
import { AttendanceCheckoutSource, Prisma } from "@prisma/client";

@Injectable()
export class AttendanceRecordsService {
  constructor(private prisma: PrismaService) {}

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
      throw new BadRequestException("You already have an open attendance record");
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

    const record = await this.prisma.attendanceRecord.create({
      data: {
        userId,
        checkInAt: now,
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
    if (userId) {
      where.userId = userId;
    }
    const checkInRange = this.buildDateRangeFilter(
      query.startDate,
      query.endDate,
    );

    if (checkInRange) {
      where.checkInAt = checkInRange;
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

  @Cron("0 */15 * * * *")
  async autoCheckoutOpenRecords(): Promise<void> {
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

    for (const record of openRecords) {
      const zone = this.normalizeTimezone(record.timezone);
      const endOfDay = this.getEndOfDayUtc(record.checkInAt, zone);

      if (now >= endOfDay) {
        await this.prisma.attendanceRecord.update({
          where: { id: record.id },
          data: {
            checkOutAt: endOfDay,
            checkOutSource: AttendanceCheckoutSource.AUTO,
          },
        });
      }
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
}
