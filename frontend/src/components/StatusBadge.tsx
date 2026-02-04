interface StatusBadgeProps {
  status: string;
  label?: string;
}

// Reusable Status Badge component
export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const normalizedStatus = status?.toLowerCase?.() ?? "";
  const statusStyles: Record<string, string> = {
    present: "status-success",
    absent: "status-danger",
    late: "status-warning",
    approved: "status-success",
    pending: "status-warning",
    rejected: "status-danger",
  };

  return (
    <span className={statusStyles[normalizedStatus] || "status-warning"}>
      {label ||
        (normalizedStatus
          ? normalizedStatus.charAt(0).toUpperCase() +
            normalizedStatus.slice(1)
          : status)}
    </span>
  );
};
