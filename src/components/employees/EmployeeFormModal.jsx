import { Modal } from "../Modal";
import { Button } from "../Button";

/**
 * EmployeeFormModal - Modal form for adding/editing employees
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {string} mode - "add" or "edit"
 * @param {Object} form - Form data object
 * @param {Function} onFormChange - Callback when form data changes
 * @param {Function} onSave - Callback when saving
 */
export const EmployeeFormModal = ({
  isOpen,
  onClose,
  mode,
  form,
  onFormChange,
  onSave,
}) => {
  const handleChange = (field, value) => {
    onFormChange({ ...form, [field]: value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Employee" : "Edit Employee"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white mb-1">Full Name</label>
            <input
              className="glass-input w-full"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Employee name"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Department</label>
            <input
              className="glass-input w-full"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="e.g., Engineering"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white mb-1">Role</label>
            <input
              className="glass-input w-full"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g., Backend Engineer"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Start Date</label>
            <input
              type="date"
              className="glass-input w-full"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              className="glass-input w-full"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Phone</label>
            <input
              className="glass-input w-full"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+62 ..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white mb-1">
              Employment Type
            </label>
            <select
              className="glass-input w-full"
              value={form.employmentType}
              onChange={(e) => handleChange("employmentType", e.target.value)}
            >
              <option value="permanent">Permanent</option>
              <option value="temporary">Temporary</option>
              <option value="former">Former</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white mb-1">
              Current Status
            </label>
            <select
              className="glass-input w-full"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {mode === "add" ? "Add" : "Save"} Employee
          </Button>
        </div>
      </div>
    </Modal>
  );
};
