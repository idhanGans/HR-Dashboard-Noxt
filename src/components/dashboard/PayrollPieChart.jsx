import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../Card";

const DEFAULT_COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

/**
 * PayrollPieChart - Displays payroll distribution by department
 * @param {Object} payrollData - Object with labels array and data array
 * @param {Array} colors - Optional array of colors for pie segments
 */
export const PayrollPieChart = ({ payrollData, colors = DEFAULT_COLORS }) => {
  const chartData = payrollData.labels.map((label, idx) => ({
    name: label,
    value: payrollData.data[idx],
  }));

  return (
    <Card className="flex flex-col">
      <h2 className="text-lg font-bold text-white mb-4">
        Payroll by Department
      </h2>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {colors.map((color, idx) => (
                <Cell key={`cell-${idx}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #ffffff20",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
