import { useState, useEffect, useCallback } from "react";
import { getErrorMessage } from "../utils/errors";
import {
  getOverallKPI,
  getKPITrends,
  getDepartmentStats,
  getPerformanceInsights,
} from "../services/kpi";
import type { DepartmentKPIStats, PerformanceInsights } from "../types/employee";
import type { KPITrendData } from "../types";

interface UseKPIDataReturn {
  // Data
  overallScore: number;
  trendData: KPITrendData[];
  departmentStats: DepartmentKPIStats[];
  performanceInsights: PerformanceInsights;
  // Loading states
  loading: boolean;
  overallLoading: boolean;
  trendsLoading: boolean;
  departmentsLoading: boolean;
  insightsLoading: boolean;
  // Error state
  error: string | null;
  // Actions
  refetch: () => Promise<void>;
}

// Default values for when data is loading or unavailable
const DEFAULT_INSIGHTS: PerformanceInsights = {
  topPerformer: { department: "-", score: "-" },
  mostImproved: { department: "-", improvement: "-" },
  needsAttention: { department: "-", note: "-" },
};

/**
 * useKPIData - Hook for fetching KPI statistics from backend
 * Replaces the local dummy data from useEmployees() for KPI page
 */
export const useKPIData = (): UseKPIDataReturn => {
  // Data state
  const [overallScore, setOverallScore] = useState<number>(0);
  const [trendData, setTrendData] = useState<KPITrendData[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentKPIStats[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsights>(DEFAULT_INSIGHTS);

  // Loading states
  const [overallLoading, setOverallLoading] = useState(true);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch overall KPI score
  const fetchOverallKPI = useCallback(async () => {
    setOverallLoading(true);
    try {
      const data = await getOverallKPI();
      setOverallScore(data.overallScore);
    } catch (err) {
      console.error("Failed to fetch overall KPI:", err);
      setError(getErrorMessage(err, "Failed to load overall KPI"));
    } finally {
      setOverallLoading(false);
    }
  }, []);

  // Fetch KPI trends
  const fetchTrends = useCallback(async () => {
    setTrendsLoading(true);
    try {
      // Calculate date range for last 12 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);

      const data = await getKPITrends({ startDate, endDate });

      // Map backend response to frontend format
      const mappedTrends: KPITrendData[] = data.trends.map((trend) => ({
        month: trend.periodName,
        value: trend.averageScore,
      }));

      setTrendData(mappedTrends);
    } catch (err) {
      console.error("Failed to fetch KPI trends:", err);
      setError(getErrorMessage(err, "Failed to load KPI trends"));
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  // Fetch department statistics
  const fetchDepartmentStats = useCallback(async () => {
    setDepartmentsLoading(true);
    try {
      const data = await getDepartmentStats();

      // Map backend response to frontend format
      const mappedDepartments: DepartmentKPIStats[] = data.departments.map((dept) => ({
        department: dept.departmentName,
        score: dept.averageScore,
        target: dept.targetScore,
        // Backend doesn't provide trend, calculate or use placeholder
        trend: dept.averageScore >= dept.targetScore ? "+0%" : "-0%",
      }));

      setDepartmentStats(mappedDepartments);
    } catch (err) {
      console.error("Failed to fetch department stats:", err);
      setError(getErrorMessage(err, "Failed to load department statistics"));
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  // Fetch performance insights
  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const data = await getPerformanceInsights();

      // Map backend response to frontend format
      const mappedInsights: PerformanceInsights = {
        topPerformer: {
          department: data.topPerformer.departmentName,
          score: data.topPerformer.score || "-",
        },
        mostImproved: {
          department: data.mostImproved.departmentName,
          improvement: data.mostImproved.improvement || "-",
        },
        needsAttention: {
          department: data.needsAttention.departmentName,
          note: data.needsAttention.note || "-",
        },
      };

      setPerformanceInsights(mappedInsights);
    } catch (err) {
      console.error("Failed to fetch performance insights:", err);
      setError(getErrorMessage(err, "Failed to load performance insights"));
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  // Refetch all data
  const refetch = useCallback(async () => {
    setError(null);
    await Promise.all([
      fetchOverallKPI(),
      fetchTrends(),
      fetchDepartmentStats(),
      fetchInsights(),
    ]);
  }, [fetchOverallKPI, fetchTrends, fetchDepartmentStats, fetchInsights]);

  // Fetch data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Combined loading state
  const loading = overallLoading || trendsLoading || departmentsLoading || insightsLoading;

  return {
    // Data
    overallScore,
    trendData,
    departmentStats,
    performanceInsights,
    // Loading states
    loading,
    overallLoading,
    trendsLoading,
    departmentsLoading,
    insightsLoading,
    // Error state
    error,
    // Actions
    refetch,
  };
};
