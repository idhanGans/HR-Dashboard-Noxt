import { useState, useMemo } from "react";
import { DashboardLayout } from "../components";
import {
  CheckInCard,
  CheckOutCard,
  LiveSessionCard,
  AttendanceTable,
  CheckInModal,
  CheckOutModal,
  AttendanceHeader,
  AttendanceSummaryCard,
  AttendanceSummaryGrid,
} from "../components/attendance";
import {
  LeaveBalanceCard,
  LeaveRequestsTable,
  LeavePolicyCard,
  RecentApprovalsCard,
  LeaveHeader,
  LeaveRequestModal,
} from "../components/leave";
import { useAttendanceSession } from "../hooks/useAttendanceSession";
import { useEmployees } from "../hooks/useEmployees";
import { useLeaveManagement } from "../hooks/useLeaveManagement";
import {
  calculateMonthlySummary,
  calculateMonthlyAllEmployeesSummary,
} from "../utils/attendanceUtils";
import { Calendar, Filter } from "lucide-react";

/**
 * ActionCardsGrid - Grid of check-in, check-out, and live session cards
 */
const ActionCardsGrid = ({
  isCheckedIn,
  checkInTime,
  elapsed,
  onCheckInClick,
  onCheckOutClick,
}) => (
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
const LeaveBalanceGrid = ({ balances }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {balances.map((leave) => (
      <LeaveBalanceCard key={leave.type} leave={leave} />
    ))}
  </div>
);

/**
 * AttendanceFilterSection - Filter controls for attendance records
 */
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
}) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
    <div className="flex items-center gap-2 mb-6">
      <Filter size={20} className="text-blue-400" />
      <h3 className="text-lg font-semibold text-white">
        Filter Attendance Records
      </h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Filter Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Filter By
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="all" className="bg-gray-800">
            All Records
          </option>
          <option value="date" className="bg-gray-800">
            Date Range
          </option>
          <option value="month" className="bg-gray-800">
            Month
          </option>
          <option value="status" className="bg-gray-800">
            Status
          </option>
        </select>
      </div>

      {/* Employee Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Employee
        </label>
        <select
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="all" className="bg-gray-800">
            All Employees
          </option>
          {employees?.map((emp) => (
            <option key={emp.id} value={String(emp.id)} className="bg-gray-800">
              {emp.name}
            </option>
          ))}
        </select>
      </div>

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
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
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
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
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
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Status Filter */}
      {(filterType === "status" || filterType === "all") && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="all" className="bg-gray-800">
              All Status
            </option>
            <option value="present" className="bg-gray-800">
              Present
            </option>
            <option value="late" className="bg-gray-800">
              Late
            </option>
            <option value="absent" className="bg-gray-800">
              Absent
            </option>
          </select>
        </div>
      )}
    </div>
  </div>
);

/**
 * TodayAttendanceSection - Displays only today's attendance record
 */
const TodayAttendanceSection = ({ todayRecord }) => {
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

  const getStatusColor = (status) => {
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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
export const AttendancePage = ({ onLogout, userName, userRole }) => {
  const [activeTab, setActiveTab] = useState<"attendance" | "leave">(
    "attendance",
  );
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const { employees, updateEmployeeStatus } = useEmployees();

  const {
    records,
    checkInTime,
    elapsed,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
  } = useAttendanceSession(
    employees[0] ? { id: employees[0].id, name: employees[0].name } : undefined,
  );

  // Leave management
  const {
    leaveRecords,
    leaveBalance: leaveBalanceData,
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
  } = useLeaveManagement();

  const onConfirmCheckIn = () => {
    handleCheckIn();
    // Update employee status in context (assuming first employee is logged-in user)
    if (employees.length > 0) {
      updateEmployeeStatus(employees[0].id, "present");
    }
    setIsCheckInModalOpen(false);
  };

  const onConfirmCheckOut = () => {
    handleCheckOut();
    // Status remains "present" after checkout
    setIsCheckOutModalOpen(false);
  };

  const handleRequestLeave = () => {
    openRequestModal();
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

  // Get today's date in DD-MM-YYYY format
  const getTodayDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const today = getTodayDateFormatted();

  // Separate today's record from past records
  const todayRecord = recordsWithEmployee.find((r) => r.date === today);
  const pastRecords = recordsWithEmployee.filter((r) => r.date !== today);

  // Helper function to convert DD-MM-YYYY to Date for comparison
  const dateStringToDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  // Helper function to convert date input (YYYY-MM) to month-year for filtering
  const getMonthYearFromInput = (monthInput: string) => {
    const [year, month] = monthInput.split("-");
    return { year, month };
  };

  // Filter past records based on selected filters
  const filteredRecords = useMemo(() => {
    let filtered = [...pastRecords];

    if (filterType === "date" && dateFrom && dateTo) {
      const fromDate = dateStringToDate(dateFrom);
      const toDate = dateStringToDate(dateTo);
      filtered = filtered.filter((r) => {
        const recordDate = dateStringToDate(r.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });
    } else if (filterType === "month" && dateFrom) {
      // dateFrom format: YYYY-MM from month input
      const { year, month } = getMonthYearFromInput(dateFrom);
      filtered = filtered.filter((r) => {
        // Record date is DD-MM-YYYY
        const [day, recordMonth, recordYear] = r.date.split("-");
        return recordYear === year && recordMonth === month;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (employeeFilter !== "all") {
      filtered = filtered.filter((r) => {
        const idMatch = r.employeeId
          ? String(r.employeeId) === employeeFilter
          : false;
        const nameMatch = r.employeeName
          ? r.employeeName.toLowerCase() === employeeFilter.toLowerCase()
          : false;
        return idMatch || nameMatch;
      });
    }

    return filtered;
  }, [pastRecords, filterType, dateFrom, dateTo, statusFilter, employeeFilter]);

  // Calculate attendance summary when employee and month are selected
  const attendanceSummary = useMemo(() => {
    // If employee is selected and month is selected, show single employee monthly summary
    if (employeeFilter !== "all" && filterType === "month" && dateFrom) {
      const [year, month] = dateFrom.split("-");
      return calculateMonthlySummary(
        recordsWithEmployee,
        parseInt(employeeFilter),
        parseInt(year),
        parseInt(month),
      );
    }

    // If employee is selected and filtering by date range, show single employee summary for that range
    if (
      employeeFilter !== "all" &&
      filterType === "date" &&
      dateFrom &&
      dateTo
    ) {
      const fromDate = dateStringToDate(dateFrom);
      const toDate = dateStringToDate(dateTo);

      const filtered = recordsWithEmployee.filter((r) => {
        if (r.employeeId !== parseInt(employeeFilter)) return false;
        const recordDate = dateStringToDate(r.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });

      if (filtered.length === 0) return null;

      const presentDays = filtered.filter((r) => r.status === "present").length;
      const absentDays = filtered.filter((r) => r.status === "absent").length;
      const lateDays = filtered.filter((r) => r.status === "late").length;
      const totalDays = filtered.length;

      return {
        period: `${dateFrom} to ${dateTo}`,
        employeeName: filtered[0]?.employeeName || "Unknown",
        employeeId: parseInt(employeeFilter),
        presentDays,
        absentDays,
        lateDays,
        totalDays,
        expectedWorkingDays: totalDays, // Rough estimate
        attendanceRate: Math.round((presentDays / totalDays) * 100) || 0,
        records: filtered,
      };
    }

    return null;
  }, [recordsWithEmployee, employeeFilter, filterType, dateFrom, dateTo]);

  // Calculate all employees monthly summary when only month is selected
  const allEmployeesSummaries = useMemo(() => {
    if (
      employeeFilter === "all" &&
      filterType === "month" &&
      dateFrom &&
      employeeFilter === "all"
    ) {
      const [year, month] = dateFrom.split("-");
      return calculateMonthlyAllEmployeesSummary(
        recordsWithEmployee,
        parseInt(year),
        parseInt(month),
      );
    }
    return [];
  }, [recordsWithEmployee, employeeFilter, filterType, dateFrom]);

  // Get leave balances for display
  const leaveBalancesForDisplay = Object.keys(leaveBalanceData).map((type) => ({
    type,
    balance: leaveBalanceData[type].total - leaveBalanceData[type].used,
    used: leaveBalanceData[type].used,
    total: leaveBalanceData[type].total,
  }));

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
          <TodayAttendanceSection todayRecord={todayRecord} />

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
            employees={employees}
          />

          {/* Attendance Summary - Show single employee monthly summary */}
          {attendanceSummary && (
            <AttendanceSummaryCard summary={attendanceSummary} />
          )}

          {/* Attendance Summaries - Show all employees monthly summary */}
          {allEmployeesSummaries.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Monthly Summary for All Employees
              </h3>
              <AttendanceSummaryGrid summaries={allEmployeesSummaries} />
            </div>
          )}

          {/* Past Attendance Records */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Attendance History{" "}
              {filteredRecords.length > 0 &&
                `(${filteredRecords.length} records)`}
            </h3>
            <AttendanceTable records={filteredRecords} />
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
          <LeaveHeader onRequestLeave={handleRequestLeave} />

          <LeaveBalanceGrid balances={leaveBalancesForDisplay} />

          <LeaveRequestsTable
            records={leaveRecords}
            onReview={handleReviewRequest}
            onApprove={(record) => handleApproveRequest(record)}
            onReject={(record) => handleRejectRequest(record)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <LeavePolicyCard />
            <RecentApprovalsCard approvals={leaveRecords} />
          </div>

          {/* Leave Request Modal */}
          <LeaveRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            mode="request"
            leaveRequest={leaveForm}
            onApprove={handleSubmitLeaveRequest}
            onReject={() => setIsRequestModalOpen(false)}
          />

          {/* Leave Review Modal */}
          <LeaveRequestModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            mode="review"
            leaveRequest={leaveForm}
            employeeName={selectedRequest?.employeeName}
            onApprove={() => handleApproveRequest(selectedRequest)}
            onReject={() => handleRejectRequest(selectedRequest)}
          />
        </>
      )}
    </DashboardLayout>
  );
};
