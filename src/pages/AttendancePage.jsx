import { useState } from "react";
import {
  Card,
  DashboardLayout,
  Button,
  Table,
  StatusBadge,
  Modal,
} from "../components";
import { attendanceRecords } from "../utils/dummyData";
import { Clock, LogOut } from "lucide-react";

// Attendance tracking page
export const AttendancePage = ({ onLogout }) => {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

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
    alert("✓ Check-in recorded successfully!");
    setIsCheckInModalOpen(false);
  };

  const handleCheckOut = () => {
    alert("✓ Check-out recorded successfully!");
    setIsCheckOutModalOpen(false);
  };

  return (
    <DashboardLayout userRole="Administrator" onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Attendance Management
        </h1>
        <p className="text-lightGrey">
          Track employee attendance and working hours.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Check-in</h3>
            <p className="text-sm text-lightGrey">Record your arrival time</p>
          </div>
          <Button
            onClick={() => setIsCheckInModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Clock size={18} />
            Check-in
          </Button>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Check-out</h3>
            <p className="text-sm text-lightGrey">Record your departure time</p>
          </div>
          <Button
            onClick={() => setIsCheckOutModalOpen(true)}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Check-out
          </Button>
        </Card>
      </div>

      {/* Attendance Records Table */}
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">
          Attendance Records
        </h2>
        <Table columns={columns} data={attendanceRecords} />
      </Card>

      {/* Check-in Modal */}
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

      {/* Check-out Modal */}
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
