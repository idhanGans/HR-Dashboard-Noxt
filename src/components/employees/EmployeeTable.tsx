import { Card } from "../Card";
import { Table } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { Edit, LogOut, TrendingUp, DollarSign } from "lucide-react";

/**
 * EmployeeTable - Displays employee data in a table
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
      key: "kpi",
      label: "KPI Score",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">
            {row.kpi?.currentScore?.toFixed(1) || "N/A"}
          </span>
          {row.kpi?.trend && (
            <span
              className={`text-xs ${
                row.kpi.trend.startsWith("+")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {row.kpi.trend}
            </span>
          )}
        </div>
      ),
    },
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
        <div className="flex gap-2 flex-wrap">
          <button
            className="text-xs px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            onClick={() => onEdit(row)}
          >
            <div className="flex items-center gap-1">
              <Edit size={14} />
              Edit
            </div>
          </button>
          <button
            className="text-xs px-3 py-1 rounded bg-blue-900/30 text-blue-200 border border-blue-500/30 hover:bg-blue-900/50 transition-colors"
            onClick={() => onManageKPI(row)}
          >
            <div className="flex items-center gap-1">
              <TrendingUp size={14} />
              KPI
            </div>
          </button>
          <button
            className="text-xs px-3 py-1 rounded bg-green-900/30 text-green-200 border border-green-500/30 hover:bg-green-900/50 transition-colors"
            onClick={() => onManagePayroll(row)}
          >
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              Payroll
            </div>
          </button>
          {row.employmentType !== "former" && (
            <button
              className="text-xs px-3 py-1 rounded bg-red-900/30 text-red-200 border border-red-500/30 hover:bg-red-900/50 transition-colors"
              onClick={() => onMarkFormer(row)}
            >
              <div className="flex items-center gap-1">
                <LogOut size={14} />
                Former
              </div>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-lg font-bold text-white">All Employees</h2>
        <p className="text-xs text-lightGrey">
          Manage employee details, KPI, and payroll
        </p>
      </div>
      <Table columns={columns} data={employees} />
    </Card>
  );
};
