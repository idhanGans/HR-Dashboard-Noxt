import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateMetricDto, UpdateMetricDto } from "@/kpi/dto";
import { PaginationQueryDto, PaginatedResponseDto } from "@/common/dto";
import { KpiMetric, Prisma } from "@prisma/client";

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMetricDto: CreateMetricDto,
    organizationId: number,
  ): Promise<KpiMetric> {
    if (!organizationId) {
      throw new BadRequestException("Organization ID is required");
    }

    const metric = await this.prisma.kpiMetric.create({
      data: {
        name: createMetricDto.name,
        description: createMetricDto.description,
        organizationId,
      },
    });

    return metric;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    organizationId?: number,
  ): Promise<PaginatedResponseDto<KpiMetric>> {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiMetricWhereInput = {
      ...(organizationId !== undefined && { organizationId }),
      ...(paginationQuery.search && {
        name: {
          contains: paginationQuery.search,
          mode: "insensitive",
        },
      }),
    };

    const [metrics, total] = await Promise.all([
      this.prisma.kpiMetric.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.kpiMetric.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: metrics,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number, organizationId?: number): Promise<KpiMetric> {
    const where: Prisma.KpiMetricWhereUniqueInput = { id };
    const metric = await this.prisma.kpiMetric.findUnique({
      where,
    });

    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      metric.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    return metric;
  }

  async update(
    id: number,
    updateMetricDto: UpdateMetricDto,
    organizationId?: number,
  ): Promise<KpiMetric> {
    const existingMetric = await this.prisma.kpiMetric.findUnique({
      where: { id },
    });

    if (!existingMetric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      existingMetric.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    const metric = await this.prisma.kpiMetric.update({
      where: { id },
      data: updateMetricDto,
    });

    return metric;
  }

  async remove(id: number, organizationId?: number): Promise<void> {
    const metric = await this.prisma.kpiMetric.findUnique({
      where: { id },
      include: {
        scores: {
          take: 1,
        },
      },
    });

    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    // Check organization access if organizationId is provided
    if (
      organizationId !== undefined &&
      metric.organizationId !== organizationId
    ) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    await this.prisma.kpiMetric.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
