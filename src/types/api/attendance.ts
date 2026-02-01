export type AttendanceApiUser = {
  id: number;
  fullName: string;
  email: string;
};

export type AttendanceApiRecord = {
  id: number;
  userId: number;
  checkInAt: string;
  checkOutAt?: string | null;
  checkOutSource?: string;
  status?: "PRESENT" | "LATE" | "ABSENT";
  timezone?: string | null;
  user?: AttendanceApiUser;
  createdAt: string;
  updatedAt: string;
};

export type LeaveType = "PAID_LEAVE" | "UNPAID_LEAVE" | "SICK_LEAVE" | "URGENT_LEAVE";

export type LeaveEntitlementApi = {
  type: LeaveType;
  entitledDays: number;
};

export type PaginatedAttendanceRecordsResponse = {
  data: AttendanceApiRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
