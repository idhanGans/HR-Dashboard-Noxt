import { useMemo } from "react";
import { Card } from "../Card";
import { DropdownSelect } from "../DropdownSelect";
import type { SelectOption } from "../DropdownSelect";
import type { Employee } from "../../types";

/**
 * EmployeeSelector - Dropdown to select employee
 */
export const EmployeeSelector = ({
  employees,
  selectedId,
  onChange,
  isCompactLabel,
  isLoading,
  error,
}: {
  employees: Employee[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
  isCompactLabel: boolean;
  isLoading?: boolean;
  error?: string | null;
}) => {
  const isDisabled = Boolean(isLoading) || (!employees.length && Boolean(error));
  const placeholder = isLoading
    ? "Loading employees..."
    : error
      ? "Unable to load employees"
      : "Choose an employee";
  const options = useMemo<SelectOption[]>(
    () =>
      employees
        .filter((emp) => emp.employmentType !== "FORMER")
        .map((emp) => {
          // On mobile (compact), show only name
          // On desktop, show name - department (role)
          let label: string;
          if (isCompactLabel) {
            label = emp.name;
          } else {
            const withDept = emp.department
              ? `${emp.name} - ${emp.department}`
              : emp.name;
            label = `${withDept} (${emp.role})`;
          }

          return {
            value: emp.id,
            label,
          };
        }),
    [employees, isCompactLabel],
  );

  return (
    <Card className="mb-4 sm:mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Employee
      </label>
      <DropdownSelect
        value={selectedId}
        onChange={(value) =>
          onChange(value === null ? null : Number(value))
        }
        options={options}
        placeholder={placeholder}
        disabled={isDisabled}
        isLoading={isLoading}
        error={error && !employees.length ? "Unable to load employees" : undefined}
        showEmptyOption={!isLoading && !(error && !employees.length)}
        emptyOptionLabel="Choose an employee"
        noOptionsLabel="No employees found"
        ariaLabel="Select employee"
      />
      {error && !employees.length && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </Card>
  );
};
