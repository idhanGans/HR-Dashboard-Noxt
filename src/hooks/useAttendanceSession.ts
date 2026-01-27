import { useCallback, useEffect, useMemo, useState } from "react";
import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  ATTENDANCE_CHECK_IN,
  ATTENDANCE_CHECK_OUT,
  ATTENDANCE_RECORDS,
  ATTENDANCE_RECORDS_SELF,
} from "../services/endpoints";
import { useAuth } from "../contexts/AuthContext";
import { hasRequiredRole } from "../utils/roles";
import type { AttendanceRecord } from "../types";
import type {
  AttendanceApiRecord,
  PaginatedAttendanceRecordsResponse,
} from "../types/api";

const PAGE_SIZE = 100;

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
  fallbackName?: string,
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
  };
};

/**
 * useAttendanceSession - Custom hook for attendance session management
 */
export const useAttendanceSession = (currentEmployee?: {
  id?: number;
  name?: string;
}) => {
  const { auth } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCheckedIn = useMemo(() => !!checkInTime, [checkInTime]);
  const canManageRecords = hasRequiredRole(auth.role, ["SUPERADMIN"]);
  const fallbackName = currentEmployee?.name ?? auth.userName ?? "Current User";
  const currentUserId = auth.userId ?? currentEmployee?.id;

  // Tick elapsed timer while checked in
  useEffect(() => {
    if (!checkInTime) return;
    const id = setInterval(() => setElapsed(Date.now() - checkInTime), 1000);
    return () => clearInterval(id);
  }, [checkInTime]);

  const upsertRecord = useCallback((nextRecord: AttendanceRecord) => {
    setRecords((prev) => {
      const index = prev.findIndex(
        (record) =>
          record.employeeId === nextRecord.employeeId &&
          record.date === nextRecord.date,
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...nextRecord };
        return updated;
      }
      return [nextRecord, ...prev];
    });
  }, []);

  const fetchAttendanceRecords = useCallback(async () => {
    if (!auth.isAuthenticated) {
      setRecords([]);
      setCheckInTime(null);
      setElapsed(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    const basePath = canManageRecords
      ? ATTENDANCE_RECORDS
      : ATTENDANCE_RECORDS_SELF;

    try {
      const fetchPage = async (page: number) => {
        const path = `${basePath}?page=${page}&limit=${PAGE_SIZE}`;
        return interceptedAxios.get<PaginatedAttendanceRecordsResponse>(path);
      };

      const first = await fetchPage(1);
      let allRecords = [...first.data.data];
      const totalPages = first.data.totalPages ?? 1;

      if (totalPages > 1) {
        const pages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(index + 2),
          ),
        );
        const rest = pages.flatMap((page) => page.data.data);
        allRecords = [...allRecords, ...rest];
      }

      const mapped = allRecords.map((record) =>
        mapApiRecord(record, fallbackName),
      );
      setRecords(mapped);

      if (currentUserId) {
        const openRecord = allRecords.find(
          (record) => record.userId === currentUserId && !record.checkOutAt,
        );
        if (openRecord) {
          setCheckInTime(toValidDate(openRecord.checkInAt).getTime());
        } else {
          setCheckInTime(null);
          setElapsed(0);
        }
      }
    } catch (err) {
      setError(handleAxiosError(err));
      setRecords([]);
      setCheckInTime(null);
      setElapsed(0);
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, canManageRecords, currentUserId, fallbackName]);

  useEffect(() => {
    if (auth.isInitializing) return;
    fetchAttendanceRecords();
  }, [auth.isInitializing, fetchAttendanceRecords]);

  const handleCheckIn = useCallback(async (): Promise<string | null> => {
    if (!currentUserId) {
      const message = "Unable to determine user for check-in.";
      setError(message);
      return message;
    }

    setError(null);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await interceptedAxios.post<AttendanceApiRecord>(
        ATTENDANCE_CHECK_IN,
        timezone ? { timezone } : undefined,
      );

      const record = mapApiRecord(result.data, fallbackName);
      upsertRecord(record);
      setCheckInTime(toValidDate(result.data.checkInAt).getTime());
      setElapsed(0);
      return null;
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return message;
    }
  }, [currentUserId, fallbackName, upsertRecord]);

  const handleCheckOut = useCallback(async (): Promise<string | null> => {
    if (!currentUserId) {
      const message = "Unable to determine user for check-out.";
      setError(message);
      return message;
    }

    setError(null);
    try {
      const result = await interceptedAxios.post<AttendanceApiRecord>(
        ATTENDANCE_CHECK_OUT,
      );

      const record = mapApiRecord(result.data, fallbackName);
      upsertRecord(record);
      setCheckInTime(null);
      setElapsed(0);
      return null;
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return message;
    }
  }, [currentUserId, fallbackName, upsertRecord]);

  return {
    records,
    checkInTime,
    elapsed,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
    isLoading,
    error,
    refreshRecords: fetchAttendanceRecords,
  };
};
