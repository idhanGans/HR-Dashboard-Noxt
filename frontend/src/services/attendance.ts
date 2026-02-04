import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  ATTENDANCE_CHECK_IN,
  ATTENDANCE_CHECK_OUT,
  ATTENDANCE_RECORDS,
  ATTENDANCE_RECORDS_SELF,
} from "./endpoints";
import type {
  AttendanceApiRecord,
  PaginatedAttendanceRecordsResponse,
} from "../types/api";

export interface AttendanceFilters {
  status?: "present" | "late" | "absent" | "all";
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
  userId?: number | "all";
}

export interface GetRecordsParams {
  page?: number;
  limit?: number;
  filters?: AttendanceFilters;
  isSuperadmin?: boolean;
}

export interface CheckInParams {
  timezone?: string;
}

const createAttendanceService = () => {
  const getRecords = async ({
    page = 1,
    limit = 50,
    filters,
    isSuperadmin = false,
  }: GetRecordsParams = {}): Promise<PaginatedAttendanceRecordsResponse> => {
    try {
      const basePath = isSuperadmin ? ATTENDANCE_RECORDS : ATTENDANCE_RECORDS_SELF;
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      if (filters) {
        if (filters.status && filters.status !== "all") {
          params.set("status", filters.status.toUpperCase());
        }
        if (filters.month && filters.year) {
          params.set("month", String(filters.month));
          params.set("year", String(filters.year));
        } else {
          if (filters.startDate) {
            params.set("startDate", filters.startDate);
          }
          if (filters.endDate) {
            params.set("endDate", filters.endDate);
          }
        }
        if (filters.userId && filters.userId !== "all") {
          params.set("userId", String(filters.userId));
        }
      }

      const response = await interceptedAxios.get<PaginatedAttendanceRecordsResponse>(
        `${basePath}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const checkIn = async (params?: CheckInParams): Promise<AttendanceApiRecord> => {
    try {
      const response = await interceptedAxios.post<AttendanceApiRecord>(
        ATTENDANCE_CHECK_IN,
        params?.timezone ? { timezone: params.timezone } : undefined
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const checkOut = async (): Promise<AttendanceApiRecord> => {
    try {
      const response = await interceptedAxios.post<AttendanceApiRecord>(
        ATTENDANCE_CHECK_OUT
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return { getRecords, checkIn, checkOut };
};

const attendanceService = createAttendanceService();

export { attendanceService };
