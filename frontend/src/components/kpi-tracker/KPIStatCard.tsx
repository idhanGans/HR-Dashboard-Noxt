import { Card } from "../Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIStatCardProps {
  score: number;
  isLoading: boolean;
}

/**
 * KPIStatCard - Overall company KPI score card with color indicator
 */
export const KPIStatCard = ({ score, isLoading }: KPIStatCardProps) => {
  const getScoreColor = (value: number): string => {
    if (value >= 8) return "text-green-400";
    if (value >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusLabel = (value: number): string => {
    if (value >= 8) return "Excellent";
    if (value >= 6) return "Good";
    if (value > 0) return "Needs Improvement";
    return "N/A";
  };

  const getTrendIcon = (value: number) => {
    if (value >= 8) return <TrendingUp size={48} className="text-white" />;
    if (value >= 6) return <Minus size={48} className="text-white" />;
    return <TrendingDown size={48} className="text-white" />;
  };

  const getGradient = (value: number): string => {
    if (value >= 8) return "from-green-600 to-green-400";
    if (value >= 6) return "from-yellow-600 to-yellow-400";
    if (value > 0) return "from-red-600 to-red-400";
    return "from-blue-600 to-blue-400";
  };

  if (isLoading) {
    return (
      <Card className="mb-8 p-8">
        <div className="flex items-center justify-between animate-pulse">
          <div>
            <div className="h-4 bg-white/10 rounded w-40 mb-3" />
            <div className="h-12 bg-white/10 rounded w-20 mb-2" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
          <div className="bg-white/10 p-6 rounded-lg w-20 h-20" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lightGrey text-sm mb-2">Overall Company KPI</p>
          <p className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </p>
          <p className={`text-sm mt-2 ${getScoreColor(score)}`}>
            {getStatusLabel(score)}
          </p>
        </div>
        <div
          className={`bg-gradient-to-br ${getGradient(score)} p-6 rounded-lg`}
        >
          {getTrendIcon(score)}
        </div>
      </div>
    </Card>
  );
};
