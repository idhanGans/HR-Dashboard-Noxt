import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kpiService } from "../services/kpi";
import { kpiTrackerService } from "../services/kpiTracker";
import { useKPITrackerStore } from "../stores/kpiTrackerStore";
import type {
  KpiPeriodApiResponse,
  KpiMetricApiResponse,
  CompanyOverallResponseDto,
  TrendsResponseDto,
  DepartmentsResponseDto,
} from "../types/api";
import type {
  KPITableRow,
  KPIStatus,
  KpiTargetApiResponse,
} from "../types/api/kpi-tracker";

// ============ Query Key Factory ============

const kpiTrackerKeys = {
  all: ["kpi-tracker"] as const,
  activePeriod: () => [...kpiTrackerKeys.all, "active-period"] as const,
  periods: () => [...kpiTrackerKeys.all, "periods"] as const,
  summary: (periodId?: number) =>
    [...kpiTrackerKeys.all, "summary", { periodId }] as const,
  trend: (startDate: string, endDate: string) =>
    [...kpiTrackerKeys.all, "trend", { startDate, endDate }] as const,
  scores: (filters: Record<string, unknown>) =>
    [...kpiTrackerKeys.all, "scores", filters] as const,
  targets: (periodId?: number) =>
    [...kpiTrackerKeys.all, "targets", { periodId }] as const,
  metrics: () => [...kpiTrackerKeys.all, "metrics"] as const,
  departments: () => [...kpiTrackerKeys.all, "departments"] as const,
  employees: (filters: Record<string, unknown>) =>
    [...kpiTrackerKeys.all, "employees", filters] as const,
};

// ============ Helper: Calculate KPI Status ============

const getKPIStatus = (score: number, target: number): KPIStatus => {
  const ratio = target > 0 ? score / target : 0;
  if (ratio >= 0.9) return "Excellent";
  if (ratio >= 0.7) return "Good";
  return "Poor";
};

// ============ Hook: useActivePeriod ============

export const useActivePeriod = () => {
  const query = useQuery<KpiPeriodApiResponse | null>({
    queryKey: kpiTrackerKeys.activePeriod(),
    queryFn: async () => {
      try {
        return await kpiService.getCurrentPeriod();
      } catch {
        // No active period is a valid state
        return null;
      }
    },
    retry: false,
  });

  return {
    activePeriod: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
};

// ============ Hook: useKPIPeriods ============

export const useKPIPeriods = () => {
  const query = useQuery({
    queryKey: kpiTrackerKeys.periods(),
    queryFn: () => kpiTrackerService.getPeriods({ limit: 100 }),
    select: (data) => data.data,
  });

  return {
    periods: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
};

// ============ Hook: useKPISummary ============

export const useKPISummary = (periodId?: number) => {
  const query = useQuery<CompanyOverallResponseDto>({
    queryKey: kpiTrackerKeys.summary(periodId),
    queryFn: () => kpiService.getOverall(),
  });

  return {
    overallScore: query.data?.overallScore ?? 0,
    totalDepartments: query.data?.totalDepartments ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
};

// ============ Hook: useKPITrend ============

export const useKPITrend = () => {
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    return {
      startDate,
      endDate,
      startDateStr: startDate.toISOString(),
      endDateStr: endDate.toISOString(),
    };
  }, []);

  const query = useQuery<TrendsResponseDto>({
    queryKey: kpiTrackerKeys.trend(
      dateRange.startDateStr,
      dateRange.endDateStr,
    ),
    queryFn: () =>
      kpiService.getTrends({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
  });

  const trendData = useMemo(() => {
    if (!query.data?.trends) return [];
    return query.data.trends.map((t) => ({
      period: t.periodName,
      score: t.averageScore,
    }));
  }, [query.data]);

  return {
    trendData,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
};

// ============ Hook: useKPIMetrics ============

export const useKPIMetrics = () => {
  const query = useQuery({
    queryKey: kpiTrackerKeys.metrics(),
    queryFn: () => kpiService.getMetrics({ limit: 100 }),
    select: (data) => data.data.filter((m) => m.isActive),
  });

  return {
    metrics: query.data ?? [],
    isLoading: query.isLoading,
  };
};

// ============ Hook: useKPIDepartments ============

export const useKPIDepartments = () => {
  const query = useQuery<DepartmentsResponseDto>({
    queryKey: kpiTrackerKeys.departments(),
    queryFn: () => kpiTrackerService.getDepartmentStats(),
  });

  const departments = useMemo(() => {
    if (!query.data?.departments) return [];
    return query.data.departments.map((d) => ({
      value: String(d.departmentId),
      label: d.departmentName,
    }));
  }, [query.data]);

  return {
    departments,
    isLoading: query.isLoading,
  };
};

// ============ Hook: useEmployeeKPIList ============

export const useEmployeeKPIList = () => {
  const { filters, page, limit } = useKPITrackerStore();

  // Fetch scores with pagination
  const scoresQuery = useQuery({
    queryKey: kpiTrackerKeys.scores({
      periodId: filters.periodId,
      page,
      limit,
      search: filters.search,
      departmentId: filters.departmentId,
    }),
    queryFn: () =>
      kpiTrackerService.getScores({
        periodId: filters.periodId ?? undefined,
        page,
        limit: limit,
      }),
  });

  // Fetch targets for the active period
  const targetsQuery = useQuery({
    queryKey: kpiTrackerKeys.targets(filters.periodId ?? undefined),
    queryFn: () =>
      kpiTrackerService.getTargets({
        periodId: filters.periodId ?? undefined,
        limit: 100,
      }),
    enabled: true,
  });

  // Fetch metrics for name lookup
  const metricsQuery = useQuery({
    queryKey: kpiTrackerKeys.metrics(),
    queryFn: () => kpiService.getMetrics({ limit: 100 }),
    select: (data) => data.data,
  });

  // Build lookup maps
  const metricsMap = useMemo(() => {
    const map = new Map<number, KpiMetricApiResponse>();
    (metricsQuery.data ?? []).forEach((m) => map.set(m.id, m));
    return map;
  }, [metricsQuery.data]);

  const targetsMap = useMemo(() => {
    const map = new Map<string, KpiTargetApiResponse>();
    (targetsQuery.data?.data ?? []).forEach((t) =>
      map.set(`${t.metricId}-${t.periodId}`, t),
    );
    return map;
  }, [targetsQuery.data]);

  // Build table rows from scores
  const tableRows: KPITableRow[] = useMemo(() => {
    if (!scoresQuery.data?.data) return [];

    return scoresQuery.data.data
      .map((score) => {
        const metric = metricsMap.get(score.metricId);
        const target = targetsMap.get(`${score.metricId}-${score.periodId}`);
        const targetValue = target ? Number(target.target) : 0;
        const actualValue = Number(score.score);

        const row: KPITableRow = {
          scoreId: score.id,
          employeeName: `Employee #${score.scoredUserId}`,
          employeeId: score.scoredUserId,
          department: "-",
          kpiName: metric?.name ?? `Metric #${score.metricId}`,
          metricId: score.metricId,
          target: targetValue,
          actual: actualValue,
          weight: 1,
          score: actualValue,
          status: getKPIStatus(actualValue, targetValue),
        };
        return row;
      })
      .filter((row) => {
        // Client-side search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            row.employeeName.toLowerCase().includes(searchLower) ||
            row.kpiName.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });
  }, [scoresQuery.data, metricsMap, targetsMap, filters.search]);

  return {
    rows: tableRows,
    total: scoresQuery.data?.total ?? 0,
    totalPages: scoresQuery.data?.totalPages ?? 0,
    currentPage: scoresQuery.data?.page ?? 1,
    isLoading:
      scoresQuery.isLoading || targetsQuery.isLoading || metricsQuery.isLoading,
    error: scoresQuery.error?.message ?? null,
    refetch: scoresQuery.refetch,
  };
};

// ============ Hook: useKPIScoreUpdate ============

export const useKPIScoreUpdate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, score }: { id: number; score: number }) =>
      kpiTrackerService.updateScore(id, { score }),
    onSuccess: () => {
      // Invalidate all tracker + dashboard queries to refetch
      queryClient.invalidateQueries({ queryKey: kpiTrackerKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateScore = useCallback(
    async (id: number, score: number): Promise<boolean> => {
      try {
        await mutation.mutateAsync({ id, score });
        return true;
      } catch {
        return false;
      }
    },
    [mutation],
  );

  return {
    updateScore,
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
};

// ============ Hook: useKPIScoreDelete ============

export const useKPIScoreDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => kpiTrackerService.deleteScore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kpiTrackerKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteScore = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await mutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
    [mutation],
  );

  return {
    deleteScore,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
};
