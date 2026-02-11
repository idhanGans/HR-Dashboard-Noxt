import { Plus } from "lucide-react";
import { Button } from "../Button";
import { ManageDepartmentButton } from "./department";
import { DepartmentSelect } from "./department";

/**
 * EmployeeHeader - Page header with search, department filter, and add button
 * @param {string} search - Current search term
 * @param {Function} onSearchChange - Callback when search changes
 * @param {Function} onAddClick - Callback when add button is clicked
 * @param {string} userRole - Current user's role
 * @param {Function} onManageDepartments - Callback to open department management
 * @param {number | null} departmentFilter - Current department filter value
 * @param {Function} onDepartmentFilterChange - Callback when department filter changes
 */
export const EmployeeHeader = ({
  search,
  onSearchChange,
  onAddClick,
  userRole = "EMPLOYEE",
  onManageDepartments,
  departmentFilter = null,
  onDepartmentFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  userRole?: string;
  onManageDepartments?: () => void;
  departmentFilter?: number | null;
  onDepartmentFilterChange?: (value: string | number | null) => void;
}) => {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Employee Directory
        </h1>
        <p className="text-lightGrey">
          Manage your full employee database: add, edit, and set employment
          type.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name"
          className="glass-input w-full sm:w-60"
        />
        {onDepartmentFilterChange && (
          <div className="w-full sm:w-48">
            <DepartmentSelect
              value={departmentFilter}
              onChange={onDepartmentFilterChange}
              placeholder="All Departments"
              showEmptyOption
              size="default"
            />
          </div>
        )}
        {onManageDepartments && (
          <ManageDepartmentButton
            onClick={onManageDepartments}
            userRole={userRole}
          />
        )}
        <Button
          onClick={onAddClick}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Employee
        </Button>
      </div>
    </div>
  );
};
