import { useState, useMemo, useEffect } from "react";
import { Modal } from "../Modal";
import { useKPIScoring } from "../../hooks/useKPIScoring";
import type { Employee } from "../../types";
import type { MetricScoreDto } from "../../types/api";

interface KPIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSaveSuccess?: () => void;
}

/**
 * KPIFormModal - Modal for managing employee KPI scores with dynamic metrics from backend
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {object} employee - Employee being edited
 * @param {function} onSaveSuccess - Callback after successful save
 */
export const KPIFormModal = ({
  isOpen,
  onClose,
  employee,
  onSaveSuccess,
}: KPIFormModalProps) => {
  // KPI Scoring hook - fetches metrics, period, and existing scores
  const {
    metrics,
    currentPeriod,
    existingScores,
    metricsLoading,
    periodLoading,
    scoresLoading,
    submitting,
    error: scoringError,
    canScore,
    submitScores,
    fetchEmployeeScores,
  } = useKPIScoring();

  // User-modified scores: { metricId: score } - only tracks what user has changed
  const [userScores, setUserScores] = useState<Record<number, number>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch existing scores when modal opens with an employee and period is available
  useEffect(() => {
    if (isOpen && employee && currentPeriod) {
      fetchEmployeeScores(employee.id);
    }
  }, [isOpen, employee, currentPeriod, fetchEmployeeScores]);

  // Compute default scores from metrics (fallback to 5.0 if no existing score)
  const defaultScores = useMemo(() => {
    const defaults: Record<number, number> = {};
    metrics.forEach((metric) => {
      // Use existing score if available, otherwise default to 5.0
      defaults[metric.id] = existingScores[metric.id] ?? 5.0;
    });
    return defaults;
  }, [metrics, existingScores]);

  // Merge default scores with user-modified scores
  const scores = useMemo(() => {
    return { ...defaultScores, ...userScores };
  }, [defaultScores, userScores]);

  // Calculate average score from all metrics
  const averageScore = useMemo(() => {
    const scoreValues = Object.values(scores);
    if (scoreValues.length === 0) return 0;
    const sum = scoreValues.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / scoreValues.length).toFixed(1));
  }, [scores]);

  // Handle score change for a metric
  const handleScoreChange = (metricId: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setUserScores((prev) => ({
      ...prev,
      [metricId]: numValue,
    }));
  };

  // Reset user scores when modal is closed
  const handleClose = () => {
    setUserScores({});
    setSaveError(null);
    setSaveSuccess(false);
    onClose();
  };

  // Handle save
  const handleSave = async () => {
    if (!employee || !canScore) return;

    setSaveError(null);
    setSaveSuccess(false);

    // Transform scores to API format
    const scoresList: MetricScoreDto[] = Object.entries(scores).map(
      ([metricId, score]) => ({
        metricId: parseInt(metricId, 10),
        score,
      })
    );

    const success = await submitScores(employee.id, scoresList);

    if (success) {
      setSaveSuccess(true);
      onSaveSuccess?.();
      // Auto-close after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setSaveError(scoringError || "Error saving KPI scores");
    }
  };

  if (!employee) return null;

  const isLoading = metricsLoading || periodLoading || scoresLoading;
  const error = saveError || scoringError;

  // Check if we have any existing scores loaded
  const hasExistingScores = Object.keys(existingScores).length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Manage KPI - ${employee.name}`}
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
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

        {/* Current Period Info */}
        {currentPeriod && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-sm text-blue-400">
              <span className="font-medium">Current period:</span>{" "}
              {currentPeriod.name}
              {hasExistingScores && (
                <span className="ml-2 text-blue-300">(scores loaded)</span>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">
              {scoresLoading ? "Loading scores..." : "Loading metrics..."}
            </span>
          </div>
        )}

        {/* No Period Available */}
        {!isLoading && !currentPeriod && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">
              No active evaluation period exists. Please create a period first.
            </p>
          </div>
        )}

        {/* No Metrics Available */}
        {!isLoading && currentPeriod && metrics.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">
              No active KPI metrics are available. Please create metrics first.
            </p>
          </div>
        )}

        {/* Current Score Display */}
        {!isLoading && metrics.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Average score</span>
              <span className="text-2xl font-bold text-white">{averageScore}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Automatically calculated from all metrics
            </p>
          </div>
        )}

        {/* Dynamic Metrics Sliders */}
        {!isLoading && metrics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Performance metrics
            </h4>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.id}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {metric.name}
                  </label>
                  {metric.description && (
                    <p className="text-xs text-gray-500 mb-2">{metric.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={scores[metric.id] ?? 5}
                      onChange={(e) => handleScoreChange(metric.id, e.target.value)}
                      className="flex-1"
                      disabled={submitting}
                    />
                    <span className="text-white font-semibold w-12 text-right">
                      {(scores[metric.id] ?? 5).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-green-400 text-sm">KPI saved successfully!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="w-full sm:flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canScore || submitting || saveSuccess}
            className="w-full sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? "Saving..." : "Save KPI"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
