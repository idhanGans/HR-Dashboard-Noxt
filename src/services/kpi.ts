import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  KPI_STATISTICS_OVERALL,
  KPI_STATISTICS_TRENDS,
  KPI_STATISTICS_DEPARTMENTS,
  KPI_STATISTICS_INSIGHTS,
  KPI_PERIODS_CURRENT,
  KPI_METRICS_LIST,
  KPI_SCORES_LIST,
  KPI_SCORES_BULK,
} from "./endpoints";
import type {
  CompanyOverallResponseDto,
  TrendsResponseDto,
  DepartmentsResponseDto,
  PerformanceInsightsResponseDto,
  KpiPeriodApiResponse,
  PaginatedKpiMetricsResponse,
  PaginatedKpiScoresResponse,
  BulkCreateScoreDto,
  BulkScoreResponseDto,
} from "../types/api";

// ============ KPI Statistics ============

export const getOverallKPI = async (): Promise<CompanyOverallResponseDto> => {
  const response = await interceptedAxios.get<CompanyOverallResponseDto>(
    KPI_STATISTICS_OVERALL
  );
  return response.data;
};

export interface GetTrendsParams {
  startDate: Date;
  endDate: Date;
}

export const getKPITrends = async ({
  startDate,
  endDate,
}: GetTrendsParams): Promise<TrendsResponseDto> => {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const response = await interceptedAxios.get<TrendsResponseDto>(
    `${KPI_STATISTICS_TRENDS}?${params.toString()}`
  );
  return response.data;
};

export const getDepartmentStats = async (): Promise<DepartmentsResponseDto> => {
  const response = await interceptedAxios.get<DepartmentsResponseDto>(
    KPI_STATISTICS_DEPARTMENTS
  );
  return response.data;
};

export const getPerformanceInsights = async (): Promise<PerformanceInsightsResponseDto> => {
  const response = await interceptedAxios.get<PerformanceInsightsResponseDto>(
    KPI_STATISTICS_INSIGHTS
  );
  return response.data;
};

// ============ KPI Periods ============

export const getCurrentPeriod = async (): Promise<KpiPeriodApiResponse> => {
  const response = await interceptedAxios.get<KpiPeriodApiResponse>(
    KPI_PERIODS_CURRENT
  );
  return response.data;
};

// ============ KPI Metrics ============

export interface GetMetricsParams {
  limit?: number;
}

export const getMetrics = async ({
  limit = 100,
}: GetMetricsParams = {}): Promise<PaginatedKpiMetricsResponse> => {
  const response = await interceptedAxios.get<PaginatedKpiMetricsResponse>(
    `${KPI_METRICS_LIST}?limit=${limit}`
  );
  return response.data;
};

// ============ KPI Scores ============

export interface GetEmployeeScoresParams {
  scoredUserId: number;
  periodId: number;
  limit?: number;
}

export const getEmployeeScores = async ({
  scoredUserId,
  periodId,
  limit = 100,
}: GetEmployeeScoresParams): Promise<PaginatedKpiScoresResponse> => {
  const params = new URLSearchParams({
    scoredUserId: String(scoredUserId),
    periodId: String(periodId),
    limit: String(limit),
  });

  const response = await interceptedAxios.get<PaginatedKpiScoresResponse>(
    `${KPI_SCORES_LIST}?${params.toString()}`
  );
  return response.data;
};

export const submitBulkScores = async (
  payload: BulkCreateScoreDto
): Promise<BulkScoreResponseDto> => {
  try {
    const response = await interceptedAxios.post<BulkScoreResponseDto>(
      KPI_SCORES_BULK,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
