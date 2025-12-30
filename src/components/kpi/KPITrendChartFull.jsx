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
import { Card } from "../Card";

/**
 * KPITrendChartFull - Full KPI trend line chart with legend
 * @param {Array} data - Array of KPI data objects with month and value keys
 * @param {string} title - Chart title
 */
export const KPITrendChartFull = ({ data, title = "KPI Trend (6 Months)" }) => {
  return (
    <Card className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis domain={[7, 9]} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #ffffff20",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#c0c0c0"
            strokeWidth={3}
            name="Current KPI"
            dot={{ fill: "#c0c0c0", r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
