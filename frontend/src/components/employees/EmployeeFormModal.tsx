import { Modal } from "../Modal";
import { Button } from "../Button";
import { DropdownSelect } from "../DropdownSelect";
import { DepartmentSelect } from "./department";
import { useDepartments } from "../../hooks/useDepartments";
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
  userRole?: string;
}

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const typeOfWorkOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
];

const workStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TERMINATED", label: "Terminated" },
];

const levelOptions = [
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "MANAGER", label: "Manager" },
  { value: "DIRECTOR", label: "Director" },
];

const employmentTypeOptions = [
  { value: "PERMANENT", label: "Permanent" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "FORMER", label: "Former" },
];

const currentStatusOptions = [
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "absent", label: "Absent" },
];

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
  userRole = "EMPLOYEE",
}: EmployeeFormModalProps) => {
  const { data: departments = [] } = useDepartments();

  const handleChange = (field: string, value: string) => {
    onFormChange({ ...form, [field]: value });
  };

  const canEditDepartment =
    userRole === "SUPERADMIN" || userRole === "SUPERVISOR";

  const toSelectValue = (value?: string) =>
    value && value.length > 0 ? value : null;
  const handleSelectChange =
    (field: string) => (value: string | number | null) => {
      handleChange(field, value === null ? "" : String(value));
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
              <DropdownSelect
                value={toSelectValue(form.gender)}
                onChange={handleSelectChange("gender")}
                options={genderOptions}
                placeholder="Select Gender"
                showEmptyOption
                ariaLabel="Select gender"
              />
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
              <DropdownSelect
                value={toSelectValue(form.typeOfWork)}
                onChange={handleSelectChange("typeOfWork")}
                options={typeOfWorkOptions}
                placeholder="Select Type"
                showEmptyOption
                ariaLabel="Select type of work"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Work Status
              </label>
              <DropdownSelect
                value={toSelectValue(form.workStatus)}
                onChange={handleSelectChange("workStatus")}
                options={workStatusOptions}
                placeholder="Select Status"
                showEmptyOption
                ariaLabel="Select work status"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Department <span className="text-red-400">*</span>
              </label>
              <DepartmentSelect
                value={form.departmentId ?? null}
                onChange={(value) => {
                  const departmentId = value === null ? null : Number(value);
                  const selected = departments.find(
                    (dept) => dept.id === departmentId,
                  );
                  onFormChange({
                    ...form,
                    departmentId,
                    department: selected?.name ?? "",
                  });
                }}
                disabled={!canEditDepartment}
                placeholder="Select Department"
                showEmptyOption
                ariaLabel="Select department"
              />
              {!form.departmentId && (
                <p className="text-amber-400/70 text-xs mt-1">
                  Department is required
                </p>
              )}
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
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
              <DropdownSelect
                value={toSelectValue(form.level)}
                onChange={handleSelectChange("level")}
                options={levelOptions}
                placeholder="Select Level"
                showEmptyOption
                ariaLabel="Select level"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Employment Type
              </label>
              <DropdownSelect
                value={toSelectValue(form.employmentType)}
                onChange={handleSelectChange("employmentType")}
                options={employmentTypeOptions}
                placeholder="Select Type"
                showEmptyOption
                ariaLabel="Select employment type"
              />
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
              <DropdownSelect
                value={toSelectValue(form.status)}
                onChange={handleSelectChange("status")}
                options={currentStatusOptions}
                placeholder="Select Status"
                showEmptyOption
                ariaLabel="Select current status"
              />
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
          <Button
            onClick={onSave}
            className="w-full sm:w-auto"
            disabled={saving}
          >
            {saving ? "Saving..." : mode === "add" ? "Add Employee" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
