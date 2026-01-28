import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateScoreDto, UpdateScoreDto, BulkCreateScoreDto } from "@/kpi/dto";
import { PaginationQueryDto } from "@/common/dto";
import { Prisma, Role as PrismaRole } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MetricsService } from "@/kpi/metrics/metrics.service";
import { PeriodsService } from "@/kpi/periods/periods.service";

const kpiScoreInclude = {
  period: true,
  metric: true,
  scoredUser: true,
  scorer: true,
} as const;

@Injectable()
export class ScoresService {
  constructor(
    private prisma: PrismaService,
    private metricsService: MetricsService,
    private periodsService: PeriodsService,
  ) {}

  async create(
    createScoreDto: CreateScoreDto,
    scorerId: number,
    scorerRole: PrismaRole,
  ) {
    // Validate period exists and window is open
    const period = await this.periodsService.findOne(createScoreDto.periodId);

    if (!this.periodsService.isScoringWindowOpen(period)) {
      throw new BadRequestException("Scoring window is closed for this period");
    }

    // Validate metric exists and is active
    const metric = await this.metricsService.findOne(createScoreDto.metricId);

    if (!metric.isActive) {
      throw new BadRequestException("Cannot score inactive metric");
    }

    // Validate scored user exists
    const scoredUser = await this.prisma.user.findUnique({
      where: { id: createScoreDto.scoredUserId },
      include: {
        organization: true,
      },
    });

    if (!scoredUser) {
      throw new NotFoundException(
        `User with ID ${createScoreDto.scoredUserId} not found`,
      );
    }

    // Authorization check
    if (scorerRole === PrismaRole.SUPERVISOR) {
      if (!scoredUser.organizationId) {
        throw new ForbiddenException(
          "Cannot score user without an organization",
        );
      }

      // Check if scorer supervises the organization
      const supervisedOrg = await this.prisma.organization.findFirst({
        where: {
          id: scoredUser.organizationId,
          supervisorId: scorerId,
        },
      });

      if (!supervisedOrg) {
        throw new ForbiddenException(
          "Supervisors can only score employees from their supervised organizations",
        );
      }
    }
    // SUPERADMIN can score anyone, no additional check needed

    // Check if score already exists
    const existingScore = await this.prisma.kpiScore.findUnique({
      where: {
        periodId_metricId_scoredUserId_scorerId: {
          periodId: createScoreDto.periodId,
          metricId: createScoreDto.metricId,
          scoredUserId: createScoreDto.scoredUserId,
          scorerId,
        },
      },
    });

    if (existingScore) {
      throw new BadRequestException(
        "Score already exists for this period, metric, user, and scorer",
      );
    }

    const score = await this.prisma.kpiScore.create({
      data: {
        periodId: createScoreDto.periodId,
        metricId: createScoreDto.metricId,
        scoredUserId: createScoreDto.scoredUserId,
        scorerId,
        score: new Decimal(createScoreDto.score),
      },
      include: kpiScoreInclude,
    });

    return score;
  }

  async findAll(
    paginationQuery: PaginationQueryDto & {
      periodId?: number;
      metricId?: number;
      scoredUserId?: number;
      scorerId?: number;
    },
  ) {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.KpiScoreWhereInput = {};

    if (paginationQuery.periodId) {
      where.periodId = paginationQuery.periodId;
    }

    if (paginationQuery.metricId) {
      where.metricId = paginationQuery.metricId;
    }

    if (paginationQuery.scoredUserId) {
      where.scoredUserId = paginationQuery.scoredUserId;
    }

    if (paginationQuery.scorerId) {
      where.scorerId = paginationQuery.scorerId;
    }

    const [scores, total] = await Promise.all([
      this.prisma.kpiScore.findMany({
        where,
        skip,
        take: limit,
        include: kpiScoreInclude,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.kpiScore.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: scores,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number) {
    const score = await this.prisma.kpiScore.findUnique({
      where: { id },
      include: kpiScoreInclude,
    });

    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }

    return score;
  }

  async update(id: number, updateScoreDto: UpdateScoreDto, scorerId: number) {
    const existingScore = await this.prisma.kpiScore.findUnique({
      where: { id },
      include: {
        period: true,
      },
    });

    if (!existingScore) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }

    // Verify scorer matches
    if (existingScore.scorerId !== scorerId) {
      throw new ForbiddenException(
        "Cannot update score created by another user",
      );
    }

    // Check if period window is still open
    const period = existingScore.period;
    if (!this.periodsService.isScoringWindowOpen(period)) {
      throw new BadRequestException(
        "Cannot update score when period window is closed",
      );
    }

    const score = await this.prisma.kpiScore.update({
      where: { id },
      data: {
        score: updateScoreDto.score
          ? new Decimal(updateScoreDto.score)
          : undefined,
      },
      include: kpiScoreInclude,
    });

    return score;
  }

  async bulkCreate(
    bulkCreateScoreDto: BulkCreateScoreDto,
    scorerId: number,
    scorerRole: PrismaRole,
  ) {
    // Validate period exists and window is open
    const period = await this.periodsService.findOne(
      bulkCreateScoreDto.periodId,
    );

    if (!this.periodsService.isScoringWindowOpen(period)) {
      throw new BadRequestException("Scoring window is closed for this period");
    }

    // Validate scored user exists
    const scoredUser = await this.prisma.user.findUnique({
      where: { id: bulkCreateScoreDto.scoredUserId },
      include: {
        organization: true,
      },
    });

    if (!scoredUser) {
      throw new NotFoundException(
        `User with ID ${bulkCreateScoreDto.scoredUserId} not found`,
      );
    }

    // Authorization check
    if (scorerRole === PrismaRole.SUPERVISOR) {
      if (!scoredUser.organizationId) {
        throw new ForbiddenException(
          "Cannot score user without an organization",
        );
      }

      const supervisedOrg = await this.prisma.organization.findFirst({
        where: {
          id: scoredUser.organizationId,
          supervisorId: scorerId,
        },
      });

      if (!supervisedOrg) {
        throw new ForbiddenException(
          "Supervisors can only score employees from their supervised organizations",
        );
      }
    }

    // Validate all metrics exist and are active
    const metricIds = bulkCreateScoreDto.scores.map((s) => s.metricId);
    const metrics = await this.prisma.kpiMetric.findMany({
      where: {
        id: { in: metricIds },
      },
    });

    if (metrics.length !== metricIds.length) {
      throw new NotFoundException("One or more metrics not found");
    }

    const inactiveMetrics = metrics.filter((m) => !m.isActive);
    if (inactiveMetrics.length > 0) {
      throw new BadRequestException(
        `Cannot score inactive metrics: ${inactiveMetrics.map((m) => m.name).join(", ")}`,
      );
    }

    // Process scores (create or update)
    const createdScores = [];

    for (const metricScore of bulkCreateScoreDto.scores) {
      // Check if score already exists
      const existingScore = await this.prisma.kpiScore.findUnique({
        where: {
          periodId_metricId_scoredUserId_scorerId: {
            periodId: bulkCreateScoreDto.periodId,
            metricId: metricScore.metricId,
            scoredUserId: bulkCreateScoreDto.scoredUserId,
            scorerId,
          },
        },
      });

      if (existingScore) {
        // Update existing score
        const score = await this.prisma.kpiScore.update({
          where: { id: existingScore.id },
          data: {
            score: new Decimal(metricScore.score),
          },
          include: kpiScoreInclude,
        });
        createdScores.push(score);
      } else {
        // Create new score
        const score = await this.prisma.kpiScore.create({
          data: {
            periodId: bulkCreateScoreDto.periodId,
            metricId: metricScore.metricId,
            scoredUserId: bulkCreateScoreDto.scoredUserId,
            scorerId,
            score: new Decimal(metricScore.score),
          },
          include: kpiScoreInclude,
        });
        createdScores.push(score);
      }
    }

    return {
      scores: createdScores,
      count: createdScores.length,
    };
  }
}
