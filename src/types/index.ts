// Employee types
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: "Active" | "On Leave" | "Inactive";
  kpi?: number;
  avatar?: string;
  phone?: string;
}

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
}

export interface AttendanceSession {
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "checked-in" | "checked-out" | null;
}

// Payroll types
export interface SalaryBreakdown {
  basic: number;
  allowance: number;
  bonus: number;
  deductions: number;
}

// User types
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
}

// Leave types
export interface LeaveRecord {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Approved" | "Pending" | "Rejected";
  reason: string;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

// Hiring types
export interface HiringStats {
  label: string;
  value: number;
  change: string;
}

export interface OpenPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
  applicants: number;
  status: string;
}

export interface CandidatePipeline {
  stage: string;
  count: number;
}

export interface InterviewSchedule {
  id: number;
  candidate: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  type: string;
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
