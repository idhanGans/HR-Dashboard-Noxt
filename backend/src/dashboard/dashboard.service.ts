import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { PrismaService } from "@/prisma/prisma.service";
import {
  DashboardKpiTrendPointDto,
  DashboardMonthlyAttendanceDto,
  DashboardOverviewResponseDto,
} from "@/dashboard/dto/dashboard.dto";
import { AttendanceStatus, EmploymentType, Role } from "@prisma/client";

const DEFAULT_TIMEZONE = "UTC";
const DEFAULT_MONTHS = 12;
const MAX_MONTHS = 24;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(params: {
    timezone?: string;
    months?: number;
  }): Promise<DashboardOverviewResponseDto> {
    const timezone = this.normalizeTimezone(params.timezone);
    const months = this.normalizeMonths(params.months);

    const [totalEmployees, todayAttendance, kpiPeriod] = await Promise.all([
      this.countActiveEmployees(),
      this.countTodayAttendance(timezone),
      this.findLatestKpiPeriod(),
    ]);

    const [averageKpi, monthlyAttendance, kpiTrend] = await Promise.all([
      this.getAverageKpiForPeriod(kpiPeriod?.id),
      this.getMonthlyAttendance(timezone, months),
      this.getKpiMonthlyTrend(timezone, months),
    ]);

    return {
      totalEmployees,
      todayAttendance,
      averageKpi,
      kpiPeriodId: kpiPeriod?.id,
      kpiPeriodName: kpiPeriod?.name,
      timezone,
      months,
      monthlyAttendance,
      kpiTrend,
    };
  }

  private async countActiveEmployees(): Promise<number> {
    return this.prisma.user.count({
      where: {
        employmentType: { not: EmploymentType.FORMER },
        role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
      },
    });
  }

  private async countTodayAttendance(timezone: string): Promise<number> {
    const now = DateTime.now().setZone(timezone);
    const startOfDay = now.startOf("day").toUTC().toJSDate();
    const endOfDay = now.endOf("day").toUTC().toJSDate();

    return this.prisma.attendanceRecord.count({
      where: {
        checkInAt: { gte: startOfDay, lte: endOfDay },
        status: { in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE] },
        user: {
          employmentType: { not: EmploymentType.FORMER },
          role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
        },
      },
    });
  }

  private async findLatestKpiPeriod(): Promise<{
    id: number;
    name: string;
  } | null> {
    const now = new Date();

    const current = await this.prisma.kpiPeriod.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
      select: { id: true, name: true },
    });
    if (current) return current;

    const latest = await this.prisma.kpiPeriod.findFirst({
      where: {
        startDate: { lte: now },
      },
      orderBy: { startDate: "desc" },
      select: { id: true, name: true },
    });

    return latest ?? null;
  }

  private async getAverageKpiForPeriod(periodId?: number): Promise<number> {
    if (!periodId) return 0;

    const agg = await this.prisma.kpiScore.aggregate({
      where: {
        periodId,
        scoredUser: {
          employmentType: { not: EmploymentType.FORMER },
          role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
        },
      },
      _avg: { score: true },
    });

    const value = agg._avg.score ? Number(agg._avg.score) : 0;
    return Number(value.toFixed(1));
  }

  private async getMonthlyAttendance(
    timezone: string,
    months: number,
  ): Promise<DashboardMonthlyAttendanceDto[]> {
    const now = DateTime.now().setZone(timezone);

    const results: DashboardMonthlyAttendanceDto[] = [];
    for (let offset = months - 1; offset >= 0; offset -= 1) {
      const monthRef = now.minus({ months: offset });
      const startOfMonth = monthRef.startOf("month").toUTC().toJSDate();
      const endOfMonth = monthRef.endOf("month").toUTC().toJSDate();

      const grouped = await this.prisma.attendanceRecord.groupBy({
        by: ["status"],
        where: {
          checkInAt: { gte: startOfMonth, lte: endOfMonth },
          user: {
            employmentType: { not: EmploymentType.FORMER },
            role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
          },
        },
        _count: { _all: true },
      });

      const counts = {
        [AttendanceStatus.PRESENT]: 0,
        [AttendanceStatus.LATE]: 0,
        [AttendanceStatus.ABSENT]: 0,
      };

      grouped.forEach((row) => {
        counts[row.status] = row._count._all;
      });

      results.push({
        month: monthRef.toFormat("MMM yyyy"),
        present: counts[AttendanceStatus.PRESENT],
        late: counts[AttendanceStatus.LATE],
        absent: counts[AttendanceStatus.ABSENT],
      });
    }

    return results;
  }

  private async getKpiMonthlyTrend(
    timezone: string,
    months: number,
  ): Promise<DashboardKpiTrendPointDto[]> {
    const now = DateTime.now().setZone(timezone);
    const oldest = now.minus({ months: months - 1 }).startOf("month");
    const newest = now.endOf("month");

    const periods = await this.prisma.kpiPeriod.findMany({
      where: {
        startDate: {
          gte: oldest.toUTC().toJSDate(),
          lte: newest.toUTC().toJSDate(),
        },
      },
      select: { id: true, startDate: true },
    });

    const periodIdsByMonthKey = new Map<string, number[]>();
    periods.forEach((period) => {
      const key = DateTime.fromJSDate(period.startDate)
        .setZone(timezone)
        .toFormat("yyyy-MM");
      const list = periodIdsByMonthKey.get(key) ?? [];
      list.push(period.id);
      periodIdsByMonthKey.set(key, list);
    });

    const points: DashboardKpiTrendPointDto[] = [];
    for (let offset = months - 1; offset >= 0; offset -= 1) {
      const monthRef = now.minus({ months: offset });
      const key = monthRef.toFormat("yyyy-MM");
      const periodIds = periodIdsByMonthKey.get(key) ?? [];

      if (!periodIds.length) {
        points.push({ month: monthRef.toFormat("MMM yyyy"), value: 0 });
        continue;
      }

      const agg = await this.prisma.kpiScore.aggregate({
        where: {
          periodId: { in: periodIds },
          scoredUser: {
            employmentType: { not: EmploymentType.FORMER },
            role: { in: [Role.EMPLOYEE, Role.SUPERVISOR] },
          },
        },
        _avg: { score: true },
      });

      const value = agg._avg.score ? Number(agg._avg.score) : 0;
      points.push({
        month: monthRef.toFormat("MMM yyyy"),
        value: Number(value.toFixed(1)),
      });
    }

    return points;
  }

  private normalizeTimezone(timezone?: string): string {
    if (!timezone) return DEFAULT_TIMEZONE;
    const candidate = DateTime.now().setZone(timezone);
    return candidate.isValid ? timezone : DEFAULT_TIMEZONE;
  }

  private normalizeMonths(months?: number): number {
    if (!months) return DEFAULT_MONTHS;
    const safe = Math.floor(months);
    if (safe < 1) return 1;
    return Math.min(safe, MAX_MONTHS);
  }
}
