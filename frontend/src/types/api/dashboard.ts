export interface DashboardMonthlyAttendanceDto {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface DashboardKpiTrendPointDto {
  month: string;
  value: number;
}

export interface DashboardOverviewResponseDto {
  totalEmployees: number;
  todayAttendance: number;
  averageKpi: number;
  kpiPeriodId?: number;
  kpiPeriodName?: string;
  timezone: string;
  months: number;
  monthlyAttendance: DashboardMonthlyAttendanceDto[];
  kpiTrend: DashboardKpiTrendPointDto[];
}

