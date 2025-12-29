import { useEffect, useMemo, useState } from "react";
import {
  Card,
  DashboardLayout,
  Button,
  Table,
  StatusBadge,
  Modal,
} from "../components";
import { attendanceRecords as seedRecords } from "../utils/dummyData";
import { Clock, LogOut } from "lucide-react";

// Attendance tracking page with live timer and persisted session
export const AttendancePage = ({ onLogout, userName, userRole }) => {
  const STORAGE_KEY = "hrdash-attendance-session";
  const [records, setRecords] = useState(seedRecords);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
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
  }); // timestamp in ms
  const [elapsed, setElapsed] = useState(0); // ms

  const isCheckedIn = useMemo(() => !!checkInTime, [checkInTime]);
  const todayKey = new Date().toISOString().slice(0, 10);

  // Session restored via lazy state initializer above

  // Tick elapsed timer while checked in
  useEffect(() => {
    if (!checkInTime) return;
    const id = setInterval(() => setElapsed(Date.now() - checkInTime), 1000);
    return () => clearInterval(id);
  }, [checkInTime]);

  const fmtTime = (ts) =>
    ts
      ? new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-";

  const fmtHMS = (ms) => {
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const columns = [
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check-in" },
    { key: "checkOut", label: "Check-out" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

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

    setIsCheckInModalOpen(false);
  };

  const handleCheckOut = () => {
    const now = Date.now();

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

    setIsCheckOutModalOpen(false);
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Attendance Management
        </h1>
        <p className="text-lightGrey">
          Track employee attendance and working hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Check-in</h3>
            <p className="text-sm text-lightGrey">Record your arrival time</p>
          </div>
          <Button
            onClick={() => setIsCheckInModalOpen(true)}
            disabled={isCheckedIn}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock size={18} />
            {isCheckedIn ? "Already Checked-in" : "Check-in"}
          </Button>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Check-out</h3>
            <p className="text-sm text-lightGrey">Record your departure time</p>
          </div>
          <Button
            onClick={() => setIsCheckOutModalOpen(true)}
            disabled={!isCheckedIn}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={18} />
            Check-out
          </Button>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Live Session
            </h3>
            <p className="text-sm text-lightGrey">
              {isCheckedIn
                ? `Started: ${fmtTime(checkInTime)}`
                : "Not checked in yet"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-lightGrey mb-1">Elapsed</p>
            <p className="text-2xl font-bold text-white">
              {isCheckedIn ? fmtHMS(elapsed) : "00:00:00"}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-white mb-4">
          Attendance Records
        </h2>
        <Table columns={columns} data={records} />
      </Card>

      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Check-in"
      >
        <div className="space-y-4">
          <p className="text-white">
            <strong>Current Time:</strong> {new Date().toLocaleTimeString()}
          </p>
          <p className="text-lightGrey text-sm">
            Confirm your check-in for today?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCheckInModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCheckIn}>Confirm Check-in</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        title="Check-out"
      >
        <div className="space-y-4">
          <p className="text-white">
            <strong>Current Time:</strong> {new Date().toLocaleTimeString()}
          </p>
          <p className="text-lightGrey text-sm">
            Confirm your check-out for today?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCheckOutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCheckOut}>Confirm Check-out</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
