// KPI Metric API Types
export interface KpiMetricApiResponse {
  id: number;
  name: string;
  description?: string;
  organizationId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedKpiMetricsResponse {
  data: KpiMetricApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// KPI Period API Types
export interface KpiPeriodApiResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  organizationId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedKpiPeriodsResponse {
  data: KpiPeriodApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// KPI Statistics API Types
export interface CompanyOverallResponseDto {
  overallScore: number;
  periodId: number;
  totalDepartments: number;
}

export interface TrendDataPointDto {
  periodId: number;
  periodName: string;
  averageScore: number;
}

export interface TrendsResponseDto {
  trends: TrendDataPointDto[];
  departmentId?: number;
}

export interface DepartmentKpiDto {
  departmentId: number;
  departmentName: string;
  averageScore: number;
  targetScore: number;
  periodId: number;
}

export interface DepartmentsResponseDto {
  departments: DepartmentKpiDto[];
  periodId: number;
}

export interface TopPerformerEmployeeDto {
  userId: number;
  userName: string;
  departmentName?: string;
  role?: string;
  averageScore: number;
  trend?: string;
}

export interface TopPerformersResponseDto {
  performers: TopPerformerEmployeeDto[];
  periodId: number;
  limit: number;
}

export interface PerformanceInsightDto {
  departmentName: string;
  score?: string;
  improvement?: string;
  note?: string;
}

export interface PerformanceInsightsResponseDto {
  topPerformer: PerformanceInsightDto;
  mostImproved: PerformanceInsightDto;
  needsAttention: PerformanceInsightDto;
  periodId: number;
}

// KPI Scoring API Types
export interface MetricScoreDto {
  metricId: number;
  score: number;
}

export interface BulkCreateScoreDto {
  periodId: number;
  scoredUserId: number;
  scores: MetricScoreDto[];
}

export interface BulkScoreResponseDto {
  created: number;
  updated: number;
  periodId: number;
  scoredUserId: number;
}

// KPI Score Response Types
export interface KpiScoreApiResponse {
  id: number;
  periodId: number;
  metricId: number;
  scoredUserId: number;
  scorerId: number;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedKpiScoresResponse {
  data: KpiScoreApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
