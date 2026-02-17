import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreatePeriodDto } from "@/kpi/dto";
import { PaginationQueryDto, PaginatedResponseDto } from "@/common/dto";
import { KpiPeriod, Prisma } from "@prisma/client";

@Injectable()
export class PeriodsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPeriodDto: CreatePeriodDto,
    organizationId: number,
  ): Promise<KpiPeriod> {
    if (!organizationId) {
      throw new BadRequestException("Organization ID is required");
    }

    const startDate = new Date(createPeriodDto.startDate);
    const endDate = new Date(createPeriodDto.endDate);

    // Check for overlapping periods within the same organization
    const overlappingPeriod = await this.prisma.kpiPeriod.findFirst({
      where: {
        organizationId,
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    if (overlappingPeriod) {
      throw new BadRequestException(
        "Period dates overlap with an existing period",
      );
    }

    const period = await this.prisma.kpiPeriod.create({
      data: {
        name: createPeriodDto.name,
        startDate,
        endDate,
        organizationId,
      },
    });

    return period;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    organizationId?: number,
  ): Promise<PaginatedResponseDto<KpiPeriod>> {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiPeriodWhereInput = {
      ...(organizationId !== undefined && { organizationId }),
      ...(paginationQuery.search && {
        name: {
          contains: paginationQuery.search,
          mode: "insensitive",
        },
      }),
    };

    const [periods, total] = await Promise.all([
      this.prisma.kpiPeriod.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
      }),
      this.prisma.kpiPeriod.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: periods,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number, organizationId?: number): Promise<KpiPeriod> {
    const period = await this.prisma.kpiPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      period.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }

    return period;
  }

  async findCurrent(organizationId?: number): Promise<KpiPeriod | null> {
    const now = new Date();
    const where: Prisma.KpiPeriodWhereInput = {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      ...(organizationId !== undefined && { organizationId }),
    };

    const period = await this.prisma.kpiPeriod.findFirst({
      where,
      orderBy: { startDate: "desc" },
    });

    return period;
  }

  /**
   * Calculates the scoring window for a period.
   * Scoring window runs from the 1st of the period's month to the 15th of the next month.
   * @param period The period to calculate the scoring window for
   * @returns Object with scoringWindowStart and scoringWindowEnd dates
   */
  getScoringWindow(period: KpiPeriod): {
    scoringWindowStart: Date;
    scoringWindowEnd: Date;
  } {
    const periodDate = new Date(period.startDate);
    const year = periodDate.getFullYear();
    const month = periodDate.getMonth(); // 0-indexed (0 = January, 11 = December)

    // Scoring window starts on the 1st of the period's month
    const scoringWindowStart = new Date(year, month, 1, 0, 0, 0, 0);

    // Scoring window ends on the 15th of the next month at 23:59:59.999
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const scoringWindowEnd = new Date(nextYear, nextMonth, 15, 23, 59, 59, 999);

    return { scoringWindowStart, scoringWindowEnd };
  }

  /**
   * Checks if the scoring window is currently open for a period.
   * @param period The period to check
   * @returns true if the scoring window is open, false otherwise
   */
  isScoringWindowOpen(period: KpiPeriod): boolean {
    const { scoringWindowStart, scoringWindowEnd } =
      this.getScoringWindow(period);
    const now = new Date();
    return now >= scoringWindowStart && now <= scoringWindowEnd;
  }

  async update(
    id: number,
    updatePeriodDto: Partial<CreatePeriodDto>,
    organizationId?: number,
  ): Promise<KpiPeriod> {
    const existingPeriod = await this.prisma.kpiPeriod.findUnique({
      where: { id },
      include: {
        scores: {
          take: 1,
        },
      },
    });

    if (!existingPeriod) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      existingPeriod.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Period with ID ${id} not found`);
    }

    if (existingPeriod.scores.length > 0) {
      throw new BadRequestException(
        "Cannot update period that already has scores",
      );
    }

    const updateData: Prisma.KpiPeriodUpdateInput = {};
    if (updatePeriodDto.name) updateData.name = updatePeriodDto.name;
    if (updatePeriodDto.startDate)
      updateData.startDate = new Date(updatePeriodDto.startDate);
    if (updatePeriodDto.endDate)
      updateData.endDate = new Date(updatePeriodDto.endDate);

    const period = await this.prisma.kpiPeriod.update({
      where: { id },
      data: updateData,
    });

    return period;
  }
}
