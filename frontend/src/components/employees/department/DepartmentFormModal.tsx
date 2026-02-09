import { useState } from "react";
import { Modal } from "../../Modal";
import { Button } from "../../Button";
import type { Department, DepartmentStatus } from "../../../types/api";

// ============ Form Data Type ============

export interface DepartmentFormData {
  name: string;
  description: string;
  status: DepartmentStatus;
}

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  department: Department | null;
  onSubmit: (data: DepartmentFormData) => void;
  isSubmitting: boolean;
  existingNames: string[];
}

// Inner component that mounts/unmounts with the modal
const DepartmentFormContent = ({
  onClose,
  mode,
  department,
  onSubmit,
  isSubmitting,
  existingNames,
}: Omit<DepartmentFormModalProps, "isOpen">) => {
  const [name, setName] = useState(
    mode === "edit" && department ? department.name : "",
  );
  const [description, setDescription] = useState(
    mode === "edit" && department ? department.description || "" : "",
  );
  const [status, setStatus] = useState<DepartmentStatus>(
    mode === "edit" && department ? department.status : "ACTIVE",
  );
  const [nameError, setNameError] = useState<string | null>(null);

  const trimmedName = name.trim();

  const isDuplicateName = (() => {
    if (!trimmedName) return false;
    const normalizedName = trimmedName.toLowerCase();
    return existingNames.some(
      (n) =>
        n.toLowerCase() === normalizedName &&
        !(mode === "edit" && department?.name.toLowerCase() === normalizedName),
    );
  })();

  const validate = (): boolean => {
    if (!trimmedName) {
      setNameError("Department name is required");
      return false;
    }
    if (trimmedName.length > 100) {
      setNameError("Name must be 100 characters or less");
      return false;
    }
    if (isDuplicateName) {
      setNameError("A department with this name already exists");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: trimmedName, description: description.trim(), status });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={mode === "create" ? "Create Department" : "Edit Department"}
    >
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Department Name */}
        <div>
          <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
            Department Name <span className="text-red-400">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            className={`glass-input w-full ${
              nameError || isDuplicateName
                ? "border-red-500/50 focus:border-red-500"
                : ""
            }`}
            placeholder="e.g., Engineering"
            autoFocus
          />
          {nameError && (
            <p className="text-red-400 text-xs mt-1">{nameError}</p>
          )}
          {!nameError && isDuplicateName && (
            <p className="text-red-400 text-xs mt-1">
              A department with this name already exists
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-input w-full min-h-[80px] resize-none"
            placeholder="Optional department description..."
            rows={3}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
            Status
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus("ACTIVE")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                status === "ACTIVE"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                  : "bg-white/5 text-lightGrey border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === "ACTIVE" ? "bg-emerald-400" : "bg-gray-500"
                  }`}
                />
                Active
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatus("INACTIVE")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                status === "INACTIVE"
                  ? "bg-gray-500/15 text-gray-300 border-gray-500/40"
                  : "bg-white/5 text-lightGrey border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === "INACTIVE" ? "bg-gray-400" : "bg-gray-500"
                  }`}
                />
                Inactive
              </span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-white/10">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting || isDuplicateName}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Department"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/**
 * DepartmentFormModal - Wrapper that mounts/unmounts the form content
 * to ensure clean state on each open
 */
export const DepartmentFormModal = ({
  isOpen,
  onClose,
  mode,
  department,
  onSubmit,
  isSubmitting,
  existingNames,
}: DepartmentFormModalProps) => {
  if (!isOpen) return null;
  return (
    <DepartmentFormContent
      onClose={onClose}
      mode={mode}
      department={department}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      existingNames={existingNames}
    />
  );
};
