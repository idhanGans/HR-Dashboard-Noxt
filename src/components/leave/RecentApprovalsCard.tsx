import { Card } from "../Card";
import { StatusBadge } from "../StatusBadge";
import { RecentApprovalsSkeleton } from "../skeletons";
import type { LeaveRecord } from "../../types";
import { formatLeaveType } from "../../utils/leave";

type ApprovalItem = {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  approvalDate: string;
  status: string;
};

const buildDefaultApprovals = () => {
  const now = Date.now();
  const toDate = (timestamp: number) =>
    new Date(timestamp).toISOString().split("T")[0];

  return [
    {
      name: "Alice Johnson",
      type: "Paid Leave",
      startDate: toDate(now - 7 * 24 * 60 * 60 * 1000),
      endDate: toDate(now - 5 * 24 * 60 * 60 * 1000),
      approvalDate: toDate(now - 14 * 24 * 60 * 60 * 1000),
      status: "APPROVED",
    },
    {
      name: "Bob Smith",
      type: "Urgent Leave",
      startDate: toDate(now + 15 * 24 * 60 * 60 * 1000),
      endDate: toDate(now + 18 * 24 * 60 * 60 * 1000),
      approvalDate: toDate(now),
      status: "PENDING",
    },
    {
      name: "Carol White",
      type: "Sick Leave",
      startDate: toDate(now - 3 * 24 * 60 * 60 * 1000),
      endDate: toDate(now - 2 * 24 * 60 * 60 * 1000),
      approvalDate: toDate(now - 10 * 24 * 60 * 60 * 1000),
      status: "APPROVED",
    },
  ];
};

const DEFAULT_APPROVALS = buildDefaultApprovals();

/**
 * RecentApprovalsCard - Displays recent leave approvals with actual dates
 * @param {Array} approvals - Array of approval objects
 */
export const RecentApprovalsCard = ({
  approvals,
  isLoading = false,
}: {
  approvals?: ApprovalItem[] | LeaveRecord[];
  isLoading?: boolean;
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const approvalData = approvals || DEFAULT_APPROVALS;
  const approvedData = approvalData.filter(
    (item) => String(item.status).toLowerCase() === "approved",
  );

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Recent Approvals</h2>
      {isLoading ? (
        <RecentApprovalsSkeleton />
      ) : (
        <div className="space-y-4">
          {approvedData.map((item, idx) => {
            const isApprovalItem = "name" in item;
            const name = isApprovalItem
              ? item.name
              : item.employeeName || "Unknown Employee";
            const startDate = isApprovalItem
              ? item.startDate
              : item.startDate || item.date?.split(" to ")[0] || "";
            const endDate = isApprovalItem
              ? item.endDate
              : item.endDate || item.date?.split(" to ")[1] || "";
            const approvalDate = isApprovalItem
              ? item.approvalDate
              : item.approvalDate ||
                item.requestedDate ||
                new Date().toISOString().split("T")[0];

            return (
              <div
                key={idx}
                className="pb-3 border-b border-white/10 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{name}</p>
                    <p className="text-lightGrey text-xs">
                      {formatLeaveType(item.type)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-lightGrey">
                    {formatDateRange(startDate, endDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Approved on{" "}
                    {new Date(approvalDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
