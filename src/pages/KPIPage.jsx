import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, DashboardLayout } from "../components";
import { kpiTrendData } from "../utils/dummyData";
import { TrendingUp } from "lucide-react";

// KPI tracking page
export const KPIPage = ({ onLogout, userName, userRole }) => {
  const departmentKPI = [
    { department: "Engineering", score: 8.7, target: 8.5, trend: "+5%" },
    { department: "Sales", score: 8.2, target: 8.0, trend: "+3%" },
    { department: "HR", score: 8.9, target: 9.0, trend: "-1%" },
    { department: "Marketing", score: 8.0, target: 8.0, trend: "0%" },
    { department: "Operations", score: 8.4, target: 8.5, trend: "+2%" },
  ];

  const departmentData = departmentKPI.map((item) => ({
    name: item.department,
    score: item.score,
    target: item.target,
  }));

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">KPI Tracker</h1>
        <p className="text-lightGrey">
          Monitor key performance indicators across departments.
        </p>
      </div>

      {/* Overall KPI Card */}
      <Card className="mb-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lightGrey text-sm mb-2">Overall Company KPI</p>
            <p className="text-5xl font-bold text-white">8.5</p>
            <p className="text-green-400 text-sm mt-2">
              ↑ 0.3 points from last month
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-6 rounded-lg">
            <TrendingUp size={48} className="text-white" />
          </div>
        </div>
      </Card>

      {/* KPI Trend Chart */}
      <Card className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          KPI Trend (6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={kpiTrendData}>
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

      {/* Department KPI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart */}
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Department KPI Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
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

        {/* Department List */}
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Department Performance
          </h2>
          <div className="space-y-4">
            {departmentKPI.map((item) => (
              <div
                key={item.department}
                className="pb-4 border-b border-white/10 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-semibold">
                    {item.department}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      item.trend.startsWith("-")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-semibold min-w-fit">
                    {item.score.toFixed(1)}/{item.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* KPI Insights */}
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
            <p className="text-green-400 text-sm font-semibold mb-2">
              Top Performer
            </p>
            <p className="text-white font-bold text-lg">HR Department</p>
            <p className="text-lightGrey text-xs mt-1">Score: 8.9/10</p>
          </div>
          <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <p className="text-blue-400 text-sm font-semibold mb-2">
              Most Improved
            </p>
            <p className="text-white font-bold text-lg">Engineering</p>
            <p className="text-lightGrey text-xs mt-1">
              +5% improvement this month
            </p>
          </div>
          <div className="p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-semibold mb-2">
              Needs Attention
            </p>
            <p className="text-white font-bold text-lg">Marketing</p>
            <p className="text-lightGrey text-xs mt-1">
              Below target performance
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};
