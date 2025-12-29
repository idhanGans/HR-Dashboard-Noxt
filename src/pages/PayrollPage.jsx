import { Card, DashboardLayout, Button } from "../components";
import { salaryBreakdown } from "../utils/dummyData";
import { formatIDR } from "../utils/format";
import { Download } from "lucide-react";

// Payroll and salary slip page
export const PayrollPage = ({ onLogout, userName, userRole }) => {
  const handleDownloadPayslip = () => {
    alert("✓ Payslip downloaded successfully!");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Payroll Management
        </h1>
        <p className="text-lightGrey">
          View and manage salary information and payslips.
        </p>
      </div>

      {/* Payslip Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payslip */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">
                Salary Slip
              </h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lightGrey text-sm">
                    Period: December 2024
                  </p>
                  <p className="text-lightGrey text-sm">Employee ID: EMP-001</p>
                </div>
                <div className="text-right">
                  <p className="text-lightGrey text-sm">
                    Issue Date: 2024-12-24
                  </p>
                  <p className="text-lightGrey text-sm">Status: Processed</p>
                </div>
              </div>
            </div>

            {/* Earnings Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-lightGrey">Basic Salary</span>
                  <span className="text-white font-semibold">
                    {formatIDR(salaryBreakdown.basicSalary)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lightGrey">Allowances</span>
                  <span className="text-white font-semibold">
                    {formatIDR(salaryBreakdown.allowances)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lightGrey">Bonus</span>
                  <span className="text-white font-semibold">
                    {formatIDR(salaryBreakdown.bonus)}
                  </span>
                </div>
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                <span className="text-white font-semibold">Total Earnings</span>
                <span className="text-white font-bold text-lg">
                  {formatIDR(
                    salaryBreakdown.basicSalary +
                      salaryBreakdown.allowances +
                      salaryBreakdown.bonus
                  )}
                </span>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Deductions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-lightGrey">Tax</span>
                  <span className="text-white font-semibold">
                    {formatIDR(salaryBreakdown.deductions * 0.6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lightGrey">Insurance</span>
                  <span className="text-white font-semibold">
                    {formatIDR(salaryBreakdown.deductions * 0.4)}
                  </span>
                </div>
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                <span className="text-white font-semibold">
                  Total Deductions
                </span>
                <span className="text-red-400 font-bold text-lg">
                  {formatIDR(salaryBreakdown.deductions)}
                </span>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-400/30 rounded-lg p-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-white">
                Net Salary (Take Home)
              </span>
              <span className="text-2xl font-bold text-green-400">
                {formatIDR(salaryBreakdown.totalSalary)}
              </span>
            </div>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-lightGrey text-sm mb-1">Total Earnings</p>
                <p className="text-xl font-bold text-white">
                  {formatIDR(
                    salaryBreakdown.basicSalary +
                      salaryBreakdown.allowances +
                      salaryBreakdown.bonus
                  )}
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

          {/* Download Button */}
          <Button
            onClick={handleDownloadPayslip}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Payslip
          </Button>

          {/* Payment Info Card */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Payment Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-lightGrey mb-1">Bank Name</p>
                <p className="text-white font-medium">Global Finance Bank</p>
              </div>
              <div>
                <p className="text-lightGrey mb-1">Account Holder</p>
                <p className="text-white font-medium">John Doe</p>
              </div>
              <div>
                <p className="text-lightGrey mb-1">Account Number</p>
                <p className="text-white font-medium">****1234</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
