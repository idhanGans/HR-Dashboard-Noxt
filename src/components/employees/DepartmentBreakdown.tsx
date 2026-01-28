import { Card } from "../Card";
import type { OrganizationCount } from "../../types/api";

interface DepartmentBreakdownProps {
  organizationBreakdown: OrganizationCount[];
  totalEmployees: number;
}

/**
 * DepartmentBreakdown - Shows employee distribution by organization/department
 * @param {Array} organizationBreakdown - Array of organization counts from statistics
 * @param {number} totalEmployees - Total number of employees for percentage calculation
 */
export const DepartmentBreakdown = ({
  organizationBreakdown,
  totalEmployees,
}: DepartmentBreakdownProps) => {
  if (organizationBreakdown.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">
          Department Breakdown
        </h2>
        <p className="text-lightGrey text-sm">No departments available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">
        Department Breakdown
      </h2>
      <div className="space-y-4">
        {organizationBreakdown.map(({ name, count }) => {
          const percentage =
            totalEmployees > 0
              ? Math.min((count / totalEmployees) * 100, 100)
              : 0;

          return (
            <div key={name} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{name}</span>
                  <span className="text-lightGrey text-sm">
                    {count} employees
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
