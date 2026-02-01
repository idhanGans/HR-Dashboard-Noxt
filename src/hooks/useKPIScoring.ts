import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kpiService } from "../services/kpi";
import type {
  KpiMetricApiResponse,
  KpiPeriodApiResponse,
  MetricScoreDto,
} from "../types/api";

// ============ Query Key Factory ============
// Colocated with queries per TkDodo's best practices
// @see https://tkdodo.eu/blog/effective-react-query-keys

const kpiScoringKeys = {
  all: ["kpi-scoring"] as const,
  period: () => [...kpiScoringKeys.all, "period"] as const,
  metrics: () => [...kpiScoringKeys.all, "metrics"] as const,
  scores: () => [...kpiScoringKeys.all, "scores"] as const,
  employeeScores: (employeeId: number, periodId: number) =>
    [...kpiScoringKeys.scores(), { employeeId, periodId }] as const,
};

/**
 * useKPIScoring - Hook for KPI scoring functionality using TanStack Query
 *
 * Fetches metrics, current period, and existing scores; provides scoring submission
 */
export const useKPIScoring = () => {
  const queryClient = useQueryClient();

  // Track which employee's scores we're viewing (for lazy loading)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  // ============ Queries ============

  /**
   * Fetch current active period
   */
  const periodQuery = useQuery({
    queryKey: kpiScoringKeys.period(),
    queryFn: kpiService.getCurrentPeriod,
    retry: false, // No period is a valid state
  });

  /**
   * Fetch all active metrics
   */
  const metricsQuery = useQuery({
    queryKey: kpiScoringKeys.metrics(),
    queryFn: () => kpiService.getMetrics({ limit: 100 }),
    select: (data) => data.data.filter((m) => m.isActive),
  });

  /**
   * Fetch existing scores for selected employee
   * Only runs when we have both an employee selected and a valid period
   */
  const scoresQuery = useQuery({
    queryKey: kpiScoringKeys.employeeScores(
      selectedEmployeeId ?? 0,
      periodQuery.data?.id ?? 0
    ),
    queryFn: () =>
      kpiService.getEmployeeScores({
        scoredUserId: selectedEmployeeId!,
        periodId: periodQuery.data!.id,
        limit: 100,
      }),
    enabled: selectedEmployeeId !== null && periodQuery.data !== undefined,
    select: (data) => {
      // Convert array of scores to metricId -> score map
      const scoresMap: Record<number, number> = {};
      data.data.forEach((score) => {
        scoresMap[score.metricId] = Number(score.score);
      });
      return scoresMap;
    },
  });

  // ============ Mutations ============

  /**
   * Submit bulk scores mutation
   */
  const submitMutation = useMutation({
    mutationFn: kpiService.submitBulkScores,
    onSuccess: (_data, variables) => {
      // Invalidate the scores for this employee/period
      queryClient.invalidateQueries({
        queryKey: kpiScoringKeys.employeeScores(
          variables.scoredUserId,
          variables.periodId
        ),
      });
    },
  });

  // ============ Derived State ============

  const currentPeriod: KpiPeriodApiResponse | null = periodQuery.data ?? null;
  const metrics: KpiMetricApiResponse[] = useMemo(
    () => metricsQuery.data ?? [],
    [metricsQuery.data]
  );
  const existingScores: Record<number, number> = scoresQuery.data ?? {};

  const periodLoading = periodQuery.isLoading;
  const metricsLoading = metricsQuery.isLoading;
  const scoresLoading = scoresQuery.isLoading;
  const submitting = submitMutation.isPending;

  const error =
    metricsQuery.error?.message ?? submitMutation.error?.message ?? null;

  // Can score if we have a period and at least one metric
  const canScore =
    !periodLoading && !metricsLoading && currentPeriod !== null && metrics.length > 0;

  // ============ Actions ============

  /**
   * Fetch scores for a specific employee
   * Sets the selected employee which triggers the scores query
   */
  const fetchEmployeeScores = useCallback((employeeId: number) => {
    setSelectedEmployeeId(employeeId);
  }, []);

  /**
   * Submit KPI scores for an employee
   */
  const submitScores = useCallback(
    async (employeeId: number, scores: MetricScoreDto[]): Promise<boolean> => {
      if (!currentPeriod) {
        return false;
      }

      if (scores.length === 0) {
        return false;
      }

      try {
        await submitMutation.mutateAsync({
          periodId: currentPeriod.id,
          scoredUserId: employeeId,
          scores,
        });
        return true;
      } catch {
        return false;
      }
    },
    [currentPeriod, submitMutation]
  );

  /**
   * Refetch metrics and period
   */
  const refetchMetrics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: kpiScoringKeys.period() });
    queryClient.invalidateQueries({ queryKey: kpiScoringKeys.metrics() });
  }, [queryClient]);

  return {
    // Data
    currentPeriod,
    metrics,
    existingScores,
    // Loading states
    metricsLoading,
    periodLoading,
    scoresLoading,
    submitting,
    // Error state
    error,
    // Computed
    canScore,
    // Actions
    submitScores,
    fetchEmployeeScores,
    refetchMetrics,
  };
};
