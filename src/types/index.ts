// Employee types
export type EmploymentType = "PERMANENT" | "TEMPORARY" | "FORMER";
export type EmployeeStatus =
  | "present"
  | "absent"
  | "late"
  | "on-leave"
  | "active"
  | "inactive";

export interface KPIMetrics {
  productivity: number;
  quality: number;
  teamwork: number;
  punctuality: number;
}

export interface KPIHistoryEntry {
  month: string;
  year?: number;
  score: number;
}

export interface KPIProfile {
  currentScore: number;
  target: number;
  trend?: string;
  history?: KPIHistoryEntry[];
  metrics?: KPIMetrics;
  lastUpdated?: string;
}

export interface PayrollInfo {
  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  totalEarnings?: number;
  totalDeductions?: number;
  tax?: number;
  insurance?: number;
  pension?: number;
  otherDeductions?: number;
  bankAccount?: string;
  bankName?: string;
}

export type PayrollFormData = PayrollInfo & { month: number; year: number };

export interface Employee {
  id: number;
  name: string;
  email?: string;
  department: string;
  role?: string;
  position?: string;
  salary?: number;
  joinDate?: string;
  startDate?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  kpi?: KPIProfile;
  payroll?: PayrollInfo;
  payrollHistory?: PayrollHistoryRecord[];
  avatar?: string;
  phone?: string;
  employeeId?: string;
  nickname?: string;
  gender?: string;
  dateOfBirth?: string;
  domicile?: string;
  npwp?: string;
  ktp?: string;
  typeOfWork?: string;
  workStatus?: string;
  division?: string;
  level?: string;
}

export type EmployeeForm = Omit<Employee, "id"> & { id: number | null };

// Dashboard types
export interface DashboardStats {
  totalEmployees: number;
  todayAttendance: number;
  currentPayroll: number;
  averageKPI: number;
}

export interface AttendanceData {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface KPITrendData {
  month: string;
  value: number;
}

export interface PayrollByDepartment {
  labels: string[];
  data: number[];
}

// Attendance types
export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
  employeeId?: number;
  employeeName?: string;
  timezone?: string | null;
  timezoneLabel?: string;
}

export interface AttendanceSession {
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "checked-in" | "checked-out" | null;
}

// Payroll types
export interface SalaryBreakdown {
  basic?: number;
  allowance?: number;
  bonus?: number;
  deductions: number;
  netSalary?: number;
  basicSalary?: number;
  allowances?: number;
  totalEarnings?: number;
  totalSalary?: number;
}

// User types
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  role?: string;
}

// Leave types
export interface LeaveRecord {
  id?: number | null;
  type: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  status:
    | "Approved"
    | "Pending"
    | "Rejected"
    | "approved"
    | "pending"
    | "rejected"
    | "APPROVED"
    | "PENDING"
    | "REJECTED";
  reason?: string;
  employeeId?: number | null;
  employeeName?: string;
  date?: string;
  requestedDate?: string;
  approvalDate?: string | null;
  approvedBy?: string | null;
  availableBalance?: number;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining?: number;
  balance: number;
  isUnlimited?: boolean;
}

// Hiring types
export interface HiringStats {
  label: string;
  value: number;
  change?: string;
  note?: string;
}

export interface OpenPosition {
  id: number;
  title?: string;
  role?: string;
  department: string;
  location?: string;
  type?: string;
  posted?: string;
  applicants: number;
  status: string;
  manager?: string;
  stage?: string;
}

export interface CandidatePipeline {
  stage?: string;
  count?: number;
  name?: string;
  role?: string;
  score?: string;
}

export interface InterviewSchedule {
  id?: number;
  candidate: string;
  position?: string;
  role?: string;
  date?: string;
  time: string;
  interviewer?: string;
  interviewers?: string;
  type?: string;
}

export interface PayrollHistoryRecord {
  month: number;
  year: number;
  basic?: number;
  allowance?: number;
  bonus?: number;
  deductions?: number;
  netSalary?: number;
  totalEarnings?: number;
  totalDeductions?: number;
  basicSalary?: number;
  allowances?: number;
  tax?: number;
  insurance?: number;
  pension?: number;
  otherDeductions?: number;
}

// Settings types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PreferencesSettings {
  theme: "light" | "dark";
  language: string;
  timezone: string;
}

export interface SettingsState {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  notifications: NotificationSettings;
  theme: string;
  language: string;
}
