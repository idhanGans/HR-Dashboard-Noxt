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
import { useAttendanceSession } from "../hooks/useAttendanceSession";

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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
 * AttendancePage - Attendance tracking page with live timer and persisted session
 */
export const AttendancePage = ({ onLogout, userName, userRole }) => {
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

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
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
    </DashboardLayout>
  );
};
