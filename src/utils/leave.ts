export const KNOWN_LEAVE_LABELS: Record<string, string> = {
  PAID_LEAVE: "Paid Leave",
  UNPAID_LEAVE: "Unpaid Leave",
  SICK_LEAVE: "Sick Leave",
  URGENT_LEAVE: "Urgent Leave",
};

export const LEAVE_TYPES = Object.keys(KNOWN_LEAVE_LABELS);

export const LEAVE_TYPE_OPTIONS = Object.entries(KNOWN_LEAVE_LABELS).map(
  ([value, label]) => ({ value, label })
);

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatLeaveType = (value?: string) => {
  if (!value) return "";
  if (KNOWN_LEAVE_LABELS[value]) return KNOWN_LEAVE_LABELS[value];
  if (value.includes("_")) {
    return toTitleCase(value.replace(/_/g, " "));
  }
  return value;
};
