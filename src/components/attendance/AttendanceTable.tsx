import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";
import type { ReactNode } from "react";
import type { AttendanceRecord } from "../../types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployeeColumn?: boolean;
  title?: string;
  headerContent?: ReactNode;
}

/**
 * AttendanceTable - Displays attendance records table
 * @param {Array} records - Array of attendance record objects
 */
export const AttendanceTable = ({
  records,
  showEmployeeColumn = true,
  title = "Attendance Records",
  headerContent,
}: AttendanceTableProps) => {
  const columns = [
    ...(showEmployeeColumn ? [{ key: "employeeName", label: "Employee" }] : []),
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check-in" },
    { key: "checkOut", label: "Check-out" },
    {
      key: "timezoneLabel",
      label: "Timezone",
      render: (row: AttendanceRecord) => row.timezoneLabel || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row: AttendanceRecord) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {headerContent}
      </div>
      <Table columns={columns} data={records} mobileVariant="table" />
    </Card>
  );
};
