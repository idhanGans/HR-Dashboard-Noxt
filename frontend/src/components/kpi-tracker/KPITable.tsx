/**
 * KPITable Component
 * Employee KPI table with avatar, name, department, score, trend, and actions
 */

import { motion, AnimatePresence } from "framer-motion";
import { Edit, Eye } from "lucide-react";
import { SparklineChart } from "./SparklineChart";
import type { EmployeeKPI } from "../../types/kpi-tracker";

interface KPITableProps {
  employees: EmployeeKPI[];
  userRole: string;
  onEdit: (employee: EmployeeKPI) => void;
  onView: (employee: EmployeeKPI) => void;
}

export const KPITable = ({
  employees,
  userRole,
  onEdit,
  onView,
}: KPITableProps) => {
  const isSuperAdmin = userRole === "SUPERADMIN";

  const calculateAverage = (metrics: EmployeeKPI["metrics"]): number => {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8.5) return "text-green-400";
    if (score >= 7) return "text-yellow-400";
    if (score >= 5) return "text-orange-400";
    return "text-red-400";
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                Department
              </th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                Average Score
              </th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                Trend
              </th>
              <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {employees.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-lg font-medium">
                        No employees found
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                employees.map((employee, index) => {
                  const avgScore = calculateAverage(employee.metrics);
                  const scoreColor = getScoreColor(avgScore);

                  return (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-all"
                    >
                      {/* Employee */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(employee.name)}
                          </div>
                          <span className="text-white font-medium">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className="text-gray-300">
                          {employee.department}
                        </span>
                      </td>

                      {/* Average Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-bold ${scoreColor}`}>
                            {avgScore.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">/10</span>
                        </div>
                      </td>

                      {/* Trend */}
                      <td className="px-6 py-4">
                        <SparklineChart
                          data={employee.history}
                          color={
                            avgScore >= 8.5
                              ? "#4ade80"
                              : avgScore >= 7
                                ? "#facc15"
                                : avgScore >= 5
                                  ? "#fb923c"
                                  : "#f87171"
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onView(employee)}
                            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all"
                            title="View"
                          >
                            <Eye size={16} className="text-gray-300" />
                          </motion.button>
                          {isSuperAdmin && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onEdit(employee)}
                              className="p-2 bg-blue-600/50 hover:bg-blue-500/50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit size={16} className="text-blue-300" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
