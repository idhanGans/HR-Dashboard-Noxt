interface StatusBadgeProps {
  status: string;
  label?: string;
}

// Reusable Status Badge component
export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
    present: "status-success",
    absent: "status-danger",
    late: "status-warning",
    approved: "status-success",
    pending: "status-warning",
    rejected: "status-danger",
  };

  return (
    <span className={statusStyles[status] || "status-warning"}>
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
