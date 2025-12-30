import { Modal } from "../Modal";

/**
 * KPIFormModal - Modal for managing employee KPI scores
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {object} employee - Employee being edited
 * @param {object} kpiData - Current KPI form data
 * @param {function} onKpiChange - Handler for KPI data changes
 * @param {function} onSave - Save handler
 */
export const KPIFormModal = ({
  isOpen,
  onClose,
  employee,
  kpiData,
  onKpiChange,
  onSave,
}) => {
  if (!employee) return null;

  const handleMetricChange = (metric, value) => {
    const numValue = parseFloat(value) || 0;
    onKpiChange({
      ...kpiData,
      metrics: {
        ...kpiData.metrics,
        [metric]: numValue,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage KPI - ${employee.name}`}
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
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

        {/* Current Score & Target */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Score
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={kpiData.currentScore || 0}
              onChange={(e) =>
                onKpiChange({
                  ...kpiData,
                  currentScore: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Score
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={kpiData.target || 0}
              onChange={(e) =>
                onKpiChange({
                  ...kpiData,
                  target: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Performance Metrics
          </h4>
          <div className="space-y-4">
            {/* Productivity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Productivity
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kpiData.metrics?.productivity || 0}
                  onChange={(e) =>
                    handleMetricChange("productivity", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-white font-semibold w-12 text-right">
                  {(kpiData.metrics?.productivity || 0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kpiData.metrics?.quality || 0}
                  onChange={(e) =>
                    handleMetricChange("quality", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-white font-semibold w-12 text-right">
                  {(kpiData.metrics?.quality || 0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Teamwork */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teamwork
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kpiData.metrics?.teamwork || 0}
                  onChange={(e) =>
                    handleMetricChange("teamwork", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-white font-semibold w-12 text-right">
                  {(kpiData.metrics?.teamwork || 0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Punctuality */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Punctuality
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kpiData.metrics?.punctuality || 0}
                  onChange={(e) =>
                    handleMetricChange("punctuality", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-white font-semibold w-12 text-right">
                  {(kpiData.metrics?.punctuality || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all"
          >
            Save KPI
          </button>
        </div>
      </div>
    </Modal>
  );
};
