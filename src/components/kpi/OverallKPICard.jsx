import { Card } from "../Card";
import { TrendingUp } from "lucide-react";

/**
 * OverallKPICard - Displays overall company KPI score
 * @param {number} score - Current KPI score
 * @param {string} trend - Trend description (e.g., "↑ 0.3 points from last month")
 */
export const OverallKPICard = ({
  score = 8.5,
  trend = "↑ 0.3 points from last month",
}) => {
  return (
    <Card className="mb-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lightGrey text-sm mb-2">Overall Company KPI</p>
          <p className="text-5xl font-bold text-white">{score}</p>
          <p className="text-green-400 text-sm mt-2">{trend}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-6 rounded-lg">
          <TrendingUp size={48} className="text-white" />
        </div>
      </div>
    </Card>
  );
};
