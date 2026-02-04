import { interceptedAxios, handleAxiosError } from "../lib/axios";
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

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: number;
}

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

const createLeaveService = () => {
  const getRequests = async (
    params?: LeaveQueryParams
  ): Promise<PaginatedLeaveRequestsResponse> => {
    try {
      const response = await interceptedAxios.get<PaginatedLeaveRequestsResponse>(
        `${ATTENDANCE_LEAVES}${buildQueryString(params)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getMyRequests = async (
    params?: Omit<LeaveQueryParams, "userId">
  ): Promise<PaginatedLeaveRequestsResponse> => {
    try {
      const response = await interceptedAxios.get<PaginatedLeaveRequestsResponse>(
        `${ATTENDANCE_LEAVES_SELF}${buildQueryString(params)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getBalances = async (userId?: number): Promise<LeaveBalanceResponse[]> => {
    try {
      const query = userId ? `?userId=${userId}` : "";
      const response = await interceptedAxios.get<LeaveBalanceResponse[]>(
        `${ATTENDANCE_LEAVES_BALANCE}${query}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getRecentApprovals = async (limit?: number): Promise<LeaveApiRequest[]> => {
    try {
      const query = limit ? `?limit=${limit}` : "";
      const response = await interceptedAxios.get<LeaveApiRequest[]>(
        `${ATTENDANCE_LEAVES_RECENT_APPROVALS}${query}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const createRequest = async (
    payload: CreateLeaveRequestPayload
  ): Promise<LeaveApiRequest> => {
    try {
      const response = await interceptedAxios.post<LeaveApiRequest>(
        ATTENDANCE_LEAVES,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const approveRequest = async (id: number): Promise<LeaveApiRequest> => {
    try {
      const response = await interceptedAxios.put<LeaveApiRequest>(
        ATTENDANCE_LEAVES_APPROVE.replace(":id", String(id))
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const rejectRequest = async (id: number): Promise<LeaveApiRequest> => {
    try {
      const response = await interceptedAxios.put<LeaveApiRequest>(
        ATTENDANCE_LEAVES_REJECT.replace(":id", String(id))
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return {
    getRequests,
    getMyRequests,
    getBalances,
    getRecentApprovals,
    createRequest,
    approveRequest,
    rejectRequest,
  };
};

const leaveService = createLeaveService();

export { leaveService };

export const fetchLeaveRequests = leaveService.getRequests;
export const fetchMyLeaveRequests = leaveService.getMyRequests;
export const fetchLeaveBalances = leaveService.getBalances;
export const fetchRecentApprovals = leaveService.getRecentApprovals;
export const createLeaveRequest = leaveService.createRequest;
export const approveLeaveRequest = leaveService.approveRequest;
export const rejectLeaveRequest = leaveService.rejectRequest;
