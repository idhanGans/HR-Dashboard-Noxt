import { Card } from "../Card";
import { Table } from "../Table";
import { Button } from "../Button";

const STATUS_STYLES = {
  Open: "status-success",
  "On Hold": "status-warning",
  Closed: "status-danger",
};

export const OpenPositionsTable = ({ positions }) => {
  const columns = [
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "manager", label: "Hiring Manager" },
    { key: "applicants", label: "Applicants" },
    { key: "stage", label: "Current Stage" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={STATUS_STYLES[row.status] || "status-warning"}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Open Positions</h3>
          <p className="text-sm text-lightGrey">
            Focus on roles needing more applicants.
          </p>
        </div>
        <Button variant="ghost">View All</Button>
      </div>
      <Table columns={columns} data={positions} />
    </Card>
  );
};
