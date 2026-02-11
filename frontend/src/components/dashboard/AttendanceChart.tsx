import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../Card";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { AttendanceData } from "../../types";

interface AttendanceChartProps {
  data: AttendanceData[];
}

/**
 * AttendanceChart - Displays monthly attendance bar chart
 * @param {Array} data - Array of attendance data objects with month, present, absent, late keys
 */
export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  const isCompactLabel = useMediaQuery("(max-width: 639px)");
  const tickFormatter = (value: string) => value.split(" ")[0] ?? value;

  return (
    <Card className="flex flex-col">
      <h2 className="text-lg font-bold text-white mb-4">Monthly Attendance</h2>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Legend />
            <Bar dataKey="present" fill="#10b981" name="Present" />
            <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            <Bar dataKey="late" fill="#f59e0b" name="Late" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
