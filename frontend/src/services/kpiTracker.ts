import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  KPI_SCORES_LIST,
  KPI_SCORES_BY_ID,
  KPI_TARGETS_LIST,
  KPI_PERIODS_LIST,
  KPI_STATISTICS_DEPARTMENTS,
} from "./endpoints";
import type {
  PaginatedKpiScoresResponse,
  KpiScoreApiResponse,
  PaginatedKpiPeriodsResponse,
  DepartmentsResponseDto,
} from "../types/api";
import type {
  PaginatedKpiTargetsResponse,
  UpdateScoreDto,
} from "../types/api/kpi-tracker";

// ============ Parameter Types ============

export interface GetScoresParams {
  page?: number;
  limit?: number;
  periodId?: number;
  metricId?: number;
  scoredUserId?: number;
  scorerId?: number;
}

export interface GetTargetsParams {
  page?: number;
  limit?: number;
  periodId?: number;
  metricId?: number;
}

export interface GetPeriodsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ============ KPI Tracker Service Factory ============

const createKpiTrackerService = () => {
  // ── Scores ──────────────────────────────────────────────────────────────────

  const getScores = async (
    params: GetScoresParams = {},
  ): Promise<PaginatedKpiScoresResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.periodId)
        searchParams.set("periodId", String(params.periodId));
      if (params.metricId)
        searchParams.set("metricId", String(params.metricId));
      if (params.scoredUserId)
        searchParams.set("scoredUserId", String(params.scoredUserId));
      if (params.scorerId)
        searchParams.set("scorerId", String(params.scorerId));

      const query = searchParams.toString();
      const url = query ? `${KPI_SCORES_LIST}?${query}` : KPI_SCORES_LIST;

      const response =
        await interceptedAxios.get<PaginatedKpiScoresResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getScoreById = async (id: number): Promise<KpiScoreApiResponse> => {
    try {
      const url = KPI_SCORES_BY_ID.replace(":id", String(id));
      const response = await interceptedAxios.get<KpiScoreApiResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const updateScore = async (
    id: number,
    payload: UpdateScoreDto,
  ): Promise<KpiScoreApiResponse> => {
    try {
      const url = KPI_SCORES_BY_ID.replace(":id", String(id));
      const response = await interceptedAxios.put<KpiScoreApiResponse>(
        url,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const deleteScore = async (id: number): Promise<void> => {
    try {
      const url = KPI_SCORES_BY_ID.replace(":id", String(id));
      await interceptedAxios.delete(url);
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ── Targets ─────────────────────────────────────────────────────────────────

  const getTargets = async (
    params: GetTargetsParams = {},
  ): Promise<PaginatedKpiTargetsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.periodId)
        searchParams.set("periodId", String(params.periodId));
      if (params.metricId)
        searchParams.set("metricId", String(params.metricId));

      const query = searchParams.toString();
      const url = query ? `${KPI_TARGETS_LIST}?${query}` : KPI_TARGETS_LIST;

      const response =
        await interceptedAxios.get<PaginatedKpiTargetsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ── Periods ─────────────────────────────────────────────────────────────────

  const getPeriods = async (
    params: GetPeriodsParams = {},
  ): Promise<PaginatedKpiPeriodsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.search) searchParams.set("search", params.search);

      const query = searchParams.toString();
      const url = query ? `${KPI_PERIODS_LIST}?${query}` : KPI_PERIODS_LIST;

      const response =
        await interceptedAxios.get<PaginatedKpiPeriodsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ── Departments ─────────────────────────────────────────────────────────────

  const getDepartmentStats = async (): Promise<DepartmentsResponseDto> => {
    try {
      const response = await interceptedAxios.get<DepartmentsResponseDto>(
        KPI_STATISTICS_DEPARTMENTS,
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return {
    getScores,
    getScoreById,
    updateScore,
    deleteScore,
    getTargets,
    getPeriods,
    getDepartmentStats,
  };
};

const kpiTrackerService = createKpiTrackerService();

export { kpiTrackerService };
