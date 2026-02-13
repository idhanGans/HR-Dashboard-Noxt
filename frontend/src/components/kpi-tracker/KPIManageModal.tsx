/**
 * KPIManageModal Component
 * Modal for editing employee KPI metrics with sliders
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import type { EmployeeKPI } from "../../types/kpi-tracker";

interface KPIManageModalProps {
  isOpen: boolean;
  employee: EmployeeKPI | null;
  userRole: string;
  onClose: () => void;
  onSave: (employee: EmployeeKPI, metrics: EmployeeKPI["metrics"]) => void;
}

export const KPIManageModal = ({
  isOpen,
  employee,
  userRole,
  onClose,
  onSave,
}: KPIManageModalProps) => {
  const [metrics, setMetrics] = useState({
    attendance: 5,
    punctuality: 5,
    response: 5,
    communication: 5,
    workAsTeam: 5,
    productivity: 5,
    qualityOfWork: 5,
    initiativeProblemSolving: 5,
  });

  const isSuperAdmin = userRole === "SUPERADMIN";

  // Initialize metrics from employee data when modal opens
  useEffect(() => {
    if (isOpen && employee) {
      setMetrics({
        attendance: employee.metrics.attendance || 5,
        punctuality: employee.metrics.punctuality || 5,
        response: employee.metrics.response || 5,
        communication: employee.metrics.communication || 5,
        workAsTeam: employee.metrics.workAsTeam || 5,
        productivity: employee.metrics.productivity || 5,
        qualityOfWork: employee.metrics.qualityOfWork || 5,
        initiativeProblemSolving:
          employee.metrics.initiativeProblemSolving || 5,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employee?.id]);

  const handleMetricChange = (metric: keyof typeof metrics, value: number) => {
    setMetrics((prev) => ({ ...prev, [metric]: value }));
  };

  const calculateOverallRating = (): number => {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const handleSave = () => {
    if (employee && isSuperAdmin) {
      onSave(employee, metrics);
    }
  };

  if (!employee) return null;

  const overallRating = calculateOverallRating();

  const metricConfig = [
    {
      key: "attendance" as const,
      label: "Attendance",
      description: "Regular attendance and presence at work",
    },
    {
      key: "punctuality" as const,
      label: "Punctuality",
      description: "Timeliness in arrival and deadline adherence",
    },
    {
      key: "response" as const,
      label: "Response",
      description: "Speed and quality of response to requests",
    },
    {
      key: "communication" as const,
      label: "Communication",
      description: "Effectiveness in conveying information",
    },
    {
      key: "workAsTeam" as const,
      label: "Work as Team",
      description: "Collaboration and teamwork skills",
    },
    {
      key: "productivity" as const,
      label: "Productivity",
      description: "Output and efficiency of work completed",
    },
    {
      key: "qualityOfWork" as const,
      label: "Quality of Work",
      description: "Accuracy and quality of deliverables",
    },
    {
      key: "initiativeProblemSolving" as const,
      label: "Initiative & Problem Solving",
      description: "Proactive approach and problem-solving ability",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Manage KPI - {employee.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {userRole} • {employee.department}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-all"
                >
                  <X size={24} className="text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Warning Banner */}
                {!employee.period && (
                  <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-400 text-sm font-medium">
                      No active evaluation period exists. Please create a period
                      first.
                    </p>
                  </div>
                )}

                {/* Overall Rating */}
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        Average score
                      </p>
                      <p className="text-gray-300 text-xs">
                        Automatically calculated from all metrics
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.span
                        key={overallRating}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-bold text-white"
                      >
                        {overallRating.toFixed(1)}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-6">
                  <h3 className="text-white font-semibold text-lg">
                    Performance metrics
                  </h3>

                  {metricConfig.map((metric) => (
                    <motion.div
                      key={metric.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gray-800/50 border border-gray-700/30 rounded-xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {metric.label}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {metric.description}
                          </p>
                        </div>
                      </div>

                      {/* Score Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-sm font-medium">
                            Score (1-10)
                          </p>
                          <motion.span
                            key={metrics[metric.key]}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-xl font-bold text-blue-400"
                          >
                            {metrics[metric.key].toFixed(1)}
                          </motion.span>
                        </div>

                        {/* Score Slider */}
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={metrics[metric.key]}
                            onChange={(e) =>
                              handleMetricChange(
                                metric.key,
                                parseFloat(e.target.value),
                              )
                            }
                            disabled={!isSuperAdmin}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${metrics[metric.key] * 10}%, #4b5563 ${metrics[metric.key] * 10}%, #4b5563 100%)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Target Display (Static - Fixed to 10) */}
                      <div className="flex items-center justify-between px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <p className="text-gray-300 text-sm font-medium">
                          Target (Fixed)
                        </p>
                        <span className="text-2xl font-bold text-green-400">
                          10
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-xl transition-all"
                >
                  <Plus size={18} />
                  Add Evaluation Period
                </motion.button>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </motion.button>
                  {isSuperAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/30"
                    >
                      Save
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
