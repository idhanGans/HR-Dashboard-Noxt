import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateTargetDto,
  UpdateTargetDto,
  TargetResponseDto,
  PaginatedTargetsResponseDto,
  MetricResponseDto,
  PeriodResponseDto,
} from "../dto";
import { PaginationQueryDto } from "@/common/dto";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MetricsService } from "../metrics/metrics.service";
import { PeriodsService } from "../periods/periods.service";

@Injectable()
export class TargetsService {
  constructor(
    private prisma: PrismaService,
    private metricsService: MetricsService,
    private periodsService: PeriodsService,
  ) {}

  async create(createTargetDto: CreateTargetDto): Promise<TargetResponseDto> {
    // Validate metric exists and is active
    const metric = await this.metricsService.findOne(createTargetDto.metricId);

    if (!metric.isActive) {
      throw new BadRequestException("Cannot set target for inactive metric");
    }

    // Validate period exists
    await this.periodsService.findOne(createTargetDto.periodId);

    // Check if target already exists
    const existingTarget = await this.prisma.kpiTarget.findUnique({
      where: {
        metricId_periodId: {
          metricId: createTargetDto.metricId,
          periodId: createTargetDto.periodId,
        },
      },
    });

    if (existingTarget) {
      throw new BadRequestException(
        "Target already exists for this metric and period",
      );
    }

    const target = await this.prisma.kpiTarget.create({
      data: {
        metricId: createTargetDto.metricId,
        periodId: createTargetDto.periodId,
        target: new Decimal(createTargetDto.target),
      },
      include: {
        metric: true,
        period: true,
      },
    });

    return {
      ...target,
      target: Number(target.target),
      metric: target.metric as MetricResponseDto,
      period: target.period as PeriodResponseDto,
    } as TargetResponseDto;
  }

  async findAll(
    paginationQuery: PaginationQueryDto & {
      periodId?: number;
      metricId?: number;
    },
  ): Promise<PaginatedTargetsResponseDto> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiTargetWhereInput = {};

    if (paginationQuery.periodId) {
      where.periodId = paginationQuery.periodId;
    }

    if (paginationQuery.metricId) {
      where.metricId = paginationQuery.metricId;
    }

    const [targets, total] = await Promise.all([
      this.prisma.kpiTarget.findMany({
        where,
        skip,
        take: limit,
        include: {
          metric: true,
          period: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.kpiTarget.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: targets.map((t) => ({
        ...t,
        target: Number(t.target),
        metric: t.metric as MetricResponseDto,
        period: t.period as PeriodResponseDto,
      })) as TargetResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<TargetResponseDto> {
    const target = await this.prisma.kpiTarget.findUnique({
      where: { id },
      include: {
        metric: true,
        period: true,
      },
    });

    if (!target) {
      throw new NotFoundException(`Target with ID ${id} not found`);
    }

    return {
      ...target,
      target: Number(target.target),
      metric: target.metric as MetricResponseDto,
      period: target.period as PeriodResponseDto,
    } as TargetResponseDto;
  }

  async update(
    id: number,
    updateTargetDto: UpdateTargetDto,
  ): Promise<TargetResponseDto> {
    const existingTarget = await this.prisma.kpiTarget.findUnique({
      where: { id },
      include: {
        period: true,
      },
    });

    if (!existingTarget) {
      throw new NotFoundException(`Target with ID ${id} not found`);
    }

    // Check if period window is still open
    const period = existingTarget.period;
    if (!this.periodsService.isScoringWindowOpen(period)) {
      throw new BadRequestException(
        "Cannot update target when period window is closed",
      );
    }

    const target = await this.prisma.kpiTarget.update({
      where: { id },
      data: {
        target: updateTargetDto.target
          ? new Decimal(updateTargetDto.target)
          : undefined,
      },
      include: {
        metric: true,
        period: true,
      },
    });

    return {
      ...target,
      target: Number(target.target),
      metric: target.metric as MetricResponseDto,
      period: target.period as PeriodResponseDto,
    } as TargetResponseDto;
  }
}
