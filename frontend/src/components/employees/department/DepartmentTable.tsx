import { Edit, Trash2, Users, Building2 } from "lucide-react";
import type { Department } from "../../../types/api";

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  userRole: string;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

/**
 * DepartmentTable - Table component for displaying departments with actions
 */
export const DepartmentTable = ({
  departments,
  isLoading,
  userRole,
  onEdit,
  onDelete,
}: DepartmentTableProps) => {
  const isSuperAdmin = userRole === "SUPERADMIN";

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="mx-auto text-lightGrey/30 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Departments Found
        </h3>
        <p className="text-lightGrey text-sm">
          {isSuperAdmin
            ? "Create your first department to get started."
            : "No departments have been created yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left text-xs font-semibold text-lightGrey uppercase tracking-wider">
              Department Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-lightGrey uppercase tracking-wider">
              Supervisor
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-lightGrey uppercase tracking-wider">
              Total Employees
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-lightGrey uppercase tracking-wider">
              Status
            </th>
            {isSuperAdmin && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-lightGrey uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr
              key={dept.id}
              className="border-b border-white/10 hover:bg-white/5 transition-colors group"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                    <Building2 size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {dept.name}
                    </p>
                    {dept.description && (
                      <p className="text-lightGrey text-xs mt-0.5 truncate max-w-[200px]">
                        {dept.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-lightGrey text-sm">
                  {dept.supervisorName || "—"}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5">
                  <Users size={14} className="text-lightGrey" />
                  <span className="text-white text-sm font-medium">
                    {dept.memberCount}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    dept.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dept.status === "ACTIVE"
                        ? "bg-emerald-400"
                        : "bg-gray-400"
                    }`}
                  />
                  {dept.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </td>
              {isSuperAdmin && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(dept)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-lightGrey hover:text-blue-400"
                      title="Edit department"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(dept)}
                      className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-lightGrey hover:text-red-400"
                      title="Delete department"
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
  );
};
