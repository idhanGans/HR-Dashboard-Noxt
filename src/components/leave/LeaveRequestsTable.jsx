import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";

/**
 * LeaveRequestsTable - Displays leave request records in a table
 * @param {Array} records - Array of leave record objects
 */
export const LeaveRequestsTable = ({ records }) => {
  const columns = [
    { key: "date", label: "Date Range" },
    { key: "type", label: "Leave Type" },
    { key: "days", label: "Days" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <h2 className="text-lg font-bold text-white mb-4">Leave Requests</h2>
      <Table columns={columns} data={records} mobileVariant="table" />
    </Card>
  );
};
