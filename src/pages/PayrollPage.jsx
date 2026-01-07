import { useState } from "react";
import { DashboardLayout } from "../components";
import {
  PayslipCard,
  PayrollSummary,
  PaymentInfoCard,
  DownloadPayslipButton,
  PayrollHeader,
} from "../components/payroll";
import { PayrollFormModal } from "../components/employees";
import { Card } from "../components";
import { useEmployees } from "../hooks/useEmployees";
import { useMediaQuery } from "../hooks/useMediaQuery";

/**
 * EmployeeSelector - Dropdown to select employee
 */
const EmployeeSelector = ({
  employees,
  selectedId,
  onChange,
  isCompactLabel,
}) => (
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
            {isCompactLabel
              ? `${emp.name} - ${emp.department}`
              : `${emp.name} - ${emp.department} (${emp.role})`}
          </option>
        ))}
    </select>
  </Card>
);

/**
 * MonthYearFilter - Dropdown to filter by month and year
 */
const MonthYearFilter = ({
  selectedMonth,
  selectedYear,
  onChange,
  employee,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate available periods from payroll history
  const availablePeriods = employee?.payrollHistory || [];

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Select Period
        </label>
        {availablePeriods.length > 0 && (
          <span className="text-xs text-gray-500">
            {availablePeriods.length} records available
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <select
          value={selectedMonth}
          onChange={(e) => onChange(parseInt(e.target.value), selectedYear)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => onChange(selectedMonth, parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
        >
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};

/**
 * MainPayslipSection - Main payslip display area
 */
const MainPayslipSection = ({ salaryBreakdown, employee, payrollData }) => (
  <div className="lg:col-span-2">
    <PayslipCard
      salaryBreakdown={salaryBreakdown}
      employee={employee}
      payrollData={payrollData}
    />
  </div>
);

/**
 * SidebarSection - Sidebar with summary, download, and payment info
 */
const SidebarSection = ({ salaryBreakdown, employee, onDownload, onEdit }) => (
  <div className="space-y-6">
    <PayrollSummary salaryBreakdown={salaryBreakdown} />

    {/* Edit Payroll Button */}
    <button
      onClick={onEdit}
      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      Edit Payroll
    </button>

    <DownloadPayslipButton onDownload={onDownload} />
    <PaymentInfoCard employee={employee} />
  </div>
);

/**
 * PayrollPage - Payroll and salary slip page with employee selection
 */
export const PayrollPage = ({ onLogout, userName, userRole }) => {
  const {
    employees,
    addPayrollHistory,
    getPayrollHistory,
    updateEmployeePayroll,
  } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollFormData, setPayrollFormData] = useState({
    basicSalary: 0,
    allowances: 0,
    bonus: 0,
    tax: 0,
    insurance: 0,
    pension: 0,
    otherDeductions: 0,
    deductions: 0,
    netSalary: 0,
    bankName: "",
    bankAccount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const isCompactLabel = useMediaQuery("(max-width: 639px)");

  const selectedEmployee = employees.find(
    (emp) => emp.id === selectedEmployeeId
  );

  // Get payroll data for selected month/year
  const getPayrollForPeriod = () => {
    if (!selectedEmployee) return null;

    // Try to get from history first
    const historyRecord = getPayrollHistory(
      selectedEmployeeId,
      selectedMonth,
      selectedYear
    );

    if (historyRecord) {
      return historyRecord;
    }

    // Fall back to current payroll if viewing current month
    const currentDate = new Date();
    if (
      selectedMonth === currentDate.getMonth() + 1 &&
      selectedYear === currentDate.getFullYear()
    ) {
      return selectedEmployee.payroll;
    }

    return null;
  };

  const payrollData = getPayrollForPeriod();

  const handleDownloadPayslip = () => {
    if (!selectedEmployee) {
      alert("Please select an employee first");
      return;
    }
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    alert(
      `✓ Payslip for ${selectedEmployee.name} (${
        monthNames[selectedMonth - 1]
      } ${selectedYear}) downloaded successfully!`
    );
  };

  const handleEditPayroll = () => {
    if (!selectedEmployee) return;

    // Populate form with current payroll data or defaults
    setPayrollFormData({
      basicSalary:
        payrollData?.basicSalary || selectedEmployee.payroll?.basicSalary || 0,
      allowances:
        payrollData?.allowances || selectedEmployee.payroll?.allowances || 0,
      bonus: payrollData?.bonus || selectedEmployee.payroll?.bonus || 0,
      tax: payrollData?.tax || selectedEmployee.payroll?.tax || 0,
      insurance:
        payrollData?.insurance || selectedEmployee.payroll?.insurance || 0,
      pension: payrollData?.pension || selectedEmployee.payroll?.pension || 0,
      otherDeductions:
        payrollData?.otherDeductions ||
        selectedEmployee.payroll?.otherDeductions ||
        0,
      deductions:
        payrollData?.deductions || selectedEmployee.payroll?.deductions || 0,
      netSalary:
        payrollData?.netSalary || selectedEmployee.payroll?.netSalary || 0,
      bankName: selectedEmployee.payroll?.bankName || "",
      bankAccount: selectedEmployee.payroll?.bankAccount || "",
      month: selectedMonth,
      year: selectedYear,
    });
    setIsPayrollModalOpen(true);
  };

  const handleSavePayroll = () => {
    if (!selectedEmployee) return;

    // Create history record
    const historyRecord = {
      month: payrollFormData.month,
      year: payrollFormData.year,
      basicSalary: payrollFormData.basicSalary,
      allowances: payrollFormData.allowances,
      bonus: payrollFormData.bonus,
      tax: payrollFormData.tax,
      insurance: payrollFormData.insurance,
      pension: payrollFormData.pension,
      otherDeductions: payrollFormData.otherDeductions,
      deductions: payrollFormData.deductions,
      netSalary: payrollFormData.netSalary,
    };

    // Add to history
    addPayrollHistory(selectedEmployeeId, historyRecord);

    // If this is the current month, also update the main payroll
    const currentDate = new Date();
    if (
      payrollFormData.month === currentDate.getMonth() + 1 &&
      payrollFormData.year === currentDate.getFullYear()
    ) {
      updateEmployeePayroll(selectedEmployeeId, {
        basicSalary: payrollFormData.basicSalary,
        allowances: payrollFormData.allowances,
        bonus: payrollFormData.bonus,
        tax: payrollFormData.tax,
        insurance: payrollFormData.insurance,
        pension: payrollFormData.pension,
        otherDeductions: payrollFormData.otherDeductions,
        deductions: payrollFormData.deductions,
        netSalary: payrollFormData.netSalary,
        bankName: payrollFormData.bankName,
        bankAccount: payrollFormData.bankAccount,
      });
    }

    setIsPayrollModalOpen(false);
    alert("✓ Payroll updated successfully!");
  };

  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Convert employee payroll to salaryBreakdown format
  const salaryBreakdown = payrollData
    ? {
        basicSalary: payrollData.basicSalary,
        allowances: payrollData.allowances,
        bonus: payrollData.bonus,
        deductions: payrollData.deductions,
        totalSalary: payrollData.netSalary,
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
        isCompactLabel={isCompactLabel}
      />

      {selectedEmployee && (
        <MonthYearFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChange={handleMonthYearChange}
          employee={selectedEmployee}
        />
      )}

      {selectedEmployee && salaryBreakdown ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MainPayslipSection
            salaryBreakdown={salaryBreakdown}
            employee={selectedEmployee}
            payrollData={payrollData}
          />
          <SidebarSection
            salaryBreakdown={salaryBreakdown}
            employee={selectedEmployee}
            onDownload={handleDownloadPayslip}
            onEdit={handleEditPayroll}
          />
        </div>
      ) : selectedEmployee ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              No payroll data available for this period
            </p>
            <button
              onClick={handleEditPayroll}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-white font-semibold transition-all"
            >
              Create Payroll Record
            </button>
          </div>
        </Card>
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

      {/* Payroll Form Modal */}
      <PayrollFormModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        employee={selectedEmployee}
        payrollData={payrollFormData}
        onPayrollChange={setPayrollFormData}
        onSave={handleSavePayroll}
      />
    </DashboardLayout>
  );
};
