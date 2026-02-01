import { Card } from "../Card";
import {
  Edit,
  LogOut,
  TrendingUp,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import type { Employee } from "../../types";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onMarkFormer: (employee: Employee) => void;
  onManageKPI: (employee: Employee) => void;
  onManagePayroll: (employee: Employee) => void;
}

/**
 * EmployeeTable - Displays employee data in a table with detailed directory view
 * @param {Array} employees - Array of employee objects
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onMarkFormer - Callback when mark former button is clicked
 * @param {Function} onManageKPI - Callback when manage KPI button is clicked
 * @param {Function} onManagePayroll - Callback when manage payroll button is clicked
 */
export const EmployeeTable = ({
  employees,
  onEdit,
  onMarkFormer,
  onManageKPI,
  onManagePayroll,
}: EmployeeTableProps) => {
  const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<
    ReturnType<typeof setTimeout> | null
  >(null);

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenMenuId(null);
    }, 100);
    setCloseTimeout(timeout);
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const columns = [
    {
      key: "no",
      label: "No",
      render: (row: Employee) => (
        <span className="text-white font-semibold">{row.id}</span>
      ),
    },
    {
      key: "employeeId",
      label: "Employee ID",
      render: (row: Employee) => (
        <span className="text-lightGrey font-mono text-sm">
          EMP-{String(row.id).padStart(4, "0")}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {row.avatar || row.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-white font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row: Employee) => (
        <span className="text-lightGrey text-sm truncate" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: Employee) => (
        <span className="text-lightGrey text-sm">{row.phone}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (row: Employee) => (
        <span className="text-white bg-white/5 px-3 py-1 rounded text-sm">
          {row.department}
        </span>
      ),
    },
    {
      key: "position",
      label: "Position",
      render: (row: Employee) => (
        <span className="text-white text-sm">{row.role}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Employee) => (
        <div
          className="relative"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <button
            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            className="p-2 hover:bg-white/10 rounded transition-colors text-lightGrey hover:text-white"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {openMenuId === row.id && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/40 rounded-lg shadow-2xl z-10 py-2">
              {/* Edit Option */}
              <button
                onClick={() => {
                  onEdit(row);
                  setOpenMenuId(null);
                }}
                className="w-full px-5 py-3 text-left text-sm text-white font-medium hover:bg-white/35 flex items-center gap-3 transition-all duration-200"
              >
                <Edit size={18} className="text-blue-300" />
                <span>Edit Employee</span>
              </button>

              {/* KPI Option */}
              <button
                onClick={() => {
                  onManageKPI(row);
                  setOpenMenuId(null);
                }}
                className="w-full px-5 py-3 text-left text-sm text-white font-medium hover:bg-white/35 flex items-center gap-3 transition-all duration-200"
              >
                <TrendingUp size={18} className="text-blue-400" />
                <span>Manage KPI</span>
              </button>

              {/* Payroll Option */}
              <button
                onClick={() => {
                  onManagePayroll(row);
                  setOpenMenuId(null);
                }}
                className="w-full px-5 py-3 text-left text-sm text-white font-medium hover:bg-white/35 flex items-center gap-3 transition-all duration-200"
              >
                <DollarSign size={18} className="text-green-400" />
                <span>Manage Payroll</span>
              </button>

              {/* Divider */}
              {row.employmentType !== "FORMER" && (
                <>
                  <div className="border-t border-white/25 my-2"></div>

                  {/* Mark Former Option */}
                  <button
                    onClick={() => {
                      onMarkFormer(row);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-red-300 font-medium hover:bg-red-900/40 flex items-center gap-3 transition-all duration-200"
                  >
                    <LogOut size={18} className="text-red-400" />
                    <span>Mark as Former</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Employee Directory</h2>
          <p className="text-xs text-lightGrey mt-1">
            {employees.length} total employees
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-lightGrey uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((row, index) => (
              <tr
                key={`row-${row.id}`}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${col.key}`}
                    className="px-6 py-4 text-sm"
                  >
                    {col.key === "no"
                      ? index + 1
                      : col.render
                        ? col.render(row)
                        : renderCellValue(row[col.key as keyof Employee])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lightGrey">No employees found</p>
        </div>
      )}
    </Card>
  );
};
