import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateMetricDto,
  UpdateMetricDto,
  MetricResponseDto,
  PaginatedMetricsResponseDto,
} from "../dto";
import { PaginationQueryDto } from "@/common/dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async create(createMetricDto: CreateMetricDto): Promise<MetricResponseDto> {
    const metric = await this.prisma.kpiMetric.create({
      data: {
        name: createMetricDto.name,
        description: createMetricDto.description,
      },
    });

    return metric as MetricResponseDto;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedMetricsResponseDto> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiMetricWhereInput = paginationQuery.search
      ? {
          name: {
            contains: paginationQuery.search,
            mode: "insensitive",
          },
        }
      : {};

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
      data: metrics as MetricResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<MetricResponseDto> {
    const metric = await this.prisma.kpiMetric.findUnique({
      where: { id },
    });

    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    return metric as MetricResponseDto;
  }

  async update(
    id: number,
    updateMetricDto: UpdateMetricDto,
  ): Promise<MetricResponseDto> {
    const existingMetric = await this.prisma.kpiMetric.findUnique({
      where: { id },
    });

    if (!existingMetric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }

    const metric = await this.prisma.kpiMetric.update({
      where: { id },
      data: updateMetricDto,
    });

    return metric as MetricResponseDto;
  }

  async remove(id: number): Promise<void> {
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

    await this.prisma.kpiMetric.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
