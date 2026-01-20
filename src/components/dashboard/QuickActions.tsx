import { useNavigate } from "react-router-dom";
import { Card } from "../Card";
import { Button } from "../Button";

/**
 * QuickActions - Navigation buttons for quick access to other pages
 */
export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "View Employee Reports", path: "/employees" },
    { label: "Manage Payroll", path: "/payroll" },
    { label: "Review Attendance", path: "/attendance" },
    { label: "Employee Analytics", path: "/kpi" },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="space-y-3">
          {actions.map(({ label, path }) => (
            <Button
              key={path}
              variant="secondary"
              className="w-full"
              onClick={() => navigate(path)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
