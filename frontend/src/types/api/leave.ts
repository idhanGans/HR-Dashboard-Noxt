export type LeaveType =
  | "PAID_LEAVE"
  | "UNPAID_LEAVE"
  | "SICK_LEAVE"
  | "URGENT_LEAVE";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LeaveApiUser = {
  id: number;
  fullName: string;
  email: string;
};

export type LeaveApiRequest = {
  id: number;
  userId: number;
  type: LeaveType;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  days: number;
  reviewedById?: number | null;
  reviewedAt?: string | null;
  user?: LeaveApiUser;
  reviewedBy?: LeaveApiUser | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedLeaveRequestsResponse = {
  data: LeaveApiRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LeaveBalanceResponse = {
  type: LeaveType;
  entitledDays: number;
  usedDays: number;
  remainingDays: number;
  isUnlimited: boolean;
};

export type CreateLeaveRequestPayload = {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
};
