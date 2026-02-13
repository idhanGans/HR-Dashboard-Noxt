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
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { KPITrendData } from "../../types";

interface KPITrendChartProps {
  data: KPITrendData[];
  title?: string;
}

/**
 * KPITrendChart - Displays KPI trend line chart
 * @param {Array} data - Array of KPI data objects with month and value keys
 * @param {string} title - Chart title (default: "KPI Trend")
 */
export const KPITrendChart = ({
  data,
  title = "KPI Trend",
}: KPITrendChartProps) => {
  const isCompactLabel = useMediaQuery("(max-width: 639px)");
  const tickFormatter = (value: string) => value.split(" ")[0] ?? value;

  return (
    <Card className="flex flex-col">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              interval={0}
              minTickGap={0}
              tickMargin={8}
              tickFormatter={tickFormatter}
              angle={isCompactLabel ? -35 : 0}
              textAnchor={isCompactLabel ? "end" : "middle"}
              height={isCompactLabel ? 50 : 30}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #ffffff20",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#c0c0c0"
              strokeWidth={3}
              dot={{ fill: "#c0c0c0", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
