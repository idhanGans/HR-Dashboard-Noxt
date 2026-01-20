import { Card } from "../Card";

/**
 * EmployeeStats - Display employee statistics cards
 * @param {Object} counts - Object containing total, permanent, temporary, former counts
 */
export const EmployeeStats = ({ counts }) => {
  const stats = [
    {
      label: "Total Employees",
      value: counts.total,
      description: "Active + former records",
      color: "text-green-400",
    },
    {
      label: "Permanent",
      value: counts.permanent,
      description: "Full-time employees",
      color: "text-lightGrey",
    },
    {
      label: "Temporary",
      value: counts.temporary,
      description: "Contract / interns",
      color: "text-lightGrey",
    },
    {
      label: "Former",
      value: counts.former,
      description: "Offboarded",
      color: "text-lightGrey",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, description, color }) => (
        <Card key={label}>
          <p className="text-lightGrey text-sm mb-2">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className={`text-xs ${color} mt-2`}>{description}</p>
        </Card>
      ))}
    </div>
  );
};
