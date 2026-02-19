import { Modal } from "../Modal";
import { Button } from "../Button";
import { DropdownSelect } from "../DropdownSelect";
import { DepartmentSelect } from "./department";
import { useDepartments } from "../../hooks/useDepartments";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
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
  // Initialize avatar from form, will sync when form.avatar changes
  const [avatarPreview, setAvatarPreview] = useState<string>(form.avatar || "");

  // Update avatar preview when form avatar changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (form.avatar) {
      setAvatarPreview(form.avatar);
    }
  }, [form.avatar]);

  const handleChange = (field: string, value: string) => {
    onFormChange({ ...form, [field]: value });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        handleChange("avatar", base64String);
      };
      reader.readAsDataURL(file);
    }
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
        {/* Avatar Upload Section */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white mb-4">Avatar</h3>

          <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
              )}
            </div>

            {/* File Upload Input */}
            <div className="w-full">
              <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                Upload Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                  disabled={saving}
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <Upload size={18} className="text-blue-400" />
                  <span className="text-sm text-lightGrey">
                    {avatarPreview ? "Change image" : "Click to upload image"}
                  </span>
                </label>
              </div>
              <p className="text-xs text-lightGrey mt-2">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            {/* Clear Avatar Button */}
            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview("");
                  handleChange("avatar", "");
                }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                disabled={saving}
              >
                Remove Avatar
              </button>
            )}
          </div>
        </div>

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
