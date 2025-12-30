import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { Edit, LogOut } from "lucide-react";

/**
 * EmployeeTable - Displays employee data in a table
 * @param {Array} employees - Array of employee objects
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onMarkFormer - Callback when mark former button is clicked
 */
export const EmployeeTable = ({ employees, onEdit, onMarkFormer }) => {
  const columns = [
    {
      key: "avatar",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black text-xs font-bold">
            {row.avatar || row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{row.name}</p>
            <p className="text-xs text-lightGrey">{row.role}</p>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    {
      key: "employmentType",
      label: "Employment Type",
      render: (row) => (
        <span className="text-sm text-white capitalize">
          {row.employmentType}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="text-xs px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20"
            onClick={() => onEdit(row)}
          >
            <div className="flex items-center gap-1">
              <Edit size={14} />
              Edit
            </div>
          </button>
          {row.employmentType !== "former" && (
            <button
              className="text-xs px-3 py-1 rounded bg-red-900/30 text-red-200 border border-red-500/30 hover:bg-red-900/50"
              onClick={() => onMarkFormer(row)}
            >
              <div className="flex items-center gap-1">
                <LogOut size={14} />
                Mark Former
              </div>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">All Employees</h2>
        <p className="text-xs text-lightGrey">
          Click Edit to update employment type or details
        </p>
      </div>
      <Table columns={columns} data={employees} />
    </Card>
  );
};
