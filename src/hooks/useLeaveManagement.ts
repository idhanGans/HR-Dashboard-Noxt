import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { leaveService, type LeaveQueryParams } from "../services/leave";
import { LEAVE_TYPES } from "../utils/leave";
import type { LeaveRecord } from "../types";
import type {
  LeaveApiRequest,
  LeaveBalanceResponse,
  LeaveType,
} from "../types/api/leave";

export const leaveKeys = {
  all: ["leave"] as const,
  requests: () => [...leaveKeys.all, "requests"] as const,
  requestList: (params: LeaveQueryParams, isSuperadmin: boolean) =>
    [...leaveKeys.requests(), { params, isSuperadmin }] as const,
  balances: () => [...leaveKeys.all, "balances"] as const,
  balance: (userId?: number) => [...leaveKeys.balances(), userId] as const,
  recentApprovals: () => [...leaveKeys.all, "recentApprovals"] as const,
};

type LeaveBalanceMap = Record<
  string,
  { total: number; used: number; isUnlimited?: boolean }
>;

const toDateOnly = (value?: string | null) => {
  if (!value) return "";
  if (value.length <= 10) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

const mapLeaveRecord = (
  record: LeaveApiRequest,
  fallbackName?: string
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

const buildBalanceMap = (balances: LeaveBalanceResponse[]): LeaveBalanceMap =>
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

export interface UseLeaveManagementOptions {
  employeeId?: number;
}

export const useLeaveManagement = (options?: UseLeaveManagementOptions) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const employeeId = options?.employeeId;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRecord | null>(null);
  const [leaveForm, setLeaveForm] = useState<LeaveRecord>(EMPTY_LEAVE_REQUEST);

  const isSuperadmin = auth.role === "SUPERADMIN";
  const canRequestLeave = auth.role === "EMPLOYEE" || auth.role === "SUPERVISOR";
  const fallbackName = auth.userName ?? "Current User";

  const queryParams: LeaveQueryParams = useMemo(
    () => ({
      page,
      limit,
      userId: isSuperadmin ? employeeId : undefined,
    }),
    [page, limit, isSuperadmin, employeeId]
  );

  const requestsQuery = useQuery({
    queryKey: leaveKeys.requestList(queryParams, isSuperadmin),
    queryFn: () =>
      isSuperadmin
        ? leaveService.getRequests(queryParams)
        : leaveService.getMyRequests({ page, limit }),
    select: (response) => ({
      records: response.data.map((r) => mapLeaveRecord(r, fallbackName)),
      total: response.total ?? response.data.length,
      totalPages: response.totalPages ?? 1,
    }),
    enabled: auth.isAuthenticated && !auth.isInitializing,
  });

  const balancesQuery = useQuery({
    queryKey: leaveKeys.balance(isSuperadmin ? employeeId : undefined),
    queryFn: () => leaveService.getBalances(isSuperadmin ? employeeId : undefined),
    select: buildBalanceMap,
    enabled:
      auth.isAuthenticated &&
      !auth.isInitializing &&
      (canRequestLeave || (isSuperadmin && !!employeeId)),
  });

  const approvalsQuery = useQuery({
    queryKey: leaveKeys.recentApprovals(),
    queryFn: () => leaveService.getRecentApprovals(10),
    select: (data) => data.map((r) => mapLeaveRecord(r, fallbackName)),
    enabled: auth.isAuthenticated && !auth.isInitializing && isSuperadmin,
  });

  const createMutation = useMutation({
    mutationFn: leaveService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.requests() });
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() });
    },
  });

  const approveMutation = useMutation({
    mutationFn: leaveService.approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.requests() });
      queryClient.invalidateQueries({ queryKey: leaveKeys.recentApprovals() });
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: leaveService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.requests() });
      queryClient.invalidateQueries({ queryKey: leaveKeys.recentApprovals() });
    },
  });

  const leaveRecords = useMemo(
    () => requestsQuery.data?.records ?? [],
    [requestsQuery.data?.records]
  );
  const total = requestsQuery.data?.total ?? 0;
  const totalPages = requestsQuery.data?.totalPages ?? 1;
  const leaveBalance = useMemo(
    () => balancesQuery.data ?? buildBalanceMap([]),
    [balancesQuery.data]
  );
  const recentApprovals = useMemo(
    () => approvalsQuery.data ?? [],
    [approvalsQuery.data]
  );

  const isLoading =
    requestsQuery.isLoading || balancesQuery.isLoading || approvalsQuery.isLoading;
  const requestsLoading = requestsQuery.isLoading || requestsQuery.isFetching;
  const balancesLoading = balancesQuery.isLoading || balancesQuery.isFetching;
  const approvalsLoading = approvalsQuery.isLoading || approvalsQuery.isFetching;
  const error =
    requestsQuery.error?.message ??
    balancesQuery.error?.message ??
    approvalsQuery.error?.message ??
    null;

  const getAvailableBalance = useCallback(
    (leaveType: string) => {
      if (leaveType !== "PAID_LEAVE") return Number.POSITIVE_INFINITY;
      const balance = leaveBalance[leaveType];
      if (!balance) return 0;
      if (balance.isUnlimited) return Number.POSITIVE_INFINITY;
      return balance.total - balance.used;
    },
    [leaveBalance]
  );

  const calculateDays = useCallback((startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  }, []);

  const pendingRequests = useMemo(
    () => leaveRecords.filter((r) => String(r.status).toLowerCase() === "pending"),
    [leaveRecords]
  );

  const approvedRequests = useMemo(
    () => leaveRecords.filter((r) => String(r.status).toLowerCase() === "approved"),
    [leaveRecords]
  );

  const handleRequestLeave = useCallback(() => {
    setLeaveForm({
      ...EMPTY_LEAVE_REQUEST,
      availableBalance: 0,
    });
    setIsRequestModalOpen(true);
  }, []);

  const handleReviewRequest = useCallback(
    (record: LeaveRecord) => {
      setSelectedRequest(record);
      setLeaveForm({
        ...record,
        availableBalance: getAvailableBalance(record.type),
      });
      setIsReviewModalOpen(true);
    },
    [getAvailableBalance]
  );

  const handleApproveRequest = useCallback(
    async (record: LeaveRecord): Promise<string | null> => {
      if (!record.id) return "Leave request not found.";
      try {
        await approveMutation.mutateAsync(record.id);
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : "Approval failed";
      }
    },
    [approveMutation]
  );

  const handleRejectRequest = useCallback(
    async (record: LeaveRecord): Promise<string | null> => {
      if (!record.id) return "Leave request not found.";
      try {
        await rejectMutation.mutateAsync(record.id);
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : "Rejection failed";
      }
    },
    [rejectMutation]
  );

  const handleSubmitLeaveRequest = useCallback(async (): Promise<string | null> => {
    if (
      !leaveForm.type ||
      !leaveForm.startDate ||
      !leaveForm.endDate ||
      !leaveForm.reason?.trim()
    ) {
      return "Please fill all required fields";
    }

    const reason = leaveForm.reason.trim();
    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
    const available = getAvailableBalance(leaveForm.type);

    if (leaveForm.type === "PAID_LEAVE" && days > available) {
      return `Insufficient paid leave balance. You have ${available} days available but need ${days} days.`;
    }

    try {
      await createMutation.mutateAsync({
        type: leaveForm.type as LeaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason,
      });
      setIsRequestModalOpen(false);
      setLeaveForm(EMPTY_LEAVE_REQUEST);
      if (page !== 1) {
        setPage(1);
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Request failed";
    }
  }, [leaveForm, calculateDays, getAvailableBalance, createMutation, page]);

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
    requestsLoading,
    balancesLoading,
    approvalsLoading,
    error,
    isSubmitting: createMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    canRequestLeave,
    isSuperadmin,
    page,
    total,
    totalPages,
    setPage,
    limit,
    setLimit,
    refreshLeaveData: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.all });
    },
  };
};
