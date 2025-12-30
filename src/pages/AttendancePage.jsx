import { useEffect, useMemo, useState } from "react";
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
import { attendanceRecords as seedRecords } from "../utils/dummyData";

const STORAGE_KEY = "hrdash-attendance-session";

/**
 * useAttendanceSession - Custom hook for attendance session management
 */
const useAttendanceSession = () => {
  const [records, setRecords] = useState(seedRecords);
  const [checkInTime, setCheckInTime] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { checkInTime: savedTs } = JSON.parse(saved);
        return savedTs || null;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  });
  const [elapsed, setElapsed] = useState(0);

  const isCheckedIn = useMemo(() => !!checkInTime, [checkInTime]);
  const todayKey = new Date().toISOString().slice(0, 10);

  // Tick elapsed timer while checked in
  useEffect(() => {
    if (!checkInTime) return;
    const id = setInterval(() => setElapsed(Date.now() - checkInTime), 1000);
    return () => clearInterval(id);
  }, [checkInTime]);

  const handleCheckIn = () => {
    const now = Date.now();
    setCheckInTime(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ checkInTime: now }));

    // Upsert today's record
    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.date === todayKey);
      const record = {
        date: todayKey,
        checkIn: new Date(now).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        checkOut: "-",
        status: "present",
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], ...record };
        return next;
      }
      return [record, ...prev];
    });
  };

  const handleCheckOut = () => {
    const now = Date.now();
    const fmtTime = (ts) =>
      ts
        ? new Date(ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";

    // Update today's record
    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.date === todayKey);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          checkOut: new Date(now).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "present",
        };
        return next;
      }
      // If no record exists yet, create one with current times
      return [
        {
          date: todayKey,
          checkIn: fmtTime(checkInTime),
          checkOut: new Date(now).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "present",
        },
        ...prev,
      ];
    });

    // Clear session
    setCheckInTime(null);
    setElapsed(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    records,
    checkInTime,
    elapsed,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
  };
};

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
