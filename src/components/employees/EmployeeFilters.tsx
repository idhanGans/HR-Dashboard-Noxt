/**
 * EmployeeFilters - Filter buttons for employee types
 * @param {string} filter - Current active filter
 * @param {Function} onFilterChange - Callback when filter changes
 */
export const EmployeeFilters = ({ filter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "permanent", label: "Permanent" },
    { id: "temporary", label: "Temporary" },
    { id: "former", label: "Former" },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {filters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`px-4 py-2 rounded-lg text-sm border transition-all ${
            filter === id
              ? "bg-white/20 text-white border-white/30"
              : "bg-white/5 text-lightGrey border-white/10 hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
