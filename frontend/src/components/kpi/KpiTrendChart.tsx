/**
 * KpiTrendChart - KPI Trend chart component
 * Displays a line chart of company KPI average over the last 6 months
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useKpiStore } from "../../stores/useKpiStore";

interface KpiTrendChartProps {
  isLoading?: boolean;
  height?: number;
}

export const KpiTrendChart = ({
  isLoading = false,
  height = 400,
}: KpiTrendChartProps) => {
  const { getTrendData } = useKpiStore();

  const trendData = getTrendData();

  const hasData =
    trendData.length > 0 && trendData.some((d) => d.companyAverageScore > 0);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8L5.228 15.228a1 1 0 00-.001 1.414l1.414 1.414a1 1 0 001.414 0L22 9"
            />
          </svg>
          KPI Trend (6 Months)
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Company average performance across evaluation periods
        </p>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div
          className="flex items-center justify-center bg-gray-700/20 rounded-lg"
          style={{ height: `${height}px` }}
        >
          <div className="text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <p className="mt-2 text-sm">Loading chart...</p>
          </div>
        </div>
      ) : !hasData ? (
        <div
          className="flex items-center justify-center bg-gray-700/20 rounded-lg"
          style={{ height: `${height}px` }}
        >
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4V9.414a1 1 0 00-.293-.707L3.293 2.293A1 1 0 013 2.586V4z"
              />
            </svg>
            <p className="text-sm font-medium">No trend data available</p>
            <p className="text-xs mt-1">
              Add KPI evaluations to see performance trends
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-lg bg-gray-700/20 p-4">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#404040"
                vertical={false}
              />
              <XAxis
                dataKey="periodName"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#9ca3af" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(value: any) => [
                  `${(value as number).toFixed(2)}`,
                  "Company Avg",
                ]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="companyAverageScore"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  fill: "#3b82f6",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#1e40af",
                }}
                activeDot={{
                  r: 7,
                  fill: "#60a5fa",
                }}
                isAnimationActive={true}
                animationDuration={800}
                name="Company Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Footer */}
      {hasData && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="px-4 py-2 bg-gray-700/30 rounded text-center">
            <p className="text-xs text-gray-400">Latest Score</p>
            <p className="text-lg font-semibold text-blue-400 mt-1">
              {trendData[trendData.length - 1]?.companyAverageScore.toFixed(
                1,
              ) || "N/A"}
            </p>
          </div>
          <div className="px-4 py-2 bg-gray-700/30 rounded text-center">
            <p className="text-xs text-gray-400">Highest</p>
            <p className="text-lg font-semibold text-green-400 mt-1">
              {Math.max(...trendData.map((d) => d.companyAverageScore)).toFixed(
                1,
              )}
            </p>
          </div>
          <div className="px-4 py-2 bg-gray-700/30 rounded text-center">
            <p className="text-xs text-gray-400">Lowest</p>
            <p className="text-lg font-semibold text-yellow-400 mt-1">
              {Math.min(...trendData.map((d) => d.companyAverageScore)).toFixed(
                1,
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
