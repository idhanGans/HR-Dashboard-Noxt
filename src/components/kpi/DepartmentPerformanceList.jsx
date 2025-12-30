import { Card } from "../Card";

/**
 * DepartmentPerformanceList - List of departments with performance indicators
 * @param {Array} departments - Array of department KPI objects
 */
export const DepartmentPerformanceList = ({ departments }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">
        Department Performance
      </h2>
      <div className="space-y-4">
        {departments.map((item) => (
          <div
            key={item.department}
            className="pb-4 border-b border-white/10 last:border-b-0"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-semibold">
                {item.department}
              </span>
              <span
                className={`text-sm font-bold ${
                  item.trend.startsWith("-") ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.trend}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all"
                    style={{ width: `${(item.score / 10) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-white font-semibold min-w-fit">
                {item.score.toFixed(1)}/{item.target}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
