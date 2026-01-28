import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateTargetDto, UpdateTargetDto } from "@/kpi/dto";
import { PaginationQueryDto } from "@/common/dto";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MetricsService } from "@/kpi/metrics/metrics.service";
import { PeriodsService } from "@/kpi/periods/periods.service";

const kpiTargetInclude = {
  metric: true,
  period: true,
} as const;

@Injectable()
export class TargetsService {
  constructor(
    private prisma: PrismaService,
    private metricsService: MetricsService,
    private periodsService: PeriodsService,
  ) {}

  async create(createTargetDto: CreateTargetDto, organizationId: number) {
    if (!organizationId) {
      throw new BadRequestException("Organization ID is required");
    }

    // Validate metric exists, is active, and belongs to the organization
    const metric = await this.metricsService.findOne(
      createTargetDto.metricId,
      organizationId,
    );

    if (!metric.isActive) {
      throw new BadRequestException("Cannot set target for inactive metric");
    }

    // Validate period exists and belongs to the organization
    const period = await this.periodsService.findOne(
      createTargetDto.periodId,
      organizationId,
    );

    // Ensure metric and period belong to the same organization
    if (metric.organizationId !== period.organizationId) {
      throw new BadRequestException(
        "Metric and period must belong to the same organization",
      );
    }

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
        organizationId,
        target: new Decimal(createTargetDto.target),
      },
      include: kpiTargetInclude,
    });

    return target;
  }

  async findAll(
    paginationQuery: PaginationQueryDto & {
      periodId?: number;
      metricId?: number;
    },
    organizationId?: number,
  ) {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiTargetWhereInput = {
      ...(organizationId !== undefined && { organizationId }),
    };

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
        include: kpiTargetInclude,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.kpiTarget.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: targets,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number, organizationId?: number) {
    const target = await this.prisma.kpiTarget.findUnique({
      where: { id },
      include: kpiTargetInclude,
    });

    if (!target) {
      throw new NotFoundException(`Target with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      target.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Target with ID ${id} not found`);
    }

    return target;
  }

  async update(
    id: number,
    updateTargetDto: UpdateTargetDto,
    organizationId?: number,
  ) {
    const existingTarget = await this.prisma.kpiTarget.findUnique({
      where: { id },
      include: {
        period: true,
      },
    });

    if (!existingTarget) {
      throw new NotFoundException(`Target with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      existingTarget.organizationId !== organizationId
    ) {
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
      include: kpiTargetInclude,
    });

    return target;
  }
}
