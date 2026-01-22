import { useState } from "react";
import { Modal } from "../Modal";
import type { Employee, KPIMetrics, KPIProfile } from "../../types";

interface KPIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  kpiData: KPIProfile;
  onKpiChange: (data: KPIProfile) => void;
  onSave: () => void;
}

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
}: KPIFormModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (!employee) return null;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleSave = () => {
    // Save KPI with month/year reference
    const updatedKpiData = {
      ...kpiData,
      month: selectedMonth,
      year: selectedYear,
    };

    onKpiChange(updatedKpiData);
    onSave();
  };

  const handleMetricChange = (metric: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const baseMetrics: KPIMetrics = {
      productivity: 0,
      quality: 0,
      teamwork: 0,
      punctuality: 0,
    };
    const updatedMetrics: KPIMetrics = {
      ...baseMetrics,
      ...(kpiData.metrics || {}),
      [metric]: numValue,
    };

    // Calculate average of all metrics
    const average =
      (updatedMetrics.productivity +
        updatedMetrics.quality +
        updatedMetrics.teamwork +
        updatedMetrics.punctuality) /
      4;

    onKpiChange({
      ...kpiData,
      metrics: updatedMetrics,
      currentScore: parseFloat(average.toFixed(1)),
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

        {/* Month & Year Filter */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1} className="bg-gray-800">
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year} className="bg-gray-800">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Score & Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Score{" "}
              <span className="text-gray-500">
                ({months[selectedMonth - 1]} {selectedYear})
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={kpiData.currentScore || 0}
              disabled
              className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-gray-500 mt-2">
              Auto-calculated from performance metrics
            </p>
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all"
          >
            Save KPI
          </button>
        </div>
      </div>
    </Modal>
  );
};
