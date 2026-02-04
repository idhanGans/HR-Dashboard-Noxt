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


// Attendance
export const ATTENDANCE_CHECK_IN = "/attendance/records/check-in";
export const ATTENDANCE_CHECK_OUT = "/attendance/records/check-out";
export const ATTENDANCE_RECORDS = "/attendance/records";
export const ATTENDANCE_RECORDS_SELF = "/attendance/records/me";

export const ATTENDANCE_LEAVES = "/attendance/leaves";
export const ATTENDANCE_LEAVES_BALANCE = "/attendance/leaves/balance";
export const ATTENDANCE_LEAVES_RECENT_APPROVALS = "/attendance/leaves/recent-approvals";
export const ATTENDANCE_LEAVES_SELF = "/attendance/leaves/me";
export const ATTENDANCE_LEAVES_APPROVE = "/attendance/leaves/:id/approve";
export const ATTENDANCE_LEAVES_REJECT = "/attendance/leaves/:id/reject";
