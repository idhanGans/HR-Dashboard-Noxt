import { interceptedAxios } from "../lib/axios";
import {
  ATTENDANCE_LEAVES,
  ATTENDANCE_LEAVES_APPROVE,
  ATTENDANCE_LEAVES_BALANCE,
  ATTENDANCE_LEAVES_RECENT_APPROVALS,
  ATTENDANCE_LEAVES_REJECT,
  ATTENDANCE_LEAVES_SELF,
} from "./endpoints";
import type {
  CreateLeaveRequestPayload,
  LeaveApiRequest,
  LeaveBalanceResponse,
  PaginatedLeaveRequestsResponse,
} from "../types/api/leave";

type LeaveQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: number;
};

const buildQueryString = (params?: LeaveQueryParams) => {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const fetchLeaveRequests = async (
  params?: LeaveQueryParams,
): Promise<PaginatedLeaveRequestsResponse> => {
  const response = await interceptedAxios.get<PaginatedLeaveRequestsResponse>(
    `${ATTENDANCE_LEAVES}${buildQueryString(params)}`,
  );
  return response.data;
};

export const fetchMyLeaveRequests = async (
  params?: Omit<LeaveQueryParams, "userId">,
): Promise<PaginatedLeaveRequestsResponse> => {
  const response = await interceptedAxios.get<PaginatedLeaveRequestsResponse>(
    `${ATTENDANCE_LEAVES_SELF}${buildQueryString(params)}`,
  );
  return response.data;
};

export const fetchLeaveBalances = async (
  userId?: number,
): Promise<LeaveBalanceResponse[]> => {
  const query = userId ? `?userId=${userId}` : "";
  const response =
    await interceptedAxios.get<LeaveBalanceResponse[]>(
      `${ATTENDANCE_LEAVES_BALANCE}${query}`,
    );
  return response.data;
};

export const fetchRecentApprovals = async (
  limit?: number,
): Promise<LeaveApiRequest[]> => {
  const query = limit ? `?limit=${limit}` : "";
  const response = await interceptedAxios.get<LeaveApiRequest[]>(
    `${ATTENDANCE_LEAVES_RECENT_APPROVALS}${query}`,
  );
  return response.data;
};

export const createLeaveRequest = async (
  payload: CreateLeaveRequestPayload,
): Promise<LeaveApiRequest> => {
  const response = await interceptedAxios.post<LeaveApiRequest>(
    ATTENDANCE_LEAVES,
    payload,
  );
  return response.data;
};

export const approveLeaveRequest = async (
  id: number,
): Promise<LeaveApiRequest> => {
  const response = await interceptedAxios.put<LeaveApiRequest>(
    ATTENDANCE_LEAVES_APPROVE.replace(":id", String(id)),
  );
  return response.data;
};

export const rejectLeaveRequest = async (
  id: number,
): Promise<LeaveApiRequest> => {
  const response = await interceptedAxios.put<LeaveApiRequest>(
    ATTENDANCE_LEAVES_REJECT.replace(":id", String(id)),
  );
  return response.data;
};
