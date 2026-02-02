import { Card } from "../Card";

const PAID_LEAVE_DAYS_PER_MONTH = 1;

const DEFAULT_POLICIES = [
  // Leave policies descriptions are still temporary and default, TODO: Change to the final description
  {
    type: "Paid Leave",
    description: `${PAID_LEAVE_DAYS_PER_MONTH} day per month, plus any extra allocation`,
  },
  { type: "Sick Leave", description: "Leave granted due to illness/medical condition" },
  { type: "Urgent Leave", description: "Sudden and unforseen personal or family matters that require immediate attention" },
  { type: "Unpaid Leave", description: "Leave without pay, must be requested at least one day before the leave itself" },
];

/**
 * LeavePolicyCard - Displays leave policy information
 * @param {Array} policies - Array of policy objects with type and description
 */
export const LeavePolicyCard = ({
  policies,
}: {
  policies?: { type: string; description: string }[];
}) => {
  const policyData =
    policies && policies.length ? policies : DEFAULT_POLICIES;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Leave Policy</h2>
      </div>
      <div className="space-y-4 text-sm">
        {policyData.map((policy, idx) => (
          <div
            key={policy.type}
            className={
              idx < policyData.length - 1 ? "pb-4 border-b border-white/10" : ""
            }
          >
            <p className="text-white font-semibold mb-1">
              {policy.type}
            </p>
            <p className="text-lightGrey">{policy.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
