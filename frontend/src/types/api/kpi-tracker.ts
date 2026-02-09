// =============================================================================
// KPI Tracker — Extended API Types
// =============================================================================

import type { KpiMetricApiResponse, KpiPeriodApiResponse } from "./kpi";

// ── Target Types ──────────────────────────────────────────────────────────────

export interface KpiTargetApiResponse {
  id: number;
  metricId: number;
  periodId: number;
  target: number;
  createdAt: string;
  updatedAt: string;
  metric?: KpiMetricApiResponse;
  period?: KpiPeriodApiResponse;
}

export interface PaginatedKpiTargetsResponse {
  data: KpiTargetApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTargetDto {
  metricId: number;
  periodId: number;
  target: number;
  organizationId?: number;
}

export interface UpdateTargetDto {
  target?: number;
}

// ── Extended Score Types (with relations) ─────────────────────────────────────

export interface ScoreWithRelationsApiResponse {
  id: number;
  periodId: number;
  metricId: number;
  scoredUserId: number;
  scorerId: number;
  score: number;
  createdAt: string;
  updatedAt: string;
  period?: KpiPeriodApiResponse;
  metric?: KpiMetricApiResponse;
  scoredUser?: ScoreUserInfo;
  scorer?: ScoreUserInfo;
}

export interface ScoreUserInfo {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface PaginatedScoresWithRelationsResponse {
  data: ScoreWithRelationsApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateScoreDto {
  score: number;
}

// ── Periods List Types ────────────────────────────────────────────────────────

export interface PaginatedKpiPeriodsListResponse {
  data: KpiPeriodApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── KPI Tracker Table Row ─────────────────────────────────────────────────────

export interface KPITableRow {
  scoreId: number;
  employeeName: string;
  employeeId: number;
  department: string;
  kpiName: string;
  metricId: number;
  target: number;
  actual: number;
  weight: number;
  score: number;
  status: KPIStatus;
}

export type KPIStatus = "Excellent" | "Good" | "Poor";

// ── Filter Types ──────────────────────────────────────────────────────────────

export interface KPITrackerFilters {
  search: string;
  departmentId: string | null;
  periodId: number | null;
}

// ── Department Types ──────────────────────────────────────────────────────────

export interface DepartmentOption {
  value: string;
  label: string;
}
