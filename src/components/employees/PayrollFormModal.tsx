import { Modal } from "../Modal";
import { DropdownSelect } from "../DropdownSelect";
import { formatCurrency } from "../../utils/format";
import type { Dispatch, SetStateAction } from "react";
import type { Employee, PayrollFormData } from "../../types";

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

interface PayrollFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  payrollData: PayrollFormData;
  onPayrollChange: Dispatch<SetStateAction<PayrollFormData>>;
  onSave: () => void;
}

/**
 * PayrollFormModal - Modal for managing employee payroll
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {object} employee - Employee being edited
 * @param {object} payrollData - Current payroll form data
 * @param {function} onPayrollChange - Handler for payroll data changes
 * @param {function} onSave - Save handler
 */
export const PayrollFormModal = ({
  isOpen,
  onClose,
  employee,
  payrollData,
  onPayrollChange,
  onSave,
}: PayrollFormModalProps) => {
  if (!employee) return null;

  const handleFieldChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...payrollData, [field]: numValue };

    // Recalculate deductions and net salary
    const totalDeductions =
      field === "tax" ||
      field === "insurance" ||
      field === "pension" ||
      field === "otherDeductions"
        ? (updated.tax || 0) +
          (updated.insurance || 0) +
          (updated.pension || 0) +
          (updated.otherDeductions || 0)
        : updated.deductions || 0;

    const netSalary =
      (updated.basicSalary || 0) +
      (updated.allowances || 0) +
      (updated.bonus || 0) -
      totalDeductions;

    onPayrollChange({ ...updated, deductions: totalDeductions, netSalary });
  };

  const totalDeductions =
    (payrollData.tax || 0) +
    (payrollData.insurance || 0) +
    (payrollData.pension || 0) +
    (payrollData.otherDeductions || 0);

  const netSalary =
    (payrollData.basicSalary || 0) +
    (payrollData.allowances || 0) +
    (payrollData.bonus || 0) -
    totalDeductions;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Payroll - ${employee.name}`}
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
              {employee.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-white">{employee.name}</h3>
              <p className="text-sm text-gray-400">
                {employee.role} • {employee.department}
              </p>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Earnings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                value={payrollData.basicSalary || 0}
                onChange={(e) =>
                  handleFieldChange("basicSalary", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Allowances
              </label>
              <input
                type="number"
                value={payrollData.allowances || 0}
                onChange={(e) =>
                  handleFieldChange("allowances", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bonus
              </label>
              <input
                type="number"
                value={payrollData.bonus || 0}
                onChange={(e) => handleFieldChange("bonus", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Period</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Month
              </label>
              <DropdownSelect
                value={payrollData.month || new Date().getMonth() + 1}
                onChange={(nextValue) => {
                  if (nextValue !== null) {
                    onPayrollChange({
                      ...payrollData,
                      month: Number(nextValue),
                    });
                  }
                }}
                options={MONTH_OPTIONS}
                ariaLabel="Select payroll month"
                buttonClassName="py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year
              </label>
              <input
                type="number"
                value={payrollData.year || new Date().getFullYear()}
                onChange={(e) =>
                  onPayrollChange({
                    ...payrollData,
                    year: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="2026"
                min="2020"
                max="2030"
              />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Deductions</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax
              </label>
              <input
                type="number"
                value={payrollData.tax || 0}
                onChange={(e) => handleFieldChange("tax", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Insurance
              </label>
              <input
                type="number"
                value={payrollData.insurance || 0}
                onChange={(e) => handleFieldChange("insurance", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pension Fund
              </label>
              <input
                type="number"
                value={payrollData.pension || 0}
                onChange={(e) => handleFieldChange("pension", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Other Deductions
              </label>
              <input
                type="number"
                value={payrollData.otherDeductions || 0}
                onChange={(e) =>
                  handleFieldChange("otherDeductions", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-300 font-medium">
                  Total Deductions
                </span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Bank Details
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={payrollData.bankName || ""}
                onChange={(e) =>
                  onPayrollChange({ ...payrollData, bankName: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., Bank Central Asia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={payrollData.bankAccount || ""}
                onChange={(e) =>
                  onPayrollChange({
                    ...payrollData,
                    bankAccount: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., 1234567890"
              />
            </div>
          </div>
        </div>

        {/* Net Salary Display */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Net Salary</span>
            <span className="text-2xl font-bold text-white">
              {formatCurrency(netSalary)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-full sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold transition-all"
          >
            Save Payroll
          </button>
        </div>
      </div>
    </Modal>
  );
};
