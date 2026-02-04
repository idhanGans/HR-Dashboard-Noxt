export const AUTH_LOGIN = "/auth/login";
export const AUTH_PROFILE = "/auth/profile";
export const AUTH_REFRESH = "/auth/refresh";

// Users/Employees
export const USERS_LIST = "/users";
export const USERS_CREATE = "/users";
export const USERS_UPDATE = "/users/:id";
export const USERS_STATISTICS = "/users/statistics";

// Payroll
export const PAYROLL_EMPLOYEE_LIST = "/users";
export const PAYROLL_BY_PERIOD = "/payroll/:userId";
export const PAYROLL_UPDATE = "/payroll/:userId";
export const PAYROLL_PAYSLIP = "/payroll/:userId/payslip";

// KPI Statistics
export const KPI_STATISTICS_OVERALL = "/kpi/statistics/overall";
export const KPI_STATISTICS_TRENDS = "/kpi/statistics/trends";
export const KPI_STATISTICS_DEPARTMENTS = "/kpi/statistics/departments";
export const KPI_STATISTICS_TOP_PERFORMERS = "/kpi/statistics/top-performers";
export const KPI_STATISTICS_INSIGHTS = "/kpi/statistics/insights";

// KPI Scores
export const KPI_SCORES_LIST = "/kpi/scores";
export const KPI_SCORES_BULK = "/kpi/scores/bulk";

// KPI Periods
export const KPI_PERIODS_CURRENT = "/kpi/periods/current";

// KPI Metrics
export const KPI_METRICS_LIST = "/kpi/metrics";
