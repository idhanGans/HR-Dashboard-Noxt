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

/**
 * DepartmentKPIChart - Bar chart comparing department KPIs vs targets
 * @param {Array} data - Array of department data objects
 */
export const DepartmentKPIChart = ({ data }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">
        Department KPI Comparison
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis domain={[7, 9]} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #ffffff20",
            }}
          />
          <Legend />
          <Bar dataKey="score" fill="#10b981" name="Current Score" />
          <Bar dataKey="target" fill="#f59e0b" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
