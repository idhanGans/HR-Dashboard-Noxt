/**
 * KPIFilters Component
 * Filter controls for searching and filtering KPI data
 */

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { KPIFiltersState } from "../../types/kpi-tracker";

interface KPIFiltersProps {
  filters: KPIFiltersState;
  onFilterChange: (filters: Partial<KPIFiltersState>) => void;
  departments: string[];
  periods: { id: string; label: string; isActive?: boolean }[];
  statusOptions: string[];
}

export const KPIFilters = ({
  filters,
  onFilterChange,
  departments,
  periods,
  statusOptions,
}: KPIFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-6"
    >
      <h3 className="text-white font-semibold text-lg mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Employee */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Search Employee
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Employee name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Period
          </label>
          <select
            value={filters.period}
            onChange={(e) => onFilterChange({ period: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.label}>
                {period.label}
                {period.isActive && " (Active)"}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};
