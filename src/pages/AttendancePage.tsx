import { useState } from "react";
import { DashboardLayout } from "../components";
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
} from "../components/leave";
import { useAttendanceSession } from "../hooks/useAttendanceSession";
import { leaveBalance, leaveRecords } from "../utils/dummyData";

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
 * PolicyAndApprovalsSection - Grid with policy and recent approvals
 */
const PolicyAndApprovalsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    <LeavePolicyCard />
    <RecentApprovalsCard />
  </div>
);

/**
 * AttendancePage - Combined attendance tracking and leave management page
 */
export const AttendancePage = ({ onLogout, userName, userRole }) => {
  const [activeTab, setActiveTab] = useState<"attendance" | "leave">(
    "attendance",
  );
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  const {
    records,
    checkInTime,
    elapsed,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
  } = useAttendanceSession();

  const onConfirmCheckIn = () => {
    handleCheckIn();
    setIsCheckInModalOpen(false);
  };

  const onConfirmCheckOut = () => {
    handleCheckOut();
    setIsCheckOutModalOpen(false);
  };

  const handleRequestLeave = () => {
    alert("Leave request form will open here");
  };

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

          <AttendanceTable records={records} />

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

          <LeaveBalanceGrid balances={leaveBalance} />

          <LeaveRequestsTable records={leaveRecords} />

          <PolicyAndApprovalsSection />
        </>
      )}
    </DashboardLayout>
  );
};
