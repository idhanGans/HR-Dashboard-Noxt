import { Card } from "../Card";

/**
 * DepartmentBreakdown - Shows employee distribution by department
 * @param {Array} employees - Array of employee objects
 * @param {Array} departments - Array of department names
 */
export const DepartmentBreakdown = ({ employees, departments }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">
        Department Breakdown
      </h2>
      <div className="space-y-4">
        {departments.map((dept) => {
          const count = employees.filter((e) => e.department === dept).length;
          const percentage =
            employees.length > 0
              ? Math.min((count / employees.length) * 100, 100)
              : 0;

          return (
            <div key={dept} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{dept}</span>
                  <span className="text-lightGrey text-sm">
                    {count} employees
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

DepartmentBreakdown.defaultProps = {
  departments: [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Product",
    "Operations",
    "Finance",
    "Customer Success",
  ],
};
