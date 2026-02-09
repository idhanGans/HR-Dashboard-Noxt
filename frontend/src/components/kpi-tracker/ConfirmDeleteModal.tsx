import { AlertTriangle } from "lucide-react";
import { Modal } from "../Modal";
import { useKPITrackerStore } from "../../stores/kpiTrackerStore";
import { useKPIScoreDelete } from "../../hooks/useKPITracker";

interface ConfirmDeleteModalProps {
  userRole: string;
}

/**
 * ConfirmDeleteModal - Destructive delete confirmation modal (SUPERADMIN only)
 */
export const ConfirmDeleteModal = ({ userRole }: ConfirmDeleteModalProps) => {
  const { modals, closeDeleteModal } = useKPITrackerStore();
  const { deleteScore, isDeleting } = useKPIScoreDelete();

  const { isOpen, row } = modals.deleteModal;
  const isSuperAdmin = userRole === "SUPERADMIN";

  const handleDelete = async () => {
    if (!row || !isSuperAdmin) return;

    const success = await deleteScore(row.scoreId);
    if (success) {
      closeDeleteModal();
    }
  };

  if (!row) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeDeleteModal} title="Delete KPI Score">
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Are you sure?
          </h3>
          <p className="text-sm text-lightGrey max-w-sm mx-auto">
            You are about to delete the KPI score for{" "}
            <span className="text-white font-medium">{row.employeeName}</span>{" "}
            on metric{" "}
            <span className="text-white font-medium">{row.kpiName}</span>. This
            action cannot be undone.
          </p>
        </div>

        {/* Score Details */}
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
                Score
              </p>
              <p className="text-sm text-white font-medium">
                {row.score.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
                Target
              </p>
              <p className="text-sm text-lightGrey">{row.target.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
                Status
              </p>
              <p
                className={`text-sm font-medium ${
                  row.status === "Excellent"
                    ? "text-green-400"
                    : row.status === "Good"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {row.status}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 text-sm text-lightGrey bg-white/5 border border-white/10 
                       rounded-lg hover:bg-white/10 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isSuperAdmin || isDeleting}
            className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg
                       hover:bg-red-700 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Score"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
