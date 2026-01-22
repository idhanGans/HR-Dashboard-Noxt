import { useMemo, useState } from "react";
import type { LeaveRecord } from "../types";

type LeaveBalanceMap = Record<string, { total: number; used: number }>;

const EMPTY_LEAVE_REQUEST: LeaveRecord = {
  id: null,
  employeeId: null,
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
  status: "pending",
  requestedDate: new Date().toISOString().split("T")[0],
  approvalDate: null,
  approvedBy: null,
  availableBalance: 0,
};

const INITIAL_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Alice Johnson",
    date: "2024-12-25 to 2024-12-26",
    startDate: "2024-12-25",
    endDate: "2024-12-26",
    type: "Paid Leave",
    status: "approved",
    days: 2,
    requestedDate: "2024-12-15",
    approvalDate: "2024-12-16",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Bob Smith",
    date: "2024-11-20 to 2024-11-22",
    startDate: "2024-11-20",
    endDate: "2024-11-22",
    type: "Sick Leave",
    status: "approved",
    days: 3,
    requestedDate: "2024-11-18",
    approvalDate: "2024-11-19",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Carol White",
    date: "2024-10-15 to 2024-10-18",
    startDate: "2024-10-15",
    endDate: "2024-10-18",
    type: "Vacation",
    status: "approved",
    days: 4,
    requestedDate: "2024-10-01",
    approvalDate: "2024-10-05",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "David Martinez",
    date: "2025-01-15 to 2025-01-18",
    startDate: "2025-01-15",
    endDate: "2025-01-18",
    type: "Vacation",
    status: "pending",
    days: 4,
    requestedDate: "2025-01-10",
    approvalDate: null,
  },
];

/**
 * useLeaveManagement - Custom hook for leave request management
 */
export const useLeaveManagement = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(
    INITIAL_LEAVE_RECORDS,
  );
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRecord | null>(
    null,
  );
  const [leaveForm, setLeaveForm] = useState<LeaveRecord>(EMPTY_LEAVE_REQUEST);

  // Leave balances by type
  const [leaveBalance] = useState<LeaveBalanceMap>({
    "Paid Leave": { total: 12, used: 4 },
    "Sick Leave": { total: 8, used: 3 },
    Vacation: { total: 10, used: 4 },
    "Unpaid Leave": { total: 0, used: 0 }, // Unlimited
  });

  // Calculate available balance for a specific leave type
  const getAvailableBalance = (leaveType: string) => {
    const balance = leaveBalance[leaveType];
    if (!balance) return 0;
    if (leaveType === "Unpaid Leave") return 999; // Unlimited
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
  const handleApproveRequest = (record: LeaveRecord) => {
    setLeaveRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status: "approved",
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
  };

  // Handle reject leave request
  const handleRejectRequest = (record: LeaveRecord) => {
    setLeaveRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status: "rejected",
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
  };

  // Handle submit new leave request
  const handleSubmitLeaveRequest = () => {
    if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate) {
      alert("Please fill all required fields");
      return;
    }

    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
    const available = getAvailableBalance(leaveForm.type);

    if (days > available && leaveForm.type !== "Unpaid Leave") {
      alert(
        `Insufficient leave balance. You have ${available} days available but need ${days} days.`,
      );
      return;
    }

    const newRequest: LeaveRecord = {
      id: Math.max(...leaveRecords.map((r) => r.id ?? 0), 0) + 1,
      employeeId: 1, // Assuming current user
      employeeName: "You",
      date: `${leaveForm.startDate} to ${leaveForm.endDate}`,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      type: leaveForm.type,
      reason: leaveForm.reason,
      status: "pending",
      days,
      requestedDate: new Date().toISOString().split("T")[0],
      approvalDate: null,
      approvedBy: null,
    };

    setLeaveRecords((prev) => [newRequest, ...prev]);
    setIsRequestModalOpen(false);
    setLeaveForm(EMPTY_LEAVE_REQUEST);
    alert("Leave request submitted successfully!");
  };

  // Get pending requests for admin
  const pendingRequests = useMemo(
    () => leaveRecords.filter((r) => r.status === "pending"),
    [leaveRecords],
  );

  // Get approved requests for employees
  const approvedRequests = useMemo(
    () => leaveRecords.filter((r) => r.status === "approved"),
    [leaveRecords],
  );

  return {
    leaveRecords,
    leaveBalance,
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
  };
};
