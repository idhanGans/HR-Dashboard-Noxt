import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { PeriodsService } from "@/kpi/periods/periods.service";
import {
  CompanyOverallResponseDto,
  TrendsResponseDto,
  TrendDataPointDto,
  DepartmentsResponseDto,
  DepartmentKpiDto,
  TopPerformersResponseDto,
  TopPerformerEmployeeDto,
  PerformanceInsightsResponseDto,
  PerformanceInsightDto,
  TrendsQueryDto,
} from "@/kpi/dto";
import { EmploymentType, Prisma } from "@prisma/client";

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private periodsService: PeriodsService,
  ) {}

  /**
   * Get overall company KPI score for a period
   */
  async getOverall(periodId?: number): Promise<CompanyOverallResponseDto> {
    let period;
    if (periodId) {
      period = await this.periodsService.findOne(periodId);
    } else {
      period = await this.periodsService.findCurrent();
      if (!period) {
        throw new NotFoundException("No active period found");
      }
    }

    // Get all scores for this period
    const scores = await this.prisma.kpiScore.findMany({
      where: {
        periodId: period.id,
      },
      include: {
        scoredUser: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (scores.length === 0) {
      return {
        overallScore: 0,
        periodId: period.id,
        totalDepartments: 0,
      };
    }

    // Calculate overall average score
    const totalScore = scores.reduce(
      (sum, score) => sum + Number(score.score),
      0,
    );
    const overallScore = totalScore / scores.length;

    // Get unique departments
    const departmentIds = new Set<number>();
    scores.forEach((score) => {
      if (score.scoredUser.organizationId) {
        departmentIds.add(score.scoredUser.organizationId);
      }
    });

    return {
      overallScore: parseFloat(overallScore.toFixed(1)),
      periodId: period.id,
      totalDepartments: departmentIds.size,
    };
  }

  /**
   * Get KPI trend data for a date range
   */
  async getTrends(query: TrendsQueryDto): Promise<TrendsResponseDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (startDate > endDate) {
      throw new BadRequestException("Start date must be before end date");
    }

    // Find all periods within the date range
    const periods = await this.prisma.kpiPeriod.findMany({
      where: {
        startDate: { lte: endDate },
        endDate: { gte: startDate },
        isActive: true,
      },
      orderBy: { startDate: "asc" },
    });

    const trends: TrendDataPointDto[] = [];

    for (const period of periods) {
      // Build query for scores in this period
      const scoreWhere: Prisma.KpiScoreWhereInput = {
        periodId: period.id,
      };

      // If department filter is specified, filter by users in that organization
      if (query.departmentId) {
        const usersInDept = await this.prisma.user.findMany({
          where: {
            organizationId: query.departmentId,
          },
          select: { id: true },
        });
        const userIds = usersInDept.map((u) => u.id);
        if (userIds.length === 0) {
          continue; // Skip if no users in department
        }
        scoreWhere.scoredUserId = { in: userIds };
      }

      const scores = await this.prisma.kpiScore.findMany({
        where: scoreWhere,
      });

      if (scores.length > 0) {
        const totalScore = scores.reduce(
          (sum, score) => sum + Number(score.score),
          0,
        );
        const averageScore = totalScore / scores.length;

        trends.push({
          periodId: period.id,
          periodName: period.name,
          averageScore: parseFloat(averageScore.toFixed(1)),
        });
      }
    }

    return {
      trends,
      departmentId: query.departmentId,
    };
  }

  /**
   * Get department KPI statistics for a period
   */
  async getDepartments(periodId?: number): Promise<DepartmentsResponseDto> {
    let period;
    if (periodId) {
      period = await this.periodsService.findOne(periodId);
    } else {
      period = await this.periodsService.findCurrent();
      if (!period) {
        throw new NotFoundException("No active period found");
      }
    }

    // Get all organizations (departments)
    const organizations = await this.prisma.organization.findMany();

    // Get all targets for this period
    const targets = await this.prisma.kpiTarget.findMany({
      where: {
        periodId: period.id,
      },
    });

    // Calculate average target score
    const avgTarget =
      targets.length > 0
        ? targets.reduce((sum, t) => sum + Number(t.target), 0) / targets.length
        : 8.0; // Default target

    const departments: DepartmentKpiDto[] = [];

    for (const org of organizations) {
      // Get all users in this organization
      const users = await this.prisma.user.findMany({
        where: {
          organizationId: org.id,
          employmentType: { not: EmploymentType.FORMER },
        },
        select: { id: true },
      });

      if (users.length === 0) continue;

      const userIds = users.map((u) => u.id);

      // Get all scores for users in this organization for this period
      const scores = await this.prisma.kpiScore.findMany({
        where: {
          periodId: period.id,
          scoredUserId: { in: userIds },
        },
      });

      if (scores.length > 0) {
        const totalScore = scores.reduce(
          (sum, score) => sum + Number(score.score),
          0,
        );
        const averageScore = totalScore / scores.length;

        departments.push({
          departmentId: org.id,
          departmentName: org.name,
          averageScore: parseFloat(averageScore.toFixed(1)),
          targetScore: parseFloat(avgTarget.toFixed(1)),
          periodId: period.id,
        });
      }
    }

    return {
      departments,
      periodId: period.id,
    };
  }

  /**
   * Get top performing employees for a period
   */
  async getTopPerformers(
    limit: number = 3,
    periodId?: number,
  ): Promise<TopPerformersResponseDto> {
    let period;
    if (periodId) {
      period = await this.periodsService.findOne(periodId);
    } else {
      period = await this.periodsService.findCurrent();
      if (!period) {
        throw new NotFoundException("No active period found");
      }
    }

    // Get all scores for this period
    const scores = await this.prisma.kpiScore.findMany({
      where: {
        periodId: period.id,
      },
      include: {
        scoredUser: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Group scores by user and calculate average per user
    const userScores = new Map<
      number,
      {
        user: (typeof scores)[number]["scoredUser"];
        scores: number[];
        total: number;
      }
    >();

    scores.forEach((score) => {
      const userId = score.scoredUserId;
      const scoreValue = Number(score.score);

      if (!userScores.has(userId)) {
        userScores.set(userId, {
          user: score.scoredUser,
          scores: [],
          total: 0,
        });
      }

      const userData = userScores.get(userId)!;
      userData.scores.push(scoreValue);
      userData.total += scoreValue;
    });

    // Calculate average for each user and sort
    const performers: TopPerformerEmployeeDto[] = Array.from(
      userScores.entries(),
    )
      .map(([userId, data]) => {
        const avgScore = data.total / data.scores.length;
        return {
          userId,
          userName: data.user.fullName,
          departmentName: data.user.organization?.name,
          role: data.user.roleName || undefined,
          averageScore: parseFloat(avgScore.toFixed(1)),
          trend: undefined, // Could calculate trend if previous period data available
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, limit);

    return {
      performers,
      periodId: period.id,
      limit,
    };
  }

  /**
   * Get performance insights for a period
   */
  async getInsights(
    periodId?: number,
  ): Promise<PerformanceInsightsResponseDto> {
    let period;
    if (periodId) {
      period = await this.periodsService.findOne(periodId);
    } else {
      period = await this.periodsService.findCurrent();
      if (!period) {
        throw new NotFoundException("No active period found");
      }
    }

    // Get department stats
    const deptStats = await this.getDepartments(period.id);

    if (deptStats.departments.length === 0) {
      // Return default insights if no data
      return {
        topPerformer: {
          departmentName: "N/A",
          score: "0/10",
        },
        mostImproved: {
          departmentName: "N/A",
          improvement: "No data available",
        },
        needsAttention: {
          departmentName: "All on track",
          note: "No data available",
        },
        periodId: period.id,
      };
    }

    // Find top performer (highest average score)
    const topPerformerDept = deptStats.departments.reduce((max, dept) =>
      dept.averageScore > max.averageScore ? dept : max,
    );

    // Find most improved (highest percentage above target)
    const mostImprovedDept = deptStats.departments.reduce((max, dept) => {
      const maxImprovement =
        ((max.averageScore - max.targetScore) / max.targetScore) * 100;
      const deptImprovement =
        ((dept.averageScore - dept.targetScore) / dept.targetScore) * 100;
      return deptImprovement > maxImprovement ? dept : max;
    });

    // Find department needing attention (below target)
    const needsAttentionDept =
      deptStats.departments.find(
        (dept) => dept.averageScore < dept.targetScore,
      ) || null;

    const topPerformer: PerformanceInsightDto = {
      departmentName: topPerformerDept.departmentName,
      score: `${topPerformerDept.averageScore.toFixed(1)}/10`,
    };

    const improvementPercentage = Math.round(
      ((mostImprovedDept.averageScore - mostImprovedDept.targetScore) /
        mostImprovedDept.targetScore) *
        100,
    );
    const mostImproved: PerformanceInsightDto = {
      departmentName: mostImprovedDept.departmentName,
      improvement: `${improvementPercentage > 0 ? "+" : ""}${improvementPercentage}% improvement this period`,
    };

    const needsAttention: PerformanceInsightDto = needsAttentionDept
      ? {
          departmentName: needsAttentionDept.departmentName,
          note: "Below target performance",
        }
      : {
          departmentName: "All on track",
          note: "All departments meeting targets",
        };

    return {
      topPerformer,
      mostImproved,
      needsAttention,
      periodId: period.id,
    };
  }
}
