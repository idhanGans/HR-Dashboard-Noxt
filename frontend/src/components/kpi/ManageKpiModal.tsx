/**
 * ManageKpiModal - Modal for managing KPI scores
 * Allows Super Admin to add/edit KPI evaluations with metrics and scores
 */

import { useEffect, useMemo, useState } from "react";
import { Modal } from "../Modal";
import { useKpiStore } from "../../stores/useKpiStore";
import type { KpiEvaluation, MetricScore } from "../../types/kpi";
import { calculateAverageScore, getKpiStatus } from "../../types/kpi";

/**
 * Generate unique ID for evaluations
 */
function generateId(): string {
  return `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface ManageKpiModalProps {
  userRole?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ManageKpiModal = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: ManageKpiModalProps) => {
  // Store state
  const {
    manageModalOpen,
    closeManageModal,
    employees,
    periods,
    metrics,
    activePeriodId,
    saveKpiEvaluation,
    getActivePeriod,
    getEmployeeKpi,
  } = useKpiStore();

  // Use external open state if provided, otherwise use store state
  const isOpen =
    externalIsOpen !== undefined ? externalIsOpen : manageModalOpen;
  const handleClose =
    externalOnClose ||
    (() => {
      closeManageModal();
    });

  // Form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    activePeriodId || "",
  );
  const [scores, setScores] = useState<MetricScore[]>([]);
  const [targets, setTargets] = useState<Record<string, number>>({});
  const [saveError, setSaveError] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<string>("");

  // Initialize form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Batch state updates to avoid cascading renders
    const resetForm = () => {
      setSelectedEmployeeId("");
      setSelectedPeriodId(activePeriodId || "");
      setScores(metrics.map((m) => ({ metricId: m.id, score: 5, target: 5 })));
      setTargets(metrics.reduce((acc, m) => ({ ...acc, [m.id]: 5 }), {}));
      setSaveError("");
      setSaveSuccess("");
    };

    resetForm();
  }, [isOpen, activePeriodId, metrics]);

  const activePeriod = periods.find((p) => p.id === selectedPeriodId);
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const averageScore = useMemo(() => calculateAverageScore(scores), [scores]);
  const status = useMemo(() => getKpiStatus(averageScore), [averageScore]);

  // Check if period is active
  const noActivePeriod = !activePeriod || !activePeriod.isActive;

  // Handle score slider change
  const handleScoreChange = (metricId: string, value: number) => {
    setScores((prev) =>
      prev.map((s) => (s.metricId === metricId ? { ...s, score: value } : s)),
    );
  };

  // Handle target slider change
  const handleTargetChange = (metricId: string, value: number) => {
    setTargets((prev) => ({ ...prev, [metricId]: value }));
  };

  // Handle save
  const handleSave = () => {
    // Clear previous messages
    setSaveError("");
    setSaveSuccess("");

    // Validate inputs
    if (!selectedEmployeeId) {
      setSaveError("Please select an employee");
      return;
    }

    // Get active period validation
    const activePeriod = getActivePeriod();
    if (!activePeriod) {
      setSaveError(
        "No active evaluation period exists. Please create a period first.",
      );
      return;
    }

    // Prepare metrics with targets
    const metricsWithTargets = scores.map((s) => ({
      ...s,
      target: targets[s.metricId] || 5,
    }));

    // Call the new saveKpiEvaluation method
    const result = saveKpiEvaluation(selectedEmployeeId, metricsWithTargets);

    if (result.success) {
      const action = result.action === "updated" ? "updated" : "created";
      setSaveSuccess(`KPI evaluation ${action} successfully!`);

      // Close modal after short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      setSaveError(result.error || "Failed to save KPI evaluation");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage KPI - Super Admin"
    >
      <div className="space-y-6">
        {/* Error Message */}
        {saveError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            ❌ {saveError}
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            ✅ {saveSuccess}
          </div>
        )}

        {/* Warning if no active period */}
        {noActivePeriod && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            ⚠️ No active evaluation period exists. Please create a period first.
          </div>
        )}

        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Employee
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            disabled={!activePeriod}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition"
          >
            <option value="">Choose an employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.department}
              </option>
            ))}
          </select>
        </div>

        {/* Period Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Evaluation Period
          </label>
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:border-gray-500 transition"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} {period.isActive ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Info Display */}
        {selectedEmployee && (
          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Employee Information
            </h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>
                <span className="text-gray-300">Name:</span>{" "}
                {selectedEmployee.name}
              </p>
              <p>
                <span className="text-gray-300">Department:</span>{" "}
                {selectedEmployee.department}
              </p>
              <p>
                <span className="text-gray-300">Role:</span>{" "}
                {selectedEmployee.role}
              </p>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-4">
            Performance Metrics
          </h4>
          <div className="space-y-6">
            {scores.map((score) => {
              const metric = metrics.find((m) => m.id === score.metricId);
              return (
                <div
                  key={score.metricId}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                >
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-200">
                      {metric?.title || "Unknown Metric"}
                    </h5>
                    {metric?.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {metric.description}
                      </p>
                    )}
                  </div>

                  {/* Score Slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-400">
                        Score (1-10)
                      </label>
                      <span className="text-sm font-semibold text-blue-400">
                        {score.score.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={score.score}
                      onChange={(e) =>
                        handleScoreChange(
                          score.metricId,
                          parseFloat(e.target.value),
                        )
                      }
                      disabled={!activePeriod}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-500"
                    />
                  </div>

                  {/* Target Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-400">
                        Target (1-10)
                      </label>
                      <span className="text-sm font-semibold text-green-400">
                        {targets[score.metricId]?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={targets[score.metricId] || 5}
                      onChange={(e) =>
                        handleTargetChange(
                          score.metricId,
                          parseFloat(e.target.value),
                        )
                      }
                      disabled={!activePeriod}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-green-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Average Score Display */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs font-medium text-gray-400 mb-1">
              Average Score
            </p>
            <p className="text-3xl font-bold text-blue-400">
              {averageScore.toFixed(1)}
            </p>
            <p
              className={`text-xs font-semibold mt-2 ${
                status === "Excellent"
                  ? "text-green-400"
                  : status === "Good"
                    ? "text-blue-400"
                    : status === "Warning"
                      ? "text-yellow-400"
                      : "text-red-400"
              }`}
            >
              {status}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!selectedEmployeeId || noActivePeriod || !!saveSuccess}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
          >
            Save KPI
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
