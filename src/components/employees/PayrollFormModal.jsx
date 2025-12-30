import { Modal } from "../Modal";
import { formatCurrency } from "../../utils/format";

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
}) => {
  if (!employee) return null;

  const handleFieldChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...payrollData, [field]: numValue };

    // Recalculate net salary
    const netSalary =
      updated.basicSalary +
      updated.allowances +
      updated.bonus -
      updated.deductions;

    onPayrollChange({ ...updated, netSalary });
  };

  const netSalary =
    (payrollData.basicSalary || 0) +
    (payrollData.allowances || 0) +
    (payrollData.bonus || 0) -
    (payrollData.deductions || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Payroll - ${employee.name}`}
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
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

        {/* Deductions */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Deductions</h4>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Deductions
            </label>
            <input
              type="number"
              value={payrollData.deductions || 0}
              onChange={(e) => handleFieldChange("deductions", e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="0"
            />
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
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold transition-all"
          >
            Save Payroll
          </button>
        </div>
      </div>
    </Modal>
  );
};
