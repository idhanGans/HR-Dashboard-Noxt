import { Plus, Filter } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import { ManageDepartmentButton } from "./department";
import type { Department } from "../../types/api";

/**
 * EmployeeHeader - Page header with search, department filter, and add button
 * @param {string} search - Current search term
 * @param {Function} onSearchChange - Callback when search changes
 * @param {Function} onAddClick - Callback when add button is clicked
 * @param {string} userRole - Current user's role
 * @param {Function} onManageDepartments - Callback to open department management
 * @param {Array} departments - Available departments
 * @param {Array} selectedDepartmentIds - Selected department IDs
 * @param {Function} onDepartmentSelectionChange - Callback when selection changes
 */
export const EmployeeHeader = ({
  search,
  onSearchChange,
  onAddClick,
  userRole = "EMPLOYEE",
  onManageDepartments,
  departments = [],
  selectedDepartmentIds = [],
  onDepartmentSelectionChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  userRole?: string;
  onManageDepartments?: () => void;
  departments?: Department[];
  selectedDepartmentIds?: number[];
  onDepartmentSelectionChange?: (ids: number[]) => void;
}) => {
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  const filteredDepartments = useMemo(() => {
    const term = departmentSearch.trim().toLowerCase();
    if (!term) return departments;
    return departments.filter((dept) => dept.name.toLowerCase().includes(term));
  }, [departments, departmentSearch]);

  const handleToggleDepartment = (id: number) => {
    if (!onDepartmentSelectionChange) return;
    if (selectedDepartmentIds.includes(id)) {
      onDepartmentSelectionChange(
        selectedDepartmentIds.filter((deptId) => deptId !== id),
      );
      return;
    }
    onDepartmentSelectionChange([...selectedDepartmentIds, id]);
  };

  const handleSelectAll = () => {
    if (!onDepartmentSelectionChange) return;
    onDepartmentSelectionChange(departments.map((dept) => dept.id));
  };

  const handleClearAll = () => {
    if (!onDepartmentSelectionChange) return;
    onDepartmentSelectionChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsDepartmentOpen(false);
      }
    };

    if (!isDepartmentOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDepartmentOpen]);

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
        {onDepartmentSelectionChange && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsDepartmentOpen((prev) => !prev)}
              className="glass-input w-full sm:w-48 flex items-center justify-between gap-2"
            >
              <span>Departments</span>
              <Filter size={16} className="text-lightGrey" />
            </button>
            {isDepartmentOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">Filter</p>
                </div>
                <div className="px-4 py-3 border-b border-white/10 text-xs text-lightGrey flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Select all {departments.length}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-lightGrey hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <span>Displaying {filteredDepartments.length}</span>
                </div>
                <div className="px-4 py-3 border-b border-white/10">
                  <input
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    placeholder="Search departments"
                    className="glass-input w-full"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto px-2 py-2">
                  {filteredDepartments.length === 0 ? (
                    <p className="text-sm text-lightGrey px-3 py-2">
                      No departments found.
                    </p>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-blue-500"
                          checked={selectedDepartmentIds.includes(dept.id)}
                          onChange={() => handleToggleDepartment(dept.id)}
                        />
                        <span>{dept.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
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
