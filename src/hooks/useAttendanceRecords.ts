import { useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { hasRequiredRole } from "../utils/roles";
import { attendanceService, type AttendanceFilters } from "../services/attendance";
import type { AttendanceRecord } from "../types";
import type { AttendanceApiRecord } from "../types/api";
import { formatUtcOffset } from "../utils/timezone";

export const attendanceKeys = {
  all: ["attendance"] as const,
  records: () => [...attendanceKeys.all, "records"] as const,
  recordList: (filters: AttendanceFilters | undefined, page: number, limit: number, isSuperadmin: boolean) =>
    [...attendanceKeys.records(), { filters, page, limit, isSuperadmin }] as const,
  session: () => [...attendanceKeys.all, "session"] as const,
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const toValidDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const mapApiRecord = (
  record: AttendanceApiRecord,
  fallbackName?: string
): AttendanceRecord => {
  const checkInDate = toValidDate(record.checkInAt);
  const checkOutDate = record.checkOutAt ? toValidDate(record.checkOutAt) : null;
  const status = record.status ? record.status.toLowerCase() : "present";
  const normalizedStatus: AttendanceRecord["status"] =
    status === "present" || status === "late" || status === "absent"
      ? status
      : "present";

  return {
    date: formatDateKey(checkInDate),
    checkIn: normalizedStatus === "absent" ? "-" : formatTime(checkInDate),
    checkOut:
      normalizedStatus === "absent"
        ? "-"
        : checkOutDate
          ? formatTime(checkOutDate)
          : "-",
    status: normalizedStatus,
    employeeId: record.userId,
    employeeName: record.user?.fullName ?? fallbackName,
    timezone: record.timezone ?? null,
    timezoneLabel: formatUtcOffset(record.timezone ?? undefined, checkInDate),
  };
};

export interface UseAttendanceRecordsOptions {
  currentEmployee?: { id?: number; name?: string };
  page?: number;
  limit?: number;
  filters?: AttendanceFilters;
  enabled?: boolean;
}

interface AttendanceRecordsData {
  records: AttendanceRecord[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  activeCheckInAt: number | null;
}

export const useAttendanceRecords = (options?: UseAttendanceRecordsOptions) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const currentEmployee = options?.currentEmployee;
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const filters = options?.filters;
  const enabled = options?.enabled ?? true;

  const canManageRecords = hasRequiredRole(auth.role, ["SUPERADMIN"]);
  const fallbackName = currentEmployee?.name ?? auth.userName ?? "Current User";
  const currentUserId = auth.userId ?? currentEmployee?.id;

  const recordsQuery = useQuery({
    queryKey: attendanceKeys.recordList(filters, page, limit, canManageRecords),
    queryFn: () =>
      attendanceService.getRecords({
        page,
        limit,
        filters,
        isSuperadmin: canManageRecords,
      }),
    select: (response): AttendanceRecordsData => {
      const records = response.data.map((record) =>
        mapApiRecord(record, fallbackName)
      );

      let activeCheckInAt: number | null = null;
      if (currentUserId) {
        const openRecord = response.data.find(
          (record) => record.userId === currentUserId && !record.checkOutAt
        );
        if (openRecord) {
          activeCheckInAt = toValidDate(openRecord.checkInAt).getTime();
        }
      }

      return {
        records,
        total: response.total ?? records.length,
        totalPages: response.totalPages ?? 1,
        page: response.page,
        limit: response.limit,
        activeCheckInAt,
      };
    },
    enabled: enabled && auth.isAuthenticated && !auth.isInitializing,
    placeholderData: keepPreviousData,
  });

  const data = useMemo(
    () =>
      recordsQuery.data ?? {
        records: [],
        total: 0,
        totalPages: 1,
        page: 1,
        limit: 50,
        activeCheckInAt: null,
      },
    [recordsQuery.data]
  );

  const invalidateRecords = () => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.records() });
  };

  return {
    records: data.records,
    total: data.total,
    totalPages: data.totalPages,
    page: data.page,
    limit: data.limit,
    activeCheckInAt: data.activeCheckInAt,
    currentUserId,
    isLoading: recordsQuery.isLoading,
    isFetching: recordsQuery.isFetching,
    error: recordsQuery.error?.message ?? null,
    refreshRecords: () => recordsQuery.refetch(),
    invalidateRecords,
  };
};

export type { AttendanceFilters };
