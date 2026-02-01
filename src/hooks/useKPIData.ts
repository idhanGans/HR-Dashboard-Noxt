import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { kpiService } from "../services/kpi";
import type { DepartmentKPIStats, PerformanceInsights } from "../types/employee";
import type { KPITrendData } from "../types";

// ============ Query Key Factory ============
// Colocated with queries per TkDodo's best practices
// @see https://tkdodo.eu/blog/effective-react-query-keys

const kpiKeys = {
  all: ["kpi"] as const,
  overall: () => [...kpiKeys.all, "overall"] as const,
  trends: (startDate: string, endDate: string) =>
    [...kpiKeys.all, "trends", { startDate, endDate }] as const,
  departments: () => [...kpiKeys.all, "departments"] as const,
  insights: () => [...kpiKeys.all, "insights"] as const,
};

// Default values for when data is loading or unavailable
const DEFAULT_INSIGHTS: PerformanceInsights = {
  topPerformer: { department: "-", score: "-" },
  mostImproved: { department: "-", improvement: "-" },
  needsAttention: { department: "-", note: "-" },
};

/**
 * useKPIData - Hook for fetching KPI statistics from backend using TanStack Query
 *
 * Uses parallel queries for:
 * - Overall KPI score
 * - KPI trends (last 12 months)
 * - Department statistics
 * - Performance insights
 */
export const useKPIData = () => {
  // Calculate date range for trends (last 12 months)
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    return {
      startDate,
      endDate,
      // String versions for stable query key
      startDateStr: startDate.toISOString(),
      endDateStr: endDate.toISOString(),
    };
  }, []);

  // ============ Queries ============

  const overallQuery = useQuery({
    queryKey: kpiKeys.overall(),
    queryFn: kpiService.getOverall,
  });

  const trendsQuery = useQuery({
    queryKey: kpiKeys.trends(dateRange.startDateStr, dateRange.endDateStr),
    queryFn: () =>
      kpiService.getTrends({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
  });

  const departmentsQuery = useQuery({
    queryKey: kpiKeys.departments(),
    queryFn: kpiService.getDepartments,
  });

  const insightsQuery = useQuery({
    queryKey: kpiKeys.insights(),
    queryFn: kpiService.getInsights,
  });

  // ============ Derived Data ============

  const overallScore = overallQuery.data?.overallScore ?? 0;

  const trendData: KPITrendData[] = useMemo(() => {
    if (!trendsQuery.data?.trends) return [];
    return trendsQuery.data.trends.map((trend) => ({
      month: trend.periodName,
      value: trend.averageScore,
    }));
  }, [trendsQuery.data]);

  const departmentStats: DepartmentKPIStats[] = useMemo(() => {
    if (!departmentsQuery.data?.departments) return [];
    return departmentsQuery.data.departments.map((dept) => ({
      department: dept.departmentName,
      score: dept.averageScore,
      target: dept.targetScore,
      trend: dept.averageScore >= dept.targetScore ? "+0%" : "-0%",
    }));
  }, [departmentsQuery.data]);

  const performanceInsights: PerformanceInsights = useMemo(() => {
    if (!insightsQuery.data) return DEFAULT_INSIGHTS;
    return {
      topPerformer: {
        department: insightsQuery.data.topPerformer.departmentName,
        score: insightsQuery.data.topPerformer.score || "-",
      },
      mostImproved: {
        department: insightsQuery.data.mostImproved.departmentName,
        improvement: insightsQuery.data.mostImproved.improvement || "-",
      },
      needsAttention: {
        department: insightsQuery.data.needsAttention.departmentName,
        note: insightsQuery.data.needsAttention.note || "-",
      },
    };
  }, [insightsQuery.data]);

  // ============ Loading & Error States ============

  const overallLoading = overallQuery.isLoading;
  const trendsLoading = trendsQuery.isLoading;
  const departmentsLoading = departmentsQuery.isLoading;
  const insightsLoading = insightsQuery.isLoading;
  const loading =
    overallLoading || trendsLoading || departmentsLoading || insightsLoading;

  // Combine errors
  const error =
    overallQuery.error?.message ??
    trendsQuery.error?.message ??
    departmentsQuery.error?.message ??
    insightsQuery.error?.message ??
    null;

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
  };
};
