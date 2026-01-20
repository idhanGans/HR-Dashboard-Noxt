import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";

/**
 * AttendanceTable - Displays attendance records table
 * @param {Array} records - Array of attendance record objects
 */
export const AttendanceTable = ({ records }) => {
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

  return (
    <Card className="overflow-hidden">
      <h2 className="text-lg font-bold text-white mb-4">Attendance Records</h2>
      <Table columns={columns} data={records} mobileVariant="table" />
    </Card>
  );
};
