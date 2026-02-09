import { Pencil, Trash2 } from "lucide-react";
import { Card } from "../Card";
import { useKPITrackerStore } from "../../stores/kpiTrackerStore";
import type { KPITableRow } from "../../types/api/kpi-tracker";

interface KPIDataTableProps {
  rows: KPITableRow[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  userRole: string;
  currentUserId?: number;
}

/**
 * KPIDataTable - Full data table with status badges, action buttons, and pagination
 */
export const KPIDataTable = ({
  rows,
  total,
  totalPages,
  currentPage,
  isLoading,
  userRole,
  currentUserId,
}: KPIDataTableProps) => {
  const { openEditModal, openDeleteModal, setPage, page } =
    useKPITrackerStore();

  const isSuperAdmin = userRole === "SUPERADMIN";
  const isEmployee = userRole === "EMPLOYEE";

  // Filter rows for EMPLOYEE role — only show their own data
  const filteredRows = isEmployee
    ? rows.filter((row) => row.employeeId === currentUserId)
    : rows;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Excellent: "bg-green-500/10 text-green-400 border border-green-500/20",
      Good: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      Poor: "bg-red-500/10 text-red-400 border border-red-500/20",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          styles[status] ?? styles.Poor
        }`}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">Employee KPI Data</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="h-10 bg-white/5 rounded flex-1" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (filteredRows.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">Employee KPI Data</h2>
        <div className="flex flex-col items-center justify-center py-12 text-lightGrey">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-lg font-medium mb-1">No KPI data found</p>
          <p className="text-sm">
            Try adjusting your filters or check back later
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Employee KPI Data</h2>
        <p className="text-sm text-lightGrey">{total} total records</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Department
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                KPI Name
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Target
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Actual
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Weight
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Score
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Status
              </th>
              {isSuperAdmin && (
                <th className="text-center px-4 py-3 text-xs font-semibold text-lightGrey uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.scoreId}
                className="border-b border-white/5 hover:bg-white/5 transition-all"
              >
                <td className="px-4 py-3 text-sm text-white font-medium">
                  {row.employeeName}
                </td>
                <td className="px-4 py-3 text-sm text-lightGrey">
                  {row.department}
                </td>
                <td className="px-4 py-3 text-sm text-white">{row.kpiName}</td>
                <td className="px-4 py-3 text-sm text-lightGrey text-center">
                  {row.target.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-white text-center font-medium">
                  {row.actual.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-lightGrey text-center">
                  {row.weight}
                </td>
                <td className="px-4 py-3 text-sm text-white text-center font-semibold">
                  {row.score.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-center">
                  {getStatusBadge(row.status)}
                </td>
                {isSuperAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(row)}
                        className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 
                                   hover:text-blue-300 transition-all"
                        aria-label={`Edit ${row.employeeName} KPI`}
                        title="Edit Score"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(row)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 
                                   hover:text-red-300 transition-all"
                        aria-label={`Delete ${row.employeeName} KPI`}
                        title="Delete Score"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredRows.map((row) => (
          <div
            key={row.scoreId}
            className="border border-white/10 rounded-lg bg-white/5 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {row.employeeName}
                </p>
                <p className="text-xs text-lightGrey">{row.department}</p>
              </div>
              {getStatusBadge(row.status)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-xs text-lightGrey uppercase">
                  KPI Name
                </span>
                <p className="text-white">{row.kpiName}</p>
              </div>
              <div>
                <span className="text-xs text-lightGrey uppercase">Score</span>
                <p className="text-white font-semibold">
                  {row.score.toFixed(1)}
                </p>
              </div>
              <div>
                <span className="text-xs text-lightGrey uppercase">Target</span>
                <p className="text-lightGrey">{row.target.toFixed(1)}</p>
              </div>
              <div>
                <span className="text-xs text-lightGrey uppercase">Actual</span>
                <p className="text-white">{row.actual.toFixed(1)}</p>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => openEditModal(row)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs 
                             text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(row)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs 
                             text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-lightGrey">
            Page {currentPage} of {totalPages} ({total} records)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-lightGrey 
                         hover:bg-white/10 hover:text-white transition-all
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    pageNum === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-lightGrey hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(page + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-lightGrey 
                         hover:bg-white/10 hover:text-white transition-all
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
