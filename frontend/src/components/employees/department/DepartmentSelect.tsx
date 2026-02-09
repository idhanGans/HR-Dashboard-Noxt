import { useMemo } from "react";
import { DropdownSelect } from "../../DropdownSelect";
import { useDepartments } from "../../../hooks/useDepartments";
import type { SelectOption } from "../../DropdownSelect";

interface DepartmentSelectProps {
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  showEmptyOption?: boolean;
  ariaLabel?: string;
  /** Size variant passed to DropdownSelect */
  size?: "default" | "compact";
  className?: string;
}

/**
 * DepartmentSelect - Dropdown populated from Department API
 * For use in Employee forms and filter bars
 */
export const DepartmentSelect = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select Department",
  showEmptyOption = true,
  ariaLabel = "Select department",
  size = "default",
  className,
}: DepartmentSelectProps) => {
  const { data: departments, isLoading, isError } = useDepartments();

  const options: SelectOption[] = useMemo(() => {
    if (!departments) return [];
    return departments
      .filter((dept) => dept.status === "ACTIVE")
      .map((dept) => ({
        value: dept.name,
        label: dept.name,
      }));
  }, [departments]);

  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      isLoading={isLoading}
      error={isError ? "Failed to load departments" : null}
      showEmptyOption={showEmptyOption}
      ariaLabel={ariaLabel}
      size={size}
      className={className}
    />
  );
};
