import { Card } from "../Card";
import { AvatarDisplay } from "../AvatarDisplay";
import { Edit, LogOut, DollarSign, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useAvatarUrl } from "../../hooks/useAvatar";
import { DepartmentBadge } from "./department";
import type { Employee } from "../../types";

/**
 * EmployeeAvatar - Avatar component that fetches URL from backend
 */
const EmployeeAvatar = ({
  employeeId,
  name,
}: {
  employeeId: number;
  name: string;
}) => {
  const { avatarUrl } = useAvatarUrl(employeeId);
  return <AvatarDisplay src={avatarUrl} name={name} size="sm" />;
};

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onMarkFormer: (employee: Employee) => void;
  onManagePayroll: (employee: Employee) => void;
  canManagePayroll?: boolean;
}

/**
 * EmployeeTable - Displays employee data in a table with detailed directory view
 * @param {Array} employees - Array of employee objects
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onMarkFormer - Callback when mark former button is clicked
 * @param {Function} onManagePayroll - Callback when manage payroll button is clicked
 */
export const EmployeeTable = ({
  employees,
  onEdit,
  onMarkFormer,
  onManagePayroll,
  canManagePayroll = true,
}: EmployeeTableProps) => {
  const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenMenuId(null);
      setAnchorEl(null);
    }, 100);
    setCloseTimeout(timeout);
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  useEffect(() => {
    if (!openMenuId || !anchorEl) return;

    let frameId = 0;
    const updatePosition = () => {
      if (!menuRef.current) return;

      const menuBounds = menuRef.current.getBoundingClientRect();
      const anchorBounds = anchorEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const maxHeight = Math.max(220, Math.floor(viewportHeight * 0.7));

      let top = anchorBounds.bottom + scrollY + 6;
      if (
        top + menuBounds.height > scrollY + viewportHeight - 8 &&
        anchorBounds.top + scrollY - menuBounds.height - 6 > scrollY + 8
      ) {
        top = anchorBounds.top + scrollY - menuBounds.height - 6;
      }

      let left = anchorBounds.right + scrollX - menuBounds.width;
      const minLeft = scrollX + 8;
      const maxLeft = scrollX + viewportWidth - menuBounds.width - 8;
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      setMenuStyle({
        position: "absolute",
        top,
        left,
        maxHeight,
      });
    };

    const scheduleUpdate = () => {
      frameId = window.requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);
    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [openMenuId, anchorEl]);

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
          <EmployeeAvatar employeeId={row.id} name={row.name} />
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
      render: (row: Employee) => <DepartmentBadge name={row.department} />,
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
            onClick={(event) => {
              if (openMenuId === row.id) {
                setOpenMenuId(null);
                setAnchorEl(null);
                return;
              }
              setAnchorEl(event.currentTarget);
              setOpenMenuId(row.id);
            }}
            className="p-2 hover:bg-white/10 rounded transition-colors text-lightGrey hover:text-white"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {openMenuId === row.id &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={menuRef}
                style={menuStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-56 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/40 rounded-lg shadow-2xl z-50 py-2 overflow-y-auto"
              >
                {/* Edit Option */}
                <button
                  onClick={() => {
                    onEdit(row);
                    setOpenMenuId(null);
                    setAnchorEl(null);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-white font-medium hover:bg-white/35 flex items-center gap-3 transition-all duration-200"
                >
                  <Edit size={18} className="text-blue-300" />
                  <span>Edit Employee</span>
                </button>

                {/* Payroll Option */}
                {canManagePayroll && (
                  <button
                    onClick={() => {
                      onManagePayroll(row);
                      setOpenMenuId(null);
                      setAnchorEl(null);
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-white font-medium hover:bg-white/35 flex items-center gap-3 transition-all duration-200"
                  >
                    <DollarSign size={18} className="text-green-400" />
                    <span>Manage Payroll</span>
                  </button>
                )}

                {/* Divider */}
                {row.employmentType !== "FORMER" && (
                  <>
                    <div className="border-t border-white/25 my-2"></div>

                    {/* Mark Former Option */}
                    <button
                      onClick={() => {
                        onMarkFormer(row);
                        setOpenMenuId(null);
                        setAnchorEl(null);
                      }}
                      className="w-full px-5 py-3 text-left text-sm text-red-300 font-medium hover:bg-red-900/40 flex items-center gap-3 transition-all duration-200"
                    >
                      <LogOut size={18} className="text-red-400" />
                      <span>Mark as Former</span>
                    </button>
                  </>
                )}
              </div>,
              document.body,
            )}
        </div>
      ),
    },
  ];

  return (
    <Card className="mb-8 overflow-visible">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Employee Directory</h2>
          <p className="text-xs text-lightGrey mt-1">
            {employees.length} total employees
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto overflow-y-visible">
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
