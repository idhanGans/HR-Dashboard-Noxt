import { useState } from "react";
import { DashboardLayout } from "../components";
import {
  PayslipCard,
  PayrollSummary,
  PaymentInfoCard,
  DownloadPayslipButton,
  PayrollHeader,
} from "../components/payroll";
import { Card } from "../components";
import { useEmployees } from "../contexts/EmployeeContext";

/**
 * EmployeeSelector - Dropdown to select employee
 */
const EmployeeSelector = ({ employees, selectedId, onChange }) => (
  <Card className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      Select Employee
    </label>
    <select
      value={selectedId || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
    >
      <option value="">Choose an employee</option>
      {employees
        .filter((emp) => emp.employmentType !== "former")
        .map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} - {emp.department} ({emp.role})
          </option>
        ))}
    </select>
  </Card>
);

/**
 * MainPayslipSection - Main payslip display area
 */
const MainPayslipSection = ({ salaryBreakdown, employee }) => (
  <div className="lg:col-span-2">
    <PayslipCard salaryBreakdown={salaryBreakdown} employee={employee} />
  </div>
);

/**
 * SidebarSection - Sidebar with summary, download, and payment info
 */
const SidebarSection = ({ salaryBreakdown, employee, onDownload }) => (
  <div className="space-y-6">
    <PayrollSummary salaryBreakdown={salaryBreakdown} />
    <DownloadPayslipButton onDownload={onDownload} />
    <PaymentInfoCard employee={employee} />
  </div>
);

/**
 * PayrollPage - Payroll and salary slip page with employee selection
 */
export const PayrollPage = ({ onLogout, userName, userRole }) => {
  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const selectedEmployee = employees.find(
    (emp) => emp.id === selectedEmployeeId
  );

  const handleDownloadPayslip = () => {
    if (!selectedEmployee) {
      alert("Please select an employee first");
      return;
    }
    alert(`✓ Payslip for ${selectedEmployee.name} downloaded successfully!`);
  };

  // Convert employee payroll to salaryBreakdown format
  const salaryBreakdown = selectedEmployee?.payroll
    ? {
        basicSalary: selectedEmployee.payroll.basicSalary,
        allowances: selectedEmployee.payroll.allowances,
        bonus: selectedEmployee.payroll.bonus,
        deductions: selectedEmployee.payroll.deductions,
        totalSalary: selectedEmployee.payroll.netSalary,
      }
    : null;

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <PayrollHeader />

      <EmployeeSelector
        employees={employees}
        selectedId={selectedEmployeeId}
        onChange={setSelectedEmployeeId}
      />

      {selectedEmployee && salaryBreakdown ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MainPayslipSection
            salaryBreakdown={salaryBreakdown}
            employee={selectedEmployee}
          />
          <SidebarSection
            salaryBreakdown={salaryBreakdown}
            employee={selectedEmployee}
            onDownload={handleDownloadPayslip}
          />
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {employees.filter((e) => e.employmentType !== "former").length > 0
                ? "Please select an employee to view their payroll details"
                : "No active employees found"}
            </p>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};
