import { Card } from "../Card";
import { formatIDR } from "../../utils/format";

/**
 * PayrollSummary - Summary card showing total earnings, deductions, and net salary
 * @param {Object} salaryBreakdown - Salary breakdown object
 */
export const PayrollSummary = ({ salaryBreakdown }) => {
  const totalEarnings =
    salaryBreakdown.basicSalary +
    salaryBreakdown.allowances +
    salaryBreakdown.bonus;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-lightGrey text-sm mb-1">Total Earnings</p>
          <p className="text-xl font-bold text-white">
            {formatIDR(totalEarnings)}
          </p>
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="text-lightGrey text-sm mb-1">Total Deductions</p>
          <p className="text-xl font-bold text-red-400">
            {formatIDR(salaryBreakdown.deductions)}
          </p>
        </div>
        <div className="border-t border-white/10 pt-4 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg p-3">
          <p className="text-lightGrey text-sm mb-1">Net Salary</p>
          <p className="text-2xl font-bold text-green-400">
            {formatIDR(salaryBreakdown.totalSalary)}
          </p>
        </div>
      </div>
    </Card>
  );
};
