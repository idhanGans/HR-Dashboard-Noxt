import { useEffect, useMemo, useState } from "react";
import { attendanceRecords as seedRecords } from "../utils/dummyData";

const STORAGE_KEY = "hrdash-attendance-session";

/**
 * useAttendanceSession - Custom hook for attendance session management
 */
export const useAttendanceSession = () => {
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