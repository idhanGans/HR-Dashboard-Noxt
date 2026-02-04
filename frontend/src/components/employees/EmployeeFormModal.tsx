import { Modal } from "../Modal";
import { Button } from "../Button";
import type { Dispatch, SetStateAction } from "react";
import type { EmployeeForm } from "../../types";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  form: EmployeeForm;
  onFormChange: Dispatch<SetStateAction<EmployeeForm>>;
  onSave: () => void;
  saving?: boolean;
}

/**
 * EmployeeFormModal - Modal form for adding/editing employees
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {string} mode - "add" or "edit"
 * @param {Object} form - Form data object
 * @param {Function} onFormChange - Callback when form data changes
 * @param {Function} onSave - Callback when saving
 * @param {boolean} saving - Whether the form is currently saving
 */
export const EmployeeFormModal = ({
  isOpen,
  onClose,
  mode,
  form,
  onFormChange,
  onSave,
  saving = false,
}: EmployeeFormModalProps) => {
  const handleChange = (field: string, value: string) => {
    onFormChange({ ...form, [field]: value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Employee" : "Edit Employee"}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Personal Information Section */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Employee ID
              </label>
              <input
                className="glass-input w-full"
                value={form.employeeId || ""}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                placeholder="Auto-generated"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Full Name
              </label>
              <input
                className="glass-input w-full"
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Employee full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Nickname
              </label>
              <input
                className="glass-input w-full"
                value={form.nickname || ""}
                onChange={(e) => handleChange("nickname", e.target.value)}
                placeholder="Nickname"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Gender
              </label>
              <select
                className="glass-input w-full"
                value={form.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Date of Birth
              </label>
              <input
                type="date"
                className="glass-input w-full"
                value={form.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Domicile
              </label>
              <input
                className="glass-input w-full"
                value={form.domicile || ""}
                onChange={(e) => handleChange("domicile", e.target.value)}
                placeholder="City/Address"
              />
            </div>
          </div>
        </div>

        {/* Contact & Identity Section */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact & Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Email
              </label>
              <input
                className="glass-input w-full"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Phone
              </label>
              <input
                className="glass-input w-full"
                value={form.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+62 ..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                NPWP (Tax ID)
              </label>
              <input
                className="glass-input w-full"
                value={form.npwp || ""}
                onChange={(e) => handleChange("npwp", e.target.value)}
                placeholder="NPWP number"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                KTP (ID Number)
              </label>
              <input
                className="glass-input w-full"
                value={form.ktp || ""}
                onChange={(e) => handleChange("ktp", e.target.value)}
                placeholder="KTP number"
              />
            </div>
          </div>
        </div>

        {/* Work Information Section */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Work Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Type of Work
              </label>
              <select
                className="glass-input w-full"
                value={form.typeOfWork || ""}
                onChange={(e) => handleChange("typeOfWork", e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Work Status
              </label>
              <select
                className="glass-input w-full"
                value={form.workStatus || ""}
                onChange={(e) => handleChange("workStatus", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Division
              </label>
              <input
                className="glass-input w-full"
                value={form.division || ""}
                onChange={(e) => handleChange("division", e.target.value)}
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Position
              </label>
              <input
                className="glass-input w-full"
                value={form.role || ""}
                onChange={(e) => handleChange("role", e.target.value)}
                placeholder="e.g., Backend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Level
              </label>
              <select
                className="glass-input w-full"
                value={form.level || ""}
                onChange={(e) => handleChange("level", e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid-level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="MANAGER">Manager</option>
                <option value="DIRECTOR">Director</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Employment Type
              </label>
              <select
                className="glass-input w-full"
                value={form.employmentType || ""}
                onChange={(e) => handleChange("employmentType", e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="PERMANENT">Permanent</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="FORMER">Former</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Date of Join
              </label>
              <input
                type="date"
                className="glass-input w-full"
                value={form.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Current Status
              </label>
              <select
                className="glass-input w-full"
                value={form.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto" disabled={saving}>
            {saving
              ? "Saving..."
              : mode === "add"
                ? "Add Employee"
                : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
