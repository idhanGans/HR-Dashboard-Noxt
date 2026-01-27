export const AUTH_LOGIN = "/auth/login";
export const AUTH_PROFILE = "/auth/profile";
export const AUTH_REFRESH = "/auth/refresh";


// Payroll
export const PAYROLL_EMPLOYEE_LIST = "/users";
export const PAYROLL_BY_PERIOD = "/payroll/:userId";
export const PAYROLL_UPDATE = "/payroll/:userId";
export const PAYROLL_PAYSLIP = "/payroll/:userId/payslip";


// Attendance
export const ATTENDANCE_CHECK_IN = "/attendance/records/check-in";
export const ATTENDANCE_CHECK_OUT = "/attendance/records/check-out";
export const ATTENDANCE_RECORDS = "/attendance/records";
export const ATTENDANCE_RECORDS_SELF = "/attendance/records/me";

export const ATTENDANCE_LEAVES = "/attendance/leaves";
export const ATTENDANCE_LEAVES_BALANCE = "/attendance/leaves/balance";
export const ATTENDANCE_LEAVES_RECENT_APPROVALS = "/attendance/leaves/recent-approvals";
export const ATTENDANCE_LEAVES_ENTITLEMENTS = "/attendance/leaves/entitlements";
export const ATTENDANCE_LEAVES_SELF = "/attendance/leaves/me";
export const ATTENDANCE_LEAVES_APPROVE = "/attendance/leaves/:id/approve";
export const ATTENDANCE_LEAVES_REJECT = "/attendance/leaves/:id/reject";