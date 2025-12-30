import { Plus } from "lucide-react";
import { Button } from "../Button";

/**
 * EmployeeHeader - Page header with search and add button
 * @param {string} search - Current search term
 * @param {Function} onSearchChange - Callback when search changes
 * @param {Function} onAddClick - Callback when add button is clicked
 */
export const EmployeeHeader = ({ search, onSearchChange, onAddClick }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Employee Directory
        </h1>
        <p className="text-lightGrey">
          Manage your full employee database: add, edit, and set employment
          type.
        </p>
      </div>
      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name"
          className="glass-input w-60"
        />
        <Button onClick={onAddClick} className="flex items-center gap-2">
          <Plus size={18} />
          Add Employee
        </Button>
      </div>
    </div>
  );
};
