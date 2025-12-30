import { Card } from "../Card";
import { formatIDR } from "../../utils/format";

/**
 * PayslipCard - Main payslip display card with earnings and deductions
 * @param {Object} salaryBreakdown - Salary breakdown object
 */
export const PayslipCard = ({ salaryBreakdown }) => {
  const totalEarnings =
    salaryBreakdown.basicSalary +
    salaryBreakdown.allowances +
    salaryBreakdown.bonus;

  return (
    <Card className="p-8">
      {/* Header */}
      <PayslipHeader />

      {/* Earnings Section */}
      <EarningsSection
        basicSalary={salaryBreakdown.basicSalary}
        allowances={salaryBreakdown.allowances}
        bonus={salaryBreakdown.bonus}
        total={totalEarnings}
      />

      {/* Deductions Section */}
      <DeductionsSection deductions={salaryBreakdown.deductions} />

      {/* Net Salary */}
      <NetSalaryDisplay netSalary={salaryBreakdown.totalSalary} />
    </Card>
  );
};

/**
 * PayslipHeader - Header section of the payslip
 */
const PayslipHeader = () => {
  return (
    <div className="mb-8 pb-6 border-b border-white/10">
      <h2 className="text-2xl font-bold text-white mb-2">Salary Slip</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lightGrey text-sm">Period: December 2024</p>
          <p className="text-lightGrey text-sm">Employee ID: EMP-001</p>
        </div>
        <div className="text-right">
          <p className="text-lightGrey text-sm">Issue Date: 2024-12-24</p>
          <p className="text-lightGrey text-sm">Status: Processed</p>
        </div>
      </div>
    </div>
  );
};

/**
 * EarningsSection - Displays earnings breakdown
 */
const EarningsSection = ({ basicSalary, allowances, bonus, total }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Earnings</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-lightGrey">Basic Salary</span>
          <span className="text-white font-semibold">
            {formatIDR(basicSalary)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lightGrey">Allowances</span>
          <span className="text-white font-semibold">
            {formatIDR(allowances)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lightGrey">Bonus</span>
          <span className="text-white font-semibold">{formatIDR(bonus)}</span>
        </div>
      </div>
      <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
        <span className="text-white font-semibold">Total Earnings</span>
        <span className="text-white font-bold text-lg">{formatIDR(total)}</span>
      </div>
    </div>
  );
};

/**
 * DeductionsSection - Displays deductions breakdown
 */
const DeductionsSection = ({ deductions }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Deductions</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-lightGrey">Tax</span>
          <span className="text-white font-semibold">
            {formatIDR(deductions * 0.6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lightGrey">Insurance</span>
          <span className="text-white font-semibold">
            {formatIDR(deductions * 0.4)}
          </span>
        </div>
      </div>
      <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
        <span className="text-white font-semibold">Total Deductions</span>
        <span className="text-red-400 font-bold text-lg">
          {formatIDR(deductions)}
        </span>
      </div>
    </div>
  );
};

/**
 * NetSalaryDisplay - Displays net salary (take home pay)
 */
const NetSalaryDisplay = ({ netSalary }) => {
  return (
    <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-400/30 rounded-lg p-4 flex justify-between items-center">
      <span className="text-lg font-semibold text-white">
        Net Salary (Take Home)
      </span>
      <span className="text-2xl font-bold text-green-400">
        {formatIDR(netSalary)}
      </span>
    </div>
  );
};
