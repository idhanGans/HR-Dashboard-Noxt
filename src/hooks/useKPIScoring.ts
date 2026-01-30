import { useState, useEffect, useCallback } from "react";
import { getErrorMessage } from "../utils/errors";
import {
  getCurrentPeriod,
  getMetrics,
  getEmployeeScores,
  submitBulkScores,
} from "../services/kpi";
import type {
  KpiMetricApiResponse,
  KpiPeriodApiResponse,
  MetricScoreDto,
} from "../types/api";

interface UseKPIScoringReturn {
  // Data
  currentPeriod: KpiPeriodApiResponse | null;
  metrics: KpiMetricApiResponse[];
  existingScores: Record<number, number>; // metricId -> score
  // Loading states
  metricsLoading: boolean;
  periodLoading: boolean;
  scoresLoading: boolean;
  submitting: boolean;
  // Error state
  error: string | null;
  // Computed
  canScore: boolean;
  // Actions
  submitScores: (employeeId: number, scores: MetricScoreDto[]) => Promise<boolean>;
  fetchEmployeeScores: (employeeId: number) => Promise<void>;
  refetchMetrics: () => Promise<void>;
}

/**
 * useKPIScoring - Hook for KPI scoring functionality
 * Fetches metrics, current period, and existing scores; provides scoring submission
 */
export const useKPIScoring = (): UseKPIScoringReturn => {
  // Data state
  const [currentPeriod, setCurrentPeriod] = useState<KpiPeriodApiResponse | null>(null);
  const [metrics, setMetrics] = useState<KpiMetricApiResponse[]>([]);
  const [existingScores, setExistingScores] = useState<Record<number, number>>({});

  // Loading states
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch current active period
  const fetchCurrentPeriod = useCallback(async () => {
    setPeriodLoading(true);
    try {
      const data = await getCurrentPeriod();
      setCurrentPeriod(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Failed to fetch current period:", err);
      setCurrentPeriod(null);
      // Don't set error here - no period is a valid state
      return null;
    } finally {
      setPeriodLoading(false);
    }
  }, []);

  // Fetch active metrics
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const data = await getMetrics({ limit: 100 });
      // Filter to only active metrics
      const activeMetrics = data.data.filter((m) => m.isActive);
      setMetrics(activeMetrics);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      setError(getErrorMessage(err, "Failed to load KPI metrics"));
      setMetrics([]);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Fetch existing scores for an employee in the current period
  const fetchEmployeeScoresInternal = useCallback(async (employeeId: number) => {
    if (!currentPeriod) {
      setExistingScores({});
      return;
    }

    setScoresLoading(true);
    try {
      const data = await getEmployeeScores({
        scoredUserId: employeeId,
        periodId: currentPeriod.id,
        limit: 100,
      });

      // Convert array of scores to metricId -> score map
      const scoresMap: Record<number, number> = {};
      data.data.forEach((score) => {
        scoresMap[score.metricId] = Number(score.score);
      });

      setExistingScores(scoresMap);
    } catch (err) {
      console.error("Failed to fetch employee scores:", err);
      // Don't set error - just use empty scores
      setExistingScores({});
    } finally {
      setScoresLoading(false);
    }
  }, [currentPeriod]);

  // Submit KPI scores for an employee
  const submitScoresInternal = useCallback(
    async (employeeId: number, scores: MetricScoreDto[]): Promise<boolean> => {
      if (!currentPeriod) {
        setError("Period does not exist");
        return false;
      }

      if (scores.length === 0) {
        setError("No scores are available");
        return false;
      }

      setSubmitting(true);
      setError(null);

      try {
        await submitBulkScores({
          periodId: currentPeriod.id,
          scoredUserId: employeeId,
          scores,
        });

        // Update existing scores after successful save
        const newScoresMap: Record<number, number> = {};
        scores.forEach((s) => {
          newScoresMap[s.metricId] = s.score;
        });
        setExistingScores(newScoresMap);

        return true;
      } catch (err) {
        console.error("Failed to submit KPI scores:", err);
        setError(err instanceof Error ? err.message : "Failed to submit scores");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [currentPeriod]
  );

  // Refetch metrics (useful after period change)
  const refetchMetrics = useCallback(async () => {
    await Promise.all([fetchCurrentPeriod(), fetchMetrics()]);
  }, [fetchCurrentPeriod, fetchMetrics]);

  // Fetch data on mount
  useEffect(() => {
    fetchCurrentPeriod();
    fetchMetrics();
  }, [fetchCurrentPeriod, fetchMetrics]);

  // Can score if we have a period and at least one metric
  const canScore = !periodLoading && !metricsLoading && currentPeriod !== null && metrics.length > 0;

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
    submitScores: submitScoresInternal,
    fetchEmployeeScores: fetchEmployeeScoresInternal,
    refetchMetrics,
  };
};
