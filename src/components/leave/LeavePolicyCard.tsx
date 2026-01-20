import { Card } from "../Card";

/**
 * LeavePolicyCard - Displays leave policy information
 * @param {Array} policies - Array of policy objects with type and description
 */
export const LeavePolicyCard = ({ policies }) => {
  const defaultPolicies = [
    { type: "Paid Leave", description: "12 days per year, fully paid" },
    { type: "Sick Leave", description: "8 days per year, fully paid" },
    { type: "Vacation", description: "10 days per year, must be approved" },
  ];

  const policyData = policies || defaultPolicies;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Leave Policy</h2>
      <div className="space-y-4 text-sm">
        {policyData.map((policy, idx) => (
          <div
            key={policy.type}
            className={
              idx < policyData.length - 1 ? "pb-4 border-b border-white/10" : ""
            }
          >
            <p className="text-white font-semibold mb-1">{policy.type}</p>
            <p className="text-lightGrey">{policy.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
