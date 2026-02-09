import { AlertTriangle } from "lucide-react";
import { Modal } from "../../Modal";
import { Button } from "../../Button";
import type { Department } from "../../../types/api";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

/**
 * ConfirmDeleteModal - Confirmation dialog for deleting a department
 * Warns if department has active employees
 * Blocks delete action when members exist (backend also enforces this)
 */
export const DepartmentDeleteModal = ({
  isOpen,
  onClose,
  department,
  onConfirm,
  isDeleting,
}: ConfirmDeleteModalProps) => {
  if (!department) return null;

  const hasMembers = department.memberCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Department">
      <div className="space-y-5">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              hasMembers
                ? "bg-amber-500/15 border border-amber-500/30"
                : "bg-red-500/15 border border-red-500/30"
            }`}
          >
            <AlertTriangle
              size={32}
              className={hasMembers ? "text-amber-400" : "text-red-400"}
            />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            {hasMembers ? "Cannot Delete Department" : "Confirm Deletion"}
          </h3>

          {hasMembers ? (
            <div className="space-y-3">
              <p className="text-lightGrey text-sm">
                <span className="text-white font-medium">
                  {department.name}
                </span>{" "}
                currently has{" "}
                <span className="text-amber-400 font-semibold">
                  {department.memberCount} active employee
                  {department.memberCount !== 1 ? "s" : ""}
                </span>
                .
              </p>
              <p className="text-lightGrey text-sm">
                Please reassign all employees to another department before
                deleting this one.
              </p>
            </div>
          ) : (
            <p className="text-lightGrey text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{department.name}</span>?
              This action cannot be undone.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-white/10">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            {hasMembers ? "Close" : "Cancel"}
          </Button>
          {!hasMembers && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold text-sm transition-all bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Department"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
