import type { DepartmentStatus } from "../../../types/api";

interface DepartmentBadgeProps {
  name: string;
  status?: DepartmentStatus;
  className?: string;
}

const statusStyles: Record<DepartmentStatus, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  INACTIVE: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

/**
 * DepartmentBadge - Pill/badge component showing department name with status color
 */
export const DepartmentBadge = ({
  name,
  status = "ACTIVE",
  className = "",
}: DepartmentBadgeProps) => {
  if (!name) {
    return <span className="text-lightGrey/50 text-sm italic">Unassigned</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "ACTIVE" ? "bg-emerald-400" : "bg-gray-400"
        }`}
      />
      {name}
    </span>
  );
};
