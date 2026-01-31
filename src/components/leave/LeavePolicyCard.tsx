import { useMemo } from "react";
import { Card } from "../Card";
import { useLeaveEntitlements } from "../../hooks/useLeaveEntitlements";
import type { LeaveEntitlementApi, LeaveType } from "../../types/api";

const DEFAULT_POLICIES = [
  { type: "Paid Leave", description: "12 days per year, fully paid" },
  { type: "Sick Leave", description: "8 days per year, fully paid" },
  { type: "Vacation", description: "10 days per year, must be approved" },
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
  const { entitlements, loading } = useLeaveEntitlements();

  const policyData = useMemo(() => {
    if (policies && policies.length) return policies;
    if (!entitlements.length) return DEFAULT_POLICIES;

    const labelByType: Record<LeaveType, string> = {
      PAID_LEAVE: "Paid Leave",
      UNPAID_LEAVE: "Unpaid Leave",
      SICK_LEAVE: "Sick Leave",
      URGENT_LEAVE: "Urgent Leave",
    };

    const suffixByType: Partial<Record<LeaveType, string>> = {
      PAID_LEAVE: "fully paid",
      SICK_LEAVE: "fully paid",
      UNPAID_LEAVE: "unpaid",
      URGENT_LEAVE: "must be approved",
    };

    return entitlements.map((entitlement: LeaveEntitlementApi) => {
      const label = labelByType[entitlement.type] ?? entitlement.type;
      const suffix = suffixByType[entitlement.type];
      const description = `${entitlement.entitledDays} days per year${
        suffix ? `, ${suffix}` : ""
      }`;

      return {
        type: label,
        description,
      };
    });
  }, [policies, entitlements]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Leave Policy</h2>
        {loading && (
          <span className="text-xs text-lightGrey">Syncing...</span>
        )}
      </div>
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
