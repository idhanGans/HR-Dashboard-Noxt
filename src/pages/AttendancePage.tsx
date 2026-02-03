import { useCallback, useMemo, useState } from "react";
import {
  DashboardLayout,
  DropdownSelect,
  LeaveBalanceGridSkeleton,
  PaginationControls,
  TodayAttendanceSkeleton,
} from "../components";
import {
  CheckInCard,
  CheckOutCard,
  LiveSessionCard,
  AttendanceTable,
  CheckInModal,
  CheckOutModal,
  AttendanceHeader,
} from "../components/attendance";
import {
  LeaveBalanceCard,
  LeaveRequestsTable,
  LeavePolicyCard,
  RecentApprovalsCard,
  LeaveHeader,
  LeaveRequestModal,
} from "../components/leave";
import { EmployeeSelector } from "../components/employees";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
import { useAttendanceSession } from "../hooks/useAttendanceSession";
import { useEmployeeManagement } from "../hooks/useEmployeeManagement";
import { useEmployees } from "../hooks/useEmployees";
import { useLeaveManagement } from "../hooks/useLeaveManagement";
import { useAuth } from "../contexts/AuthContext";
import { hasRequiredRole } from "../utils/roles";
import { Calendar, Filter } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type {
  AttendanceRecord,
  Employee,
  LeaveBalance,
  LeaveRecord,
} from "../types";
import type { LayoutProps } from "../types/auth";

/**
 * ActionCardsGrid - Grid of check-in, check-out, and live session cards
 */
interface ActionCardsGridProps {
  isCheckedIn: boolean;
  checkInTime: number | null;
  elapsed: number;
  onCheckInClick: () => void;
  onCheckOutClick: () => void;
}

const ActionCardsGrid = ({
  isCheckedIn,
  checkInTime,
  elapsed,
  onCheckInClick,
  onCheckOutClick,
}: ActionCardsGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <CheckInCard isCheckedIn={isCheckedIn} onClick={onCheckInClick} />
    <CheckOutCard isCheckedIn={isCheckedIn} onClick={onCheckOutClick} />
    <LiveSessionCard
      isCheckedIn={isCheckedIn}
      checkInTime={checkInTime}
      elapsed={elapsed}
    />
  </div>
);


/**
 * LeaveBalanceGrid - Grid of leave balance cards
 */
const LeaveBalanceGrid = ({
  balances,
  isLoading = false,
}: {
  balances: LeaveBalance[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <LeaveBalanceGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {balances.map((leave) => (
        <LeaveBalanceCard key={leave.type} leave={leave} />
      ))}
    </div>
  );
};

const RowsSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextSize: number) => void;
}) => (
  <label className="flex items-center gap-2 text-sm text-lightGrey">
    <span>Rows</span>
    <DropdownSelect
      value={value}
      onChange={(nextValue) => {
        if (nextValue !== null) {
          onChange(Number(nextValue));
        }
      }}
      options={[25, 50, 100].map((s) => ({
        value: s,
        label: `${s}`,
      }))}
      ariaLabel="Rows per page"
      size="compact"
    />
  </label>
);

/**
 * AttendanceFilterSection - Filter controls for attendance records
 */
interface AttendanceFilterSectionProps {
  filterType: string;
  setFilterType: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  employeeFilter: string;
  setEmployeeFilter: (value: string) => void;
  employees: Employee[];
  showEmployeeFilter: boolean;
}

const filterTypeOptions = [
  { value: "all", label: "All Records" },
  { value: "date", label: "Date Range" },
  { value: "month", label: "Month" },
  { value: "status", label: "Status" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "absent", label: "Absent" },
];

const AttendanceFilterSection = ({
  filterType,
  setFilterType,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  statusFilter,
  setStatusFilter,
  employeeFilter,
  setEmployeeFilter,
  employees,
  showEmployeeFilter,
}: AttendanceFilterSectionProps) => {
  const employeeOptions = [
    { value: "all", label: "All Employees" },
    ...(employees?.map((emp) => ({
      value: String(emp.id),
      label: emp.name,
    })) ?? []),
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">
          Filter Attendance Records
        </h3>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          showEmployeeFilter ? "lg:grid-cols-5" : "lg:grid-cols-4"
        } gap-4`}
      >
        {/* Filter Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter By
          </label>
          <DropdownSelect
            value={filterType}
            onChange={(val) => setFilterType(String(val ?? "all"))}
            options={filterTypeOptions}
            ariaLabel="Filter type"
          />
        </div>

        {/* Employee Filter */}
        {showEmployeeFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Employee
            </label>
            <DropdownSelect
              value={employeeFilter}
              onChange={(val) => setEmployeeFilter(String(val ?? "all"))}
              options={employeeOptions}
              ariaLabel="Filter by employee"
            />
          </div>
        )}

        {/* Date Range - From */}
        {(filterType === "date" || filterType === "all") && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full h-11 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Date Range - To */}
        {(filterType === "date" || filterType === "all") && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full h-11 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Month Filter */}
        {filterType === "month" && (
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Month & Year
            </label>
            <input
              type="month"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full h-11 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Status Filter */}
        {(filterType === "status" || filterType === "all") && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <DropdownSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val ?? "all"))}
              options={statusOptions}
              ariaLabel="Filter by status"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * TodayAttendanceSection - Displays only today's attendance record
 */
const TodayAttendanceSection = ({
  todayRecord,
  isLoading = false,
}: {
  todayRecord?: AttendanceRecord;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <TodayAttendanceSkeleton />;
  }

  if (!todayRecord) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-green-400" />
          <h3 className="text-lg font-semibold text-white">
            Today's Attendance
          </h3>
        </div>
        <p className="text-gray-400">No attendance record for today yet.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-400 bg-green-400/10";
      case "late":
        return "text-yellow-400 bg-yellow-400/10";
      case "absent":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-green-400" />
        <h3 className="text-lg font-semibold text-white">Today's Attendance</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Date</p>
          <p className="text-lg font-semibold text-white">{todayRecord.date}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Check-in</p>
          <p className="text-lg font-semibold text-white">
            {todayRecord.checkIn}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Check-out</p>
          <p className="text-lg font-semibold text-white">
            {todayRecord.checkOut}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Timezone</p>
          <p className="text-lg font-semibold text-white">
            {todayRecord.timezoneLabel || "-"}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(todayRecord.status)}`}
          >
            {todayRecord.status}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * AttendancePage - Combined attendance tracking and leave management page
 */
export const AttendancePage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState<"attendance" | "leave">(
    "attendance",
  );
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  // Filter states
  const [filterType, setFilterTypeRaw] = useState("all");
  const [dateFrom, setDateFromRaw] = useState("");
  const [dateTo, setDateToRaw] = useState("");
  const [statusFilter, setStatusFilterRaw] = useState("all");
  const [employeeFilter, setEmployeeFilterRaw] = useState("all");
  const [leaveEmployeeId, setLeaveEmployeeId] = useState<number | null>(null);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceLimit, setAttendanceLimit] = useState(50);

  // Wrapper setters that reset page to 1 when filter changes
  const setFilterType = useCallback((value: string) => {
    setFilterTypeRaw(value);
    setAttendancePage(1);
  }, []);
  const setDateFrom = useCallback((value: string) => {
    setDateFromRaw(value);
    setAttendancePage(1);
  }, []);
  const setDateTo = useCallback((value: string) => {
    setDateToRaw(value);
    setAttendancePage(1);
  }, []);
  const setStatusFilter = useCallback((value: string) => {
    setStatusFilterRaw(value);
    setAttendancePage(1);
  }, []);
  const setEmployeeFilter = useCallback((value: string) => {
    setEmployeeFilterRaw(value);
    setAttendancePage(1);
  }, []);

  const { employees, updateEmployeeStatus } = useEmployees();
  const canFilterEmployees = hasRequiredRole(auth.role, ["SUPERADMIN"]);
  const isSuperadminRole = canFilterEmployees;
  const isCompactLabel = useMediaQuery("(max-width: 639px)");
  const {
    employeeList: employeeOptions,
    loading: employeeOptionsLoading,
    error: employeeOptionsError,
  } = useEmployeeManagement({ enabled: isSuperadminRole });

  // Parse month input (YYYY-MM) into month and year for backend
  const parsedMonth = useMemo(() => {
    if (filterType !== "month" || !dateFrom) return null;
    const [yearStr, monthStr] = dateFrom.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (Number.isFinite(year) && Number.isFinite(month)) {
      return { month, year };
    }
    return null;
  }, [filterType, dateFrom]);

  // Build attendance filters for backend
  const attendanceFilters = useMemo(() => {
    const filters: {
      status?: "present" | "late" | "absent" | "all";
      month?: number;
      year?: number;
      startDate?: string;
      endDate?: string;
      userId?: number | "all";
    } = {};

    // Status filter
    if (statusFilter !== "all") {
      filters.status = statusFilter as "present" | "late" | "absent";
    }

    // Date filters based on filterType
    if (filterType === "month" && parsedMonth) {
      filters.month = parsedMonth.month;
      filters.year = parsedMonth.year;
    } else if (filterType === "date" || filterType === "all") {
      // Send date range for both "date" and "all" filter types
      if (dateFrom) {
        filters.startDate = dateFrom;
      }
      if (dateTo) {
        filters.endDate = dateTo;
      }
    }

    // Employee filter (only for superadmin)
    if (canFilterEmployees && employeeFilter !== "all") {
      const userId = parseInt(employeeFilter, 10);
      if (Number.isFinite(userId)) {
        filters.userId = userId;
      }
    }

    return filters;
  }, [filterType, statusFilter, parsedMonth, dateFrom, dateTo, employeeFilter, canFilterEmployees]);

  const {
    records,
    total: attendanceTotal,
    totalPages: attendanceTotalPages,
    isLoading: attendanceLoading,
    isFetching: attendanceFetching,
    activeCheckInAt,
    currentUserId: attendanceUserId,
  } = useAttendanceRecords({
    currentEmployee: employees[0]
      ? { id: employees[0].id, name: employees[0].name }
      : undefined,
    page: attendancePage,
    limit: attendanceLimit,
    filters: attendanceFilters,
  });

  const {
    checkInTime,
    elapsed,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
  } = useAttendanceSession({
    currentUserId: attendanceUserId,
    initialCheckInAt: activeCheckInAt,
  });

  // Leave management
  const {
    leaveRecords,
    leaveBalance: leaveBalanceData,
    recentApprovals,
    isRequestModalOpen,
    setIsRequestModalOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedRequest,
    leaveForm,
    setLeaveForm,
    handleRequestLeave: openRequestModal,
    handleReviewRequest,
    handleApproveRequest,
    handleRejectRequest,
    handleSubmitLeaveRequest,
    getAvailableBalance,
    canRequestLeave,
    page: leavePage,
    total: leaveTotal,
    totalPages: leaveTotalPages,
    setPage: setLeavePage,
    limit: leaveLimit,
    setLimit: setLeaveLimit,
    requestsLoading: leaveRequestsLoading,
    balancesLoading: leaveBalancesLoading,
    approvalsLoading: leaveApprovalsLoading,
  } = useLeaveManagement({ employeeId: leaveEmployeeId ?? undefined });

  const attendanceBusy = attendanceLoading || attendanceFetching;
  const leaveRequestsBusy = leaveRequestsLoading;
  const leaveBalancesBusy = leaveBalancesLoading;
  const leaveApprovalsBusy = isSuperadminRole
    ? leaveApprovalsLoading
    : leaveRequestsLoading;

  const handleLeaveFormChange = (updates: Partial<LeaveRecord>) => {
    setLeaveForm((prev) => {
      const next = { ...prev, ...updates };
      if (updates?.type) {
        next.availableBalance = getAvailableBalance(updates.type);
      }
      return next;
    });
  };

  const onConfirmCheckIn = async () => {
    const errorMessage = await handleCheckIn();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    // Update employee status in context (assuming first employee is logged-in user)
    if (employees.length > 0) {
      updateEmployeeStatus(employees[0].id, "present");
    }
    setIsCheckInModalOpen(false);
  };

  const onConfirmCheckOut = async () => {
    const errorMessage = await handleCheckOut();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    // Status remains "present" after checkout
    setIsCheckOutModalOpen(false);
  };

  const handleRequestLeave = () => {
    if (!canRequestLeave) return;
    openRequestModal();
  };

  const onSubmitLeaveRequest = async () => {
    const message = await handleSubmitLeaveRequest();
    if (message) {
      alert(message);
      return;
    }
    alert("Leave request submitted successfully!");
  };

  const onApproveRequest = async (record: LeaveRecord) => {
    const message = await handleApproveRequest(record);
    if (message) {
      alert(message);
    }
  };

  const onRejectRequest = async (record: LeaveRecord) => {
    const message = await handleRejectRequest(record);
    if (message) {
      alert(message);
    }
  };

  const employeeLookup = useMemo(
    () =>
      employees.reduce(
        (acc, emp) => {
          acc[emp.id] = emp.name;
          return acc;
        },
        {} as Record<number, string>,
      ),
    [employees],
  );

  const recordsWithEmployee = useMemo(() => {
    if (!records.length) return [];

    return records.map((record, idx) => {
      const fallbackEmployee = employees.length
        ? employees[idx % employees.length]
        : undefined;
      const employeeId = record.employeeId ?? fallbackEmployee?.id;
      const employeeName =
        record.employeeName ??
        (employeeId ? employeeLookup[employeeId] : undefined) ??
        fallbackEmployee?.name ??
        "Unassigned";

      return { ...record, employeeId, employeeName };
    });
  }, [records, employees, employeeLookup]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Separate today's record from past records
  const todayRecord = recordsWithEmployee.find((r) => r.date === todayKey);

  // Records are now filtered by backend, just use recordsWithEmployee directly
  const filteredRecords = recordsWithEmployee;

  // Get leave balances for display
  const leaveBalancesForDisplay = Object.keys(leaveBalanceData).map((type) => {
    const balance = leaveBalanceData[type];
    const isUnlimited = balance?.isUnlimited ?? false;
    return {
      type,
      balance: isUnlimited ? 0 : balance.total - balance.used,
      used: balance.used,
      total: balance.total,
      isUnlimited,
    };
  });

  const approvalsForDisplay = isSuperadminRole
    ? leaveEmployeeId !== null
      ? recentApprovals.filter(
          (approval) => approval.employeeId === leaveEmployeeId,
        )
      : recentApprovals
    : leaveRecords;

  const approvedApprovalsForDisplay = approvalsForDisplay.filter(
    (approval) => String(approval.status).toLowerCase() === "approved",
  );

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "attendance"
              ? "text-white border-b-2 border-blue-400"
              : "text-lightGrey hover:text-white"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "leave"
              ? "text-white border-b-2 border-blue-400"
              : "text-lightGrey hover:text-white"
          }`}
        >
          Leave Management
        </button>
      </div>

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <>
          <AttendanceHeader />

          <ActionCardsGrid
            isCheckedIn={isCheckedIn}
            checkInTime={checkInTime}
            elapsed={elapsed}
            onCheckInClick={() => setIsCheckInModalOpen(true)}
            onCheckOutClick={() => setIsCheckOutModalOpen(true)}
          />

          {/* Today's Attendance */}
          <TodayAttendanceSection
            todayRecord={todayRecord}
            isLoading={attendanceBusy}
          />

          {/* Filter Section */}
          <AttendanceFilterSection
            filterType={filterType}
            setFilterType={setFilterType}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            employees={employeeOptions}
            showEmployeeFilter={canFilterEmployees}
          />

          {/* Attendance Records */}
          <div>
            <AttendanceTable
              records={filteredRecords}
              showEmployeeColumn={canFilterEmployees}
              isLoading={attendanceBusy}
              headerContent={
                <RowsSelector
                  value={attendanceLimit}
                  onChange={(nextSize) => {
                    setAttendanceLimit(nextSize);
                    setAttendancePage(1);
                  }}
                />
              }
            />
            <PaginationControls
              page={attendancePage}
              totalPages={attendanceTotalPages}
              totalItems={attendanceTotal}
              isLoading={attendanceBusy}
              onPageChange={(nextPage) =>
                setAttendancePage(Math.max(1, nextPage))
              }
            />
          </div>

          <CheckInModal
            isOpen={isCheckInModalOpen}
            onClose={() => setIsCheckInModalOpen(false)}
            onConfirm={onConfirmCheckIn}
          />

          <CheckOutModal
            isOpen={isCheckOutModalOpen}
            onClose={() => setIsCheckOutModalOpen(false)}
            onConfirm={onConfirmCheckOut}
          />
        </>
      )}

      {/* Leave Tab */}
      {activeTab === "leave" && (
        <>
          <LeaveHeader
            onRequestLeave={handleRequestLeave}
            canRequest={canRequestLeave}
          />

          {isSuperadminRole && (
            <EmployeeSelector
              employees={employeeOptions}
              selectedId={leaveEmployeeId}
              onChange={(employeeId) => {
                setLeaveEmployeeId(employeeId);
                setLeavePage(1);
              }}
              isCompactLabel={isCompactLabel}
              isLoading={employeeOptionsLoading}
              error={employeeOptionsError}
            />
          )}

          {(!isSuperadminRole || leaveEmployeeId !== null) && (
            <LeaveBalanceGrid
              balances={leaveBalancesForDisplay}
              isLoading={leaveBalancesBusy}
            />
          )}

          <LeaveRequestsTable
            records={leaveRecords}
            onReview={handleReviewRequest}
            onApprove={onApproveRequest}
            onReject={onRejectRequest}
            canReview={isSuperadminRole}
            isLoading={leaveRequestsBusy}
            headerContent={
              <RowsSelector
                value={leaveLimit}
                onChange={(nextSize) => {
                  setLeaveLimit(nextSize);
                  setLeavePage(1);
                }}
              />
            }
          />
          <PaginationControls
            page={leavePage}
            totalPages={leaveTotalPages}
            totalItems={leaveTotal}
            isLoading={leaveRequestsBusy}
            onPageChange={(nextPage) => setLeavePage(Math.max(1, nextPage))}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <LeavePolicyCard />
            <RecentApprovalsCard
              approvals={approvedApprovalsForDisplay}
              isLoading={leaveApprovalsBusy}
            />
          </div>

          {/* Leave Request Modal */}
          <LeaveRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            mode="request"
            leaveRequest={leaveForm}
            onChange={handleLeaveFormChange}
            onApprove={onSubmitLeaveRequest}
            onReject={() => setIsRequestModalOpen(false)}
          />

          {/* Leave Review Modal */}
          <LeaveRequestModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            mode="review"
            leaveRequest={leaveForm}
            onChange={handleLeaveFormChange}
            employeeName={selectedRequest?.employeeName}
            onApprove={() => {
              if (selectedRequest) {
                onApproveRequest(selectedRequest);
              }
            }}
            onReject={() => {
              if (selectedRequest) {
                onRejectRequest(selectedRequest);
              }
            }}
          />
        </>
      )}
    </DashboardLayout>
  );
};
