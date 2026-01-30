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

// ============ Parameter Types ============

export interface GetTrendsParams {
  startDate: Date;
  endDate: Date;
}

export interface GetMetricsParams {
  limit?: number;
}

export interface GetEmployeeScoresParams {
  scoredUserId: number;
  periodId: number;
  limit?: number;
}

// ============ KPI Service Factory ============

const createKpiService = () => {
  // ============ Statistics ============

  const getOverall = async (): Promise<CompanyOverallResponseDto> => {
    try {
      const response = await interceptedAxios.get<CompanyOverallResponseDto>(
        KPI_STATISTICS_OVERALL
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getTrends = async ({
    startDate,
    endDate,
  }: GetTrendsParams): Promise<TrendsResponseDto> => {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await interceptedAxios.get<TrendsResponseDto>(
        `${KPI_STATISTICS_TRENDS}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getDepartments = async (): Promise<DepartmentsResponseDto> => {
    try {
      const response = await interceptedAxios.get<DepartmentsResponseDto>(
        KPI_STATISTICS_DEPARTMENTS
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getInsights = async (): Promise<PerformanceInsightsResponseDto> => {
    try {
      const response =
        await interceptedAxios.get<PerformanceInsightsResponseDto>(
          KPI_STATISTICS_INSIGHTS
        );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Periods ============

  const getCurrentPeriod = async (): Promise<KpiPeriodApiResponse> => {
    try {
      const response = await interceptedAxios.get<KpiPeriodApiResponse>(
        KPI_PERIODS_CURRENT
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Metrics ============

  const getMetrics = async ({
    limit = 100,
  }: GetMetricsParams = {}): Promise<PaginatedKpiMetricsResponse> => {
    try {
      const response = await interceptedAxios.get<PaginatedKpiMetricsResponse>(
        `${KPI_METRICS_LIST}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Scores ============

  const getEmployeeScores = async ({
    scoredUserId,
    periodId,
    limit = 100,
  }: GetEmployeeScoresParams): Promise<PaginatedKpiScoresResponse> => {
    try {
      const params = new URLSearchParams({
        scoredUserId: String(scoredUserId),
        periodId: String(periodId),
        limit: String(limit),
      });

      const response = await interceptedAxios.get<PaginatedKpiScoresResponse>(
        `${KPI_SCORES_LIST}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const submitBulkScores = async (
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

  return {
    // Statistics
    getOverall,
    getTrends,
    getDepartments,
    getInsights,
    // Periods
    getCurrentPeriod,
    // Metrics
    getMetrics,
    // Scores
    getEmployeeScores,
    submitBulkScores,
  };
};

const kpiService = createKpiService();

export { kpiService };
