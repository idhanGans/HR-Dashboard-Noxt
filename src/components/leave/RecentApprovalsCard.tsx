import { Card } from "../Card";
import { StatusBadge } from "../StatusBadge";

/**
 * RecentApprovalsCard - Displays recent leave approvals with actual dates
 * @param {Array} approvals - Array of approval objects
 */
export const RecentApprovalsCard = ({ approvals }) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const defaultApprovals = [
    {
      name: "Alice Johnson",
      type: "Paid Leave",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      approvalDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "approved",
    },
    {
      name: "Bob Smith",
      type: "Vacation",
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      approvalDate: new Date().toISOString().split("T")[0],
      status: "pending",
    },
    {
      name: "Carol White",
      type: "Sick Leave",
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      approvalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "approved",
    },
  ];

  const approvalData = approvals || defaultApprovals;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Recent Approvals</h2>
      <div className="space-y-4">
        {approvalData.map((item, idx) => (
          <div
            key={idx}
            className="pb-3 border-b border-white/10 last:border-b-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-lightGrey text-xs">{item.type}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-lightGrey">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
              <p className="text-xs text-gray-500">
                {item.status === "approved" ? "Approved" : "Pending"} on{" "}
                {new Date(item.approvalDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
