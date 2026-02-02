import { useCallback, useEffect, useMemo, useState } from "react";
import { handleAxiosError } from "../lib/axios";
import { useAuth } from "../contexts/AuthContext";
import {
  approveLeaveRequest,
  createLeaveRequest,
  fetchLeaveBalances,
  fetchLeaveRequests,
  fetchMyLeaveRequests,
  fetchRecentApprovals,
  rejectLeaveRequest,
} from "../services/leave";
import { LEAVE_TYPES } from "../utils/leave";
import type { LeaveRecord } from "../types";
import type {
  LeaveApiRequest,
  LeaveBalanceResponse,
  LeaveType,
} from "../types/api/leave";

type LeaveBalanceMap = Record<
  string,
  { total: number; used: number; isUnlimited?: boolean }
>;

const DEFAULT_PAGE_SIZE = 50;

const toDateOnly = (value?: string | null) => {
  if (!value) return "";
  if (value.length <= 10) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

const mapLeaveRecord = (
  record: LeaveApiRequest,
  fallbackName?: string,
): LeaveRecord => {
  const startDate = toDateOnly(record.startDate);
  const endDate = toDateOnly(record.endDate);
  return {
    id: record.id,
    employeeId: record.userId,
    employeeName: record.user?.fullName ?? fallbackName,
    type: record.type,
    startDate,
    endDate,
    date: startDate && endDate ? `${startDate} to ${endDate}` : undefined,
    reason: record.reason,
    status: record.status,
    days: record.days,
    requestedDate: toDateOnly(record.createdAt),
    approvalDate: record.reviewedAt ? toDateOnly(record.reviewedAt) : null,
    approvedBy: record.reviewedBy?.fullName ?? null,
  };
};

const buildBalanceMap = (
  balances: LeaveBalanceResponse[],
): LeaveBalanceMap =>
  LEAVE_TYPES.reduce<LeaveBalanceMap>((acc, type) => {
    const match = balances.find((entry) => entry.type === type);
    acc[type] = {
      total: match?.entitledDays ?? 0,
      used: match?.usedDays ?? 0,
      isUnlimited: match?.isUnlimited ?? type !== "PAID_LEAVE",
    };
    return acc;
  }, {});

const EMPTY_LEAVE_REQUEST: LeaveRecord = {
  id: null,
  employeeId: null,
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
  status: "PENDING",
  requestedDate: new Date().toISOString().split("T")[0],
  approvalDate: null,
  approvedBy: null,
  availableBalance: 0,
};

/**
 * useLeaveManagement - Custom hook for leave request management
 */
export const useLeaveManagement = (options?: { employeeId?: number }) => {
  const { auth } = useAuth();
  const employeeId = options?.employeeId;
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [recentApprovals, setRecentApprovals] = useState<LeaveRecord[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceMap>(
    buildBalanceMap([]),
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRecord | null>(
    null,
  );
  const [leaveForm, setLeaveForm] = useState<LeaveRecord>(EMPTY_LEAVE_REQUEST);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuperadmin = auth.role === "SUPERADMIN";
  const canRequestLeave =
    auth.role === "EMPLOYEE" || auth.role === "SUPERVISOR";
  const fallbackName = auth.userName ?? "Current User";

  // Calculate available balance for a specific leave type
  const getAvailableBalance = (leaveType: string) => {
    if (leaveType !== "PAID_LEAVE") return Number.POSITIVE_INFINITY;
    const balance = leaveBalance[leaveType];
    if (!balance) return 0;
    if (balance.isUnlimited) return Number.POSITIVE_INFINITY;
    return balance.total - balance.used;
  };

  // Calculate days between two dates
  const calculateDays = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1
    );
  };

  const upsertLeaveRecord = useCallback((nextRecord: LeaveRecord) => {
    setLeaveRecords((prev) => {
      const index = prev.findIndex((record) => record.id === nextRecord.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...nextRecord };
        return updated;
      }
      return [nextRecord, ...prev];
    });
  }, []);

  const updateRecentApprovals = useCallback((record: LeaveRecord | null) => {
    if (!record) return;
    const normalizedStatus =
      typeof record.status === "string" ? record.status.toLowerCase() : "";
    setRecentApprovals((prev) => {
      const filtered = prev.filter((item) => item.id !== record.id);
      if (normalizedStatus !== "approved") {
        return filtered;
      }
      return [record, ...filtered].slice(0, 10);
    });
  }, []);

  const loadLeaveData = useCallback(async () => {
    if (!auth.isAuthenticated) {
      setLeaveRecords([]);
      setRecentApprovals([]);
      setLeaveBalance(buildBalanceMap([]));
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestsPromise = isSuperadmin
        ? fetchLeaveRequests({
            page,
            limit,
            userId: employeeId,
          })
        : fetchMyLeaveRequests({ page, limit });

      const balancesPromise =
        canRequestLeave || (isSuperadmin && employeeId)
          ? fetchLeaveBalances(isSuperadmin ? employeeId : undefined)
          : Promise.resolve([] as LeaveBalanceResponse[]);

      const approvalsPromise = isSuperadmin
        ? fetchRecentApprovals(10)
        : Promise.resolve([] as LeaveApiRequest[]);

      const [requests, balances, approvals] = await Promise.all([
        requestsPromise,
        balancesPromise,
        approvalsPromise,
      ]);

      setLeaveRecords(
        requests.data.map((record) => mapLeaveRecord(record, fallbackName)),
      );
      setTotal(requests.total ?? requests.data.length);
      setTotalPages(requests.totalPages ?? 1);
      setLeaveBalance(buildBalanceMap(balances));
      setRecentApprovals(
        approvals.map((record) => mapLeaveRecord(record, fallbackName)),
      );
    } catch (err) {
      setError(handleAxiosError(err));
      setLeaveRecords([]);
      setRecentApprovals([]);
      setLeaveBalance(buildBalanceMap([]));
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [
    auth.isAuthenticated,
    canRequestLeave,
    employeeId,
    fallbackName,
    isSuperadmin,
    page,
    limit,
  ]);

  useEffect(() => {
    if (auth.isInitializing) return;
    loadLeaveData();
  }, [auth.isInitializing, loadLeaveData]);

  // Handle request leave button click
  const handleRequestLeave = () => {
    setLeaveForm({
      ...EMPTY_LEAVE_REQUEST,
      availableBalance: 0,
    });
    setIsRequestModalOpen(true);
  };

  // Handle review leave request
  const handleReviewRequest = (record: LeaveRecord) => {
    setSelectedRequest(record);
    setLeaveForm({
      ...record,
      availableBalance: getAvailableBalance(record.type),
    });
    setIsReviewModalOpen(true);
  };

  // Handle approve leave request
  const handleApproveRequest = async (
    record: LeaveRecord,
  ): Promise<string | null> => {
    if (!record.id) return "Leave request not found.";
    setError(null);
    try {
      const updated = await approveLeaveRequest(record.id);
      const mapped = mapLeaveRecord(updated, fallbackName);
      upsertLeaveRecord(mapped);
      updateRecentApprovals(mapped);
      setIsReviewModalOpen(false);
      setSelectedRequest(null);
      return null;
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return message;
    }
  };

  // Handle reject leave request
  const handleRejectRequest = async (
    record: LeaveRecord,
  ): Promise<string | null> => {
    if (!record.id) return "Leave request not found.";
    setError(null);
    try {
      const updated = await rejectLeaveRequest(record.id);
      const mapped = mapLeaveRecord(updated, fallbackName);
      upsertLeaveRecord(mapped);
      updateRecentApprovals(mapped);
      setIsReviewModalOpen(false);
      setSelectedRequest(null);
      return null;
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return message;
    }
  };

  // Handle submit new leave request
  const handleSubmitLeaveRequest = async (): Promise<string | null> => {
    if (
      !leaveForm.type ||
      !leaveForm.startDate ||
      !leaveForm.endDate ||
      !leaveForm.reason?.trim()
    ) {
      const message = "Please fill all required fields";
      setError(message);
      return message;
    }

    const reason = leaveForm.reason.trim();
    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
    const available = getAvailableBalance(leaveForm.type);

    if (leaveForm.type === "PAID_LEAVE" && days > available) {
      const message = `Insufficient paid leave balance. You have ${available} days available but need ${days} days.`;
      setError(message);
      return message;
    }

    setError(null);
    try {
      const created = await createLeaveRequest({
        type: leaveForm.type as LeaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason,
      });
      const mapped = mapLeaveRecord(created, fallbackName);
      if (page === 1) {
        upsertLeaveRecord(mapped);
      } else {
        setPage(1);
      }
      setIsRequestModalOpen(false);
      setLeaveForm(EMPTY_LEAVE_REQUEST);
      return null;
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return message;
    }
  };

  // Get pending requests for admin
  const pendingRequests = useMemo(
    () =>
      leaveRecords.filter(
        (r) => String(r.status).toLowerCase() === "pending",
      ),
    [leaveRecords],
  );

  // Get approved requests for employees
  const approvedRequests = useMemo(
    () =>
      leaveRecords.filter(
        (r) => String(r.status).toLowerCase() === "approved",
      ),
    [leaveRecords],
  );

  return {
    leaveRecords,
    leaveBalance,
    recentApprovals,
    isRequestModalOpen,
    setIsRequestModalOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedRequest,
    leaveForm,
    setLeaveForm,
    handleRequestLeave,
    handleReviewRequest,
    handleApproveRequest,
    handleRejectRequest,
    handleSubmitLeaveRequest,
    getAvailableBalance,
    calculateDays,
    pendingRequests,
    approvedRequests,
    isLoading,
    error,
    canRequestLeave,
    isSuperadmin,
    refreshLeaveData: loadLeaveData,
    page,
    total,
    totalPages,
    setPage,
    limit,
    setLimit,
  };
};
