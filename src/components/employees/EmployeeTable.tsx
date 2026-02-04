import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { AvatarDisplay } from "../AvatarDisplay";
import {
  Edit,
  LogOut,
  TrendingUp,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { getEmployeeAvatar } from "../../utils/avatarUtils";

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
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Helper function to extract first and last name
  const getNameParts = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    const firstName = parts.slice(0, -1).join(" ") || parts[0];
    return { firstName, lastName };
  };

  // Helper function to get email ID (first part before @)
  const getEmailId = (email: string) => {
    return email.split("@")[0];
  };

  const columns = [
    {
      key: "no",
      label: "No",
      render: (row) => (
        <span className="text-white font-semibold">{row.id}</span>
      ),
    },
    {
      key: "employeeId",
      label: "Employee ID",
      render: (row) => (
        <span className="text-lightGrey font-mono text-sm">
          EMP-{String(row.id).padStart(4, "0")}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const avatarData = getEmployeeAvatar(row.id);
        return (
          <div className="flex items-center gap-3">
            <AvatarDisplay src={avatarData} name={row.name} size="sm" />
            <span className="text-white font-medium">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="text-lightGrey text-sm truncate" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <span className="text-lightGrey text-sm">{row.phone}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (row) => (
        <span className="text-white bg-white/5 px-3 py-1 rounded text-sm">
          {row.department}
        </span>
      ),
    },
    {
      key: "position",
      label: "Position",
      render: (row) => <span className="text-white text-sm">{row.role}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
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
              {row.employmentType !== "former" && (
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
                        : row[col.key]}
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
