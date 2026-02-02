import { useState } from "react";
import { DashboardLayout, DropdownSelect } from "../components";
import {
  PayslipCard,
  PayrollSummary,
  PaymentInfoCard,
  DownloadPayslipButton,
  PayrollHeader,
} from "../components/payroll";
import { EmployeeSelector, PayrollFormModal } from "../components/employees";
import { Card } from "../components";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { usePayrollData } from "../hooks/usePayrollData";
import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  PAYROLL_UPDATE,
} from "../services/endpoints";
import { downloadPayslip } from "../services/payroll";
import { getErrorMessage } from "../utils/errors";
import type {
  Employee,
  PayrollFormData,
  PayrollHistoryRecord,
  PayrollInfo,
  SalaryBreakdown,
} from "../types";
import type { PayrollApiResponse } from "../types/api";
import type { LayoutProps } from "../types/auth";

/**
 * MonthYearFilter - Dropdown to filter by month and year
 */
const MonthYearFilter = ({
  selectedMonth,
  selectedYear,
  onChange,
  employee,
}: {
  selectedMonth: number;
  selectedYear: number;
  onChange: (month: number, year: number) => void;
  employee?: Employee;
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
  const monthOptions = months.map((month, index) => ({
    value: index + 1,
    label: month,
  }));
  const yearOptions = [2024, 2025, 2026].map((year) => ({
    value: year,
    label: `${year}`,
  }));

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
        <DropdownSelect
          value={selectedMonth}
          onChange={(nextValue) => {
            if (nextValue !== null) {
              onChange(Number(nextValue), selectedYear);
            }
          }}
          options={monthOptions}
          ariaLabel="Select month"
        />
        <DropdownSelect
          value={selectedYear}
          onChange={(nextValue) => {
            if (nextValue !== null) {
              onChange(selectedMonth, Number(nextValue));
            }
          }}
          options={yearOptions}
          ariaLabel="Select year"
        />
      </div>
    </Card>
  );
};

/**
 * MainPayslipSection - Main payslip display area
 */
const MainPayslipSection = ({
  salaryBreakdown,
  employee,
  payrollData,
}: {
  salaryBreakdown: SalaryBreakdown;
  employee?: Employee;
  payrollData?: PayrollInfo | PayrollHistoryRecord | null;
}) => (
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
const SidebarSection = ({
  salaryBreakdown,
  employee,
  onDownload,
  onEdit,
  isDownloading,
  canManagePayroll,
  canDownloadPayslip,
}: {
  salaryBreakdown: SalaryBreakdown;
  employee?: Employee;
  onDownload: () => void;
  onEdit: () => void;
  isDownloading: boolean;
  canManagePayroll: boolean;
  canDownloadPayslip: boolean;
}) => (
  <div className="space-y-6">
    <PayrollSummary salaryBreakdown={salaryBreakdown} />

    {/* Edit Payroll Button */}
    {canManagePayroll && (
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
    )}

    {canDownloadPayslip && (
      <DownloadPayslipButton
        onDownload={onDownload}
        isLoading={isDownloading}
      />
    )}
    <PaymentInfoCard employee={employee} />
  </div>
);

/**
 * PayrollPage - Payroll and salary slip page with employee selection
 */

export const PayrollPage = ({ onLogout, userName, userRole }: LayoutProps) => {
  const {
    employees,
    employeesLoading,
    employeesError,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    payrollData,
    payrollLoading,
    payrollError,
    canManagePayroll,
    isSelfPayrollView,
    canDownloadPayslip,
    applyPayrollResponse,
  } = usePayrollData();
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isSavingPayroll, setIsSavingPayroll] = useState(false);
  const [isDownloadingPayslip, setIsDownloadingPayslip] = useState(false);
  const [payrollFormData, setPayrollFormData] = useState<PayrollFormData>({
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
    (emp) => emp.id === selectedEmployeeId,
  );


  const handleDownloadPayslip = async () => {
    if (!selectedEmployee || selectedEmployeeId === null) {
      alert("Please select an employee first");
      return;
    }
    if (!canDownloadPayslip) {
      alert("You do not have permission to download payslips");
      return;
    }
    if (isDownloadingPayslip) return;

    setIsDownloadingPayslip(true);
    try {
      await downloadPayslip({
        userId: selectedEmployeeId,
        month: selectedMonth,
        year: selectedYear,
        employeeName: selectedEmployee.name,
      });
    } catch (error) {
      alert(getErrorMessage(error, "Failed to download payslip"));
    } finally {
      setIsDownloadingPayslip(false);
    }
  };

  const handleEditPayroll = () => {
    if (!selectedEmployee) return;
    if (!canManagePayroll) {
      alert("You do not have permission to manage payroll");
      return;
    }

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

  const handleSavePayroll = async () => {
    if (!selectedEmployee || selectedEmployeeId === null || isSavingPayroll) {
      return;
    }
    if (!canManagePayroll) {
      alert("You do not have permission to manage payroll");
      return;
    }

    setIsSavingPayroll(true);
    const payloadMonth = payrollFormData.month;
    const payloadYear = payrollFormData.year;
    const payload = {
      baseSalary: payrollFormData.basicSalary,
      allowance: payrollFormData.allowances,
      bonuses: payrollFormData.bonus,
      tax: payrollFormData.tax,
      insurance: payrollFormData.insurance,
      pensionFund: payrollFormData.pension,
      otherDeductions: payrollFormData.otherDeductions,
    };

    try {
      let response: PayrollApiResponse;
      const updatePath = `${PAYROLL_UPDATE.replace(
        ":userId",
        String(selectedEmployeeId),
      )}?month=${payloadMonth}&year=${payloadYear}`;

      const result = await interceptedAxios.put<PayrollApiResponse>(
        updatePath,
        payload,
      );
      response = result.data;

      applyPayrollResponse(selectedEmployeeId, response, {
        bankName: payrollFormData.bankName,
        bankAccount: payrollFormData.bankAccount,
      });
      setSelectedMonth(payloadMonth);
      setSelectedYear(payloadYear);

      setIsPayrollModalOpen(false);
      alert("✓ Payroll updated successfully!");
    } catch (error) {
      alert(handleAxiosError(error));
    } finally {
      setIsSavingPayroll(false);
    }
  };

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Convert employee payroll to salaryBreakdown format
  const salaryBreakdown: SalaryBreakdown = payrollData
    ? {
        basicSalary: payrollData.basicSalary,
        allowances: payrollData.allowances,
        bonus: payrollData.bonus,
        deductions: payrollData.deductions ?? 0,
        totalSalary: payrollData.netSalary ?? 0,
        totalEarnings: payrollData.totalEarnings ?? 0,
      }
    : {
        basicSalary: 0,
        allowances: 0,
        bonus: 0,
        deductions: 0,
        totalSalary: 0,
        totalEarnings: 0,
      };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <PayrollHeader />

      {!isSelfPayrollView && (
        <EmployeeSelector
          employees={employees}
          selectedId={selectedEmployeeId}
          onChange={setSelectedEmployeeId}
          isCompactLabel={isCompactLabel}
          isLoading={employeesLoading}
          error={employeesError}
        />
      )}

      {selectedEmployee && (
        <MonthYearFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChange={handleMonthYearChange}
          employee={selectedEmployee}
        />
      )}

      {selectedEmployee && payrollLoading ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading payroll data...</p>
          </div>
        </Card>
      ) : selectedEmployee && payrollError ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{payrollError}</p>
          </div>
        </Card>
      ) : selectedEmployee && payrollData ? (
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
            isDownloading={isDownloadingPayslip}
            canManagePayroll={canManagePayroll}
            canDownloadPayslip={canDownloadPayslip}
          />
        </div>
      ) : selectedEmployee ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              No payroll data available for this period
            </p>
            {canManagePayroll ? (
              <button
                onClick={handleEditPayroll}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-white font-semibold transition-all"
              >
                Create Payroll Record
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                You do not have permission to create payroll records
              </p>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {employeesLoading
                ? "Loading employees..."
                : employees.filter((e) => e.employmentType !== "FORMER").length > 0
                  ? "Please select an employee to view their payroll details"
                  : employeesError
                    ? "Unable to load employees"
                    : "No active employees found"}
            </p>
          </div>
        </Card>
      )}

      {/* Payroll Form Modal */}
      <PayrollFormModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        employee={selectedEmployee ?? null}
        payrollData={payrollFormData}
        onPayrollChange={setPayrollFormData}
        onSave={handleSavePayroll}
      />
    </DashboardLayout>
  );
};
