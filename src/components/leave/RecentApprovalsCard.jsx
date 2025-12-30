import { Card } from "../Card";
import { StatusBadge } from "../StatusBadge";

/**
 * RecentApprovalsCard - Displays recent leave approvals
 * @param {Array} approvals - Array of approval objects
 */
export const RecentApprovalsCard = ({ approvals }) => {
  const defaultApprovals = [
    {
      name: "Alice Johnson",
      type: "Paid Leave",
      date: "Dec 25-26",
      status: "approved",
    },
    {
      name: "Bob Smith",
      type: "Vacation",
      date: "Jan 15-18",
      status: "pending",
    },
    {
      name: "Carol White",
      type: "Sick Leave",
      date: "Dec 20",
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
            <p className="text-xs text-lightGrey mt-2">{item.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
