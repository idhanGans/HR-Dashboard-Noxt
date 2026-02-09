import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Modal } from "../Modal";
import { useKPITrackerStore } from "../../stores/kpiTrackerStore";
import { useKPIScoreUpdate } from "../../hooks/useKPITracker";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const editKPISchema = z.object({
  actualValue: z
    .number({ message: "Must be a valid number" })
    .min(0, "Score must be at least 0")
    .max(10, "Score must be at most 10"),
});

type EditKPIFormValues = z.infer<typeof editKPISchema>;

interface KPIEditModalProps {
  userRole: string;
}

const getScoreStatus = (score: number, target: number): string => {
  const ratio = target > 0 ? score / target : 0;
  if (ratio >= 0.9) return "Excellent";
  if (ratio >= 0.7) return "Good";
  return "Poor";
};

const getStatusColor = (status: string): string => {
  if (status === "Excellent") return "text-green-400";
  if (status === "Good") return "text-yellow-400";
  return "text-red-400";
};

/**
 * KPIEditModal - Edit KPI score modal with React Hook Form + Zod validation
 */
export const KPIEditModal = ({ userRole }: KPIEditModalProps) => {
  const { modals, closeEditModal } = useKPITrackerStore();
  const { updateScore, isUpdating } = useKPIScoreUpdate();

  const { isOpen, row } = modals.editModal;
  const isSuperAdmin = userRole === "SUPERADMIN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditKPIFormValues>({
    resolver: zodResolver(editKPISchema),
    defaultValues: {
      actualValue: row?.actual ?? 0,
    },
    mode: "onChange",
  });

  // Reset form when modal opens with new row
  useEffect(() => {
    if (isOpen && row) {
      reset({ actualValue: row.actual });
    }
  }, [isOpen, row, reset]);

  const onSubmit = async (data: EditKPIFormValues) => {
    if (!row || !isSuperAdmin) return;

    const success = await updateScore(row.scoreId, data.actualValue);
    if (success) {
      closeEditModal();
    }
  };

  if (!row) return null;

  const currentStatus = getScoreStatus(row.actual, row.target);

  return (
    <Modal isOpen={isOpen} onClose={closeEditModal} title="Edit KPI Score">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl">
          <div>
            <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
              Employee
            </p>
            <p className="text-sm text-white font-medium">{row.employeeName}</p>
          </div>
          <div>
            <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
              KPI Name
            </p>
            <p className="text-sm text-white font-medium">{row.kpiName}</p>
          </div>
          <div>
            <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
              Department
            </p>
            <p className="text-sm text-lightGrey">{row.department}</p>
          </div>
          <div>
            <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
              Target
            </p>
            <p className="text-sm text-lightGrey">{row.target.toFixed(1)}</p>
          </div>
        </div>

        {/* Actual Value Input */}
        <div>
          <label
            htmlFor="actualValue"
            className="block text-sm font-medium text-lightGrey mb-2"
          >
            Actual Value (0 - 10)
          </label>
          <input
            id="actualValue"
            type="number"
            step="0.1"
            min="0"
            max="10"
            disabled={!isSuperAdmin}
            className={`glass-input w-full ${
              errors.actualValue ? "border-red-500/50 focus:border-red-500" : ""
            }`}
            {...register("actualValue", { valueAsNumber: true })}
          />
          {errors.actualValue && (
            <p className="text-red-400 text-xs mt-1.5">
              {errors.actualValue.message}
            </p>
          )}
        </div>

        {/* Current Score Display (read-only) */}
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
                Current Score
              </p>
              <p className="text-2xl font-bold text-white">
                {row.score.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-lightGrey uppercase tracking-wider mb-1">
                Status
              </p>
              <p
                className={`text-sm font-semibold ${getStatusColor(
                  currentStatus,
                )}`}
              >
                {currentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeEditModal}
            className="px-4 py-2 text-sm text-lightGrey bg-white/5 border border-white/10 
                       rounded-lg hover:bg-white/10 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isSuperAdmin || isUpdating || !isValid}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
                       hover:bg-blue-700 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {!isSuperAdmin && (
          <p className="text-xs text-yellow-400 text-center">
            Only SUPERADMIN can edit KPI scores
          </p>
        )}
      </form>
    </Modal>
  );
};
