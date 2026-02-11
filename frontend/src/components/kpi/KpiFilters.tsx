/**
 * KpiFilters - Filter section for KPI Tracker
 * Allows filtering by employee name, department, period, and status
 */

import { useState, useEffect } from "react";
import { useKpiStore } from "../../stores/useKpiStore";

interface KpiFiltersProps {
  onFilterChange?: () => void;
}

export const KpiFilters = ({ onFilterChange }: KpiFiltersProps) => {
  const {
    filters,
    setFilters,
    resetFilters,
    periods,
    employees,
    activePeriodId,
  } = useKpiStore();

  // Local state for search debouncing
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput });
      onFilterChange?.();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, setFilters, onFilterChange]);

  // Get unique departments from employees
  const departments = Array.from(
    new Set(employees.map((e) => e.department)),
  ).sort();

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      department: e.target.value || undefined,
    });
    onFilterChange?.();
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      periodId: e.target.value || undefined,
    });
    onFilterChange?.();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as
      | "Excellent"
      | "Good"
      | "Warning"
      | "Critical"
      | undefined;
    setFilters({
      status: value,
    });
    onFilterChange?.();
  };

  const handleResetFilters = () => {
    setSearchInput("");
    resetFilters();
    onFilterChange?.();
  };

  const hasActiveFilters =
    filters.search ||
    filters.department ||
    filters.status ||
    (filters.periodId && filters.periodId !== activePeriodId);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by Employee Name */}
        <div>
          <label
            htmlFor="search"
            className="block text-xs font-medium text-gray-400 mb-2"
          >
            Search Employee
          </label>
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Employee name..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label
            htmlFor="department"
            className="block text-xs font-medium text-gray-400 mb-2"
          >
            Department
          </label>
          <select
            id="department"
            value={filters.department || ""}
            onChange={handleDepartmentChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div>
          <label
            htmlFor="period"
            className="block text-xs font-medium text-gray-400 mb-2"
          >
            Period
          </label>
          <select
            id="period"
            value={filters.periodId || activePeriodId || ""}
            onChange={handlePeriodChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} {period.isActive ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-xs font-medium text-gray-400 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">All Status</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
              <span>Search: {filters.search}</span>
              <button
                onClick={() => setSearchInput("")}
                className="hover:text-blue-300 transition"
              >
                ✕
              </button>
            </div>
          )}
          {filters.department && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">
              <span>{filters.department}</span>
              <button
                onClick={() => setFilters({ department: undefined })}
                className="hover:text-purple-300 transition"
              >
                ✕
              </button>
            </div>
          )}
          {filters.status && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
              <span>{filters.status}</span>
              <button
                onClick={() => setFilters({ status: undefined })}
                className="hover:text-green-300 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
