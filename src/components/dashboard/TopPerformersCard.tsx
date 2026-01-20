import { Card } from "../Card";
import { TrendingUp } from "lucide-react";

/**
 * TopPerformersCard - Display top performing employees based on KPI
 * @param {Array} performers - Array of top performing employees
 */
export const TopPerformersCard = ({ performers = [] }) => {
  if (performers.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
            <TrendingUp className="text-yellow-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Top Performers</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          No performance data available
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
          <TrendingUp className="text-yellow-400" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white">Top Performers</h3>
      </div>

      <div className="space-y-4">
        {performers.map((emp, index) => (
          <div
            key={emp.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* Rank Badge */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black"
                  : index === 1
                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                  : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
              }`}
            >
              {index + 1}
            </div>

            {/* Employee Info */}
            <div className="flex-1">
              <p className="text-white font-semibold">{emp.name}</p>
              <p className="text-xs text-gray-400">
                {emp.department} • {emp.role}
              </p>
            </div>

            {/* KPI Score */}
            <div className="text-left sm:text-right">
              <div className="text-2xl font-bold text-white">
                {emp.kpi?.currentScore?.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">KPI Score</div>
            </div>

            {/* Trend */}
            {emp.kpi?.trend && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  emp.kpi.trend.startsWith("+")
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {emp.kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
