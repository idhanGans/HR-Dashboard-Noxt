import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { Eye, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { LeaveRecord } from "../../types";
import { formatLeaveType } from "../../utils/leave";

interface LeaveRequestsTableProps {
  records: LeaveRecord[];
  onReview?: (record: LeaveRecord) => void;
  onApprove?: (record: LeaveRecord) => void;
  onReject?: (record: LeaveRecord) => void;
  canReview?: boolean;
  title?: string;
  headerContent?: ReactNode;
}

/**
 * LeaveRequestsTable - Displays leave request records in a table with action buttons
 * @param {Array} records - Array of leave record objects
 * @param {Function} onReview - Callback when review button is clicked
 * @param {Function} onApprove - Callback when approve button is clicked
 * @param {Function} onReject - Callback when reject button is clicked
 */
export const LeaveRequestsTable = ({
  records,
  onReview,
  onApprove,
  onReject,
  canReview = false,
  title = "Leave Requests",
  headerContent,
}: LeaveRequestsTableProps) => {
  const columns = [
    { key: "employeeName", label: "Employee Name" },
    { key: "date", label: "Date Range" },
    {
      key: "type",
      label: "Leave Type",
      render: (row: LeaveRecord) => formatLeaveType(row.type),
    },
    { key: "days", label: "Days" },
    {
      key: "status",
      label: "Status",
      render: (row: LeaveRecord) => <StatusBadge status={row.status} />,
    },
    ...(canReview
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row: LeaveRecord) => {
              const normalizedStatus =
                typeof row.status === "string"
                  ? row.status.toLowerCase()
                  : "";
              return (
                <div className="flex items-center gap-2">
                  {normalizedStatus === "pending" && (
                    <>
                      <button
                        onClick={() => onReview?.(row)}
                        className="p-2 hover:bg-blue-400/20 rounded-lg transition-colors text-blue-400"
                        title="Review request"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onApprove?.(row)}
                        className="p-2 hover:bg-green-400/20 rounded-lg transition-colors text-green-400"
                        title="Approve request"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => onReject?.(row)}
                        className="p-2 hover:bg-red-400/20 rounded-lg transition-colors text-red-400"
                        title="Reject request"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  {normalizedStatus !== "pending" && (
                    <span className="text-xs text-gray-500">
                      No actions available
                    </span>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
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
