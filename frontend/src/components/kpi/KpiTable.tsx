/**
 * KpiTable - KPI data table component
 * Displays KPI evaluations with columns for employee, department, period, score, status
 * Allows edit/delete actions for SuperAdmins
 */

import { useState } from "react";
import { useKpiStore } from "../../stores/useKpiStore";

interface KpiTableProps {
  userRole?: string;
  onEditClick?: (evaluationId: string) => void;
  isLoading?: boolean;
}

export const KpiTable = ({
  userRole = "USER",
  onEditClick,
  isLoading = false,
}: KpiTableProps) => {
  const { getKpiTableRows, deleteKpiEvaluation, openManageModal } =
    useKpiStore();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const rows = getKpiTableRows();
  const isSuperAdmin = userRole === "SUPERADMIN";

  const handleEdit = (evaluationId: string) => {
    onEditClick?.(evaluationId);
    openManageModal(evaluationId);
  };

  const handleDelete = (evaluationId: string) => {
    setLoadingId(evaluationId);
    setTimeout(() => {
      deleteKpiEvaluation(evaluationId);
      setDeleteConfirm(null);
      setLoadingId(null);
    }, 300);
  };

  const getStatusBadgeColor = (
    status: "Excellent" | "Good" | "Warning" | "Critical",
  ) => {
    switch (status) {
      case "Excellent":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100">KPI Evaluations</h3>
        <span className="text-sm text-gray-400">
          {rows.length} record{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-8 text-center text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <p className="mt-2">Loading KPI data...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No KPI evaluations found</p>
          <p className="text-xs mt-1">
            Try adjusting your filters or create new evaluations
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/80">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.evaluationId}
                  className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition ${
                    loadingId === row.evaluationId ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {row.employeeName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {row.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {row.period}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right">
                    <span className="text-blue-400">
                      {row.averageScore.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">/10</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        row.status,
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(row.evaluationId)}
                          disabled={loadingId === row.evaluationId}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(row.evaluationId)}
                          disabled={loadingId === row.evaluationId}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-medium transition"
                        >
                          Delete
                        </button>

                        {/* Delete Confirmation */}
                        {deleteConfirm === row.evaluationId && (
                          <div className="absolute bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg z-50 text-xs whitespace-nowrap">
                            <p className="text-gray-300 mb-2">
                              Delete this evaluation?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(row.evaluationId)}
                                className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
