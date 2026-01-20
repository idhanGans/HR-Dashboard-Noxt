import { BadRequestException, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "@/prisma/prisma.service";
import {
  AttendanceCheckoutSource,
  AttendanceRecordResponseDto,
  AttendanceRecordsQueryDto,
  PaginatedAttendanceRecordsResponseDto,
} from "@/attendance/dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class AttendanceRecordsService {
  constructor(private prisma: PrismaService) {}

  async checkIn(userId: number): Promise<AttendanceRecordResponseDto> {
    const now = new Date();
    const { startOfDay, endOfDay } = this.getDayBounds(now);

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
  ): Promise<PaginatedAttendanceRecordsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceRecordWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
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
    return this.findAll({
      ...query,
      userId,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoCheckoutOpenRecords(): Promise<void> {
    const now = new Date();
    const { startOfDay } = this.getDayBounds(now);

    await this.prisma.attendanceRecord.updateMany({
      where: {
        checkOutAt: null,
        checkInAt: {
          lt: startOfDay,
        },
      },
      data: {
        checkOutAt: startOfDay,
        checkOutSource: AttendanceCheckoutSource.AUTO,
      },
    });
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

  private getDayBounds(date: Date): { startOfDay: Date; endOfDay: Date } {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }
}
