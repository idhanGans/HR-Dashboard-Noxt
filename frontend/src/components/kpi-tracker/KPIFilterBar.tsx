import { Search, RotateCcw } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { DropdownSelect } from "../DropdownSelect";
import { useKPITrackerStore } from "../../stores/kpiTrackerStore";
import type { SelectOption } from "../DropdownSelect";
import type { KpiPeriodApiResponse } from "../../types/api";
import type { DepartmentOption } from "../../types/api/kpi-tracker";

interface KPIFilterBarProps {
  departments: DepartmentOption[];
  periods: KpiPeriodApiResponse[];
  isLoading: boolean;
}

/**
 * KPIFilterBar - Search, department filter, period filter, and reset button
 */
export const KPIFilterBar = ({
  departments,
  periods,
  isLoading,
}: KPIFilterBarProps) => {
  const { filters, setSearch, setDepartmentId, setPeriodId, resetFilters } =
    useKPITrackerStore();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const departmentOptions: SelectOption[] = departments.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  const periodOptions: SelectOption[] = periods.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const hasActiveFilters =
    filters.search !== "" ||
    filters.departmentId !== null ||
    filters.periodId !== null;

  return (
    <div className="glass-card mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full lg:max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-lightGrey"
          />
          <input
            type="text"
            placeholder="Search employee name..."
            defaultValue={filters.search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="glass-input pl-10 w-full"
            aria-label="Search employees"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full lg:w-48">
          <DropdownSelect
            value={filters.departmentId}
            onChange={(val) => setDepartmentId(val as string | null)}
            options={departmentOptions}
            placeholder="All Departments"
            showEmptyOption
            emptyOptionLabel="All Departments"
            isLoading={isLoading}
            size="compact"
            ariaLabel="Filter by department"
          />
        </div>

        {/* Period Filter */}
        <div className="w-full lg:w-48">
          <DropdownSelect
            value={filters.periodId}
            onChange={(val) => setPeriodId(val as number | null)}
            options={periodOptions}
            placeholder="All Periods"
            showEmptyOption
            emptyOptionLabel="All Periods"
            isLoading={isLoading}
            size="compact"
            ariaLabel="Filter by period"
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-lightGrey hover:text-white 
                       bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            aria-label="Reset all filters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
