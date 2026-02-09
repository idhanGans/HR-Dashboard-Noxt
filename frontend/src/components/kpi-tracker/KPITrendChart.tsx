import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../Card";

interface TrendDataPoint {
  period: string;
  score: number;
}

interface KPITrendChartProps {
  data: TrendDataPoint[];
  isLoading: boolean;
}

/**
 * KPITrendChart - Line chart showing KPI score trend for last 6 periods
 */
export const KPITrackerTrendChart = ({
  data,
  isLoading,
}: KPITrendChartProps) => {
  if (isLoading) {
    return (
      <Card className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          KPI Trend (6 Months)
        </h2>
        <div className="h-72 sm:h-[350px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-48 w-full bg-white/5 rounded-lg" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          KPI Trend (6 Months)
        </h2>
        <div className="h-72 sm:h-[350px] flex items-center justify-center text-lightGrey">
          No trend data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4">
        KPI Trend (6 Months)
      </h2>
      <div className="h-72 sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
            <XAxis
              dataKey="period"
              stroke="#9ca3af"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#9ca3af"
              fontSize={12}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2a2a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value: number | undefined) => [
                value != null ? value.toFixed(1) : "0",
                "Score",
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#60a5fa"
              strokeWidth={3}
              name="KPI Score"
              dot={{ fill: "#60a5fa", r: 5, strokeWidth: 2, stroke: "#1e3a5f" }}
              activeDot={{
                r: 7,
                fill: "#93c5fd",
                stroke: "#60a5fa",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
