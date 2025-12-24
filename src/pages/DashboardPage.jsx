import {
  BarChart,
  Bar,
  LineChart,
  Line,
  DoughnutChart,
  Doughnut,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, DashboardLayout, Button } from "../components";
import {
  dashboardStats,
  attendanceData,
  kpiTrendData,
  payrollByDepartment,
} from "../utils/dummyData";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

// Admin Dashboard View
const AdminDashboard = ({ onLogout }) => {
  const stats = [
    {
      label: "Total Employees",
      value: dashboardStats.totalEmployees,
      icon: Users,
      color: "from-blue-600 to-blue-400",
    },
    {
      label: "Today's Attendance",
      value: `${dashboardStats.todayAttendance}/245`,
      icon: Clock,
      color: "from-green-600 to-green-400",
    },
    {
      label: "Current Month Payroll",
      value: `$${dashboardStats.currentPayroll.toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-600 to-purple-400",
    },
    {
      label: "Average KPI",
      value: dashboardStats.averageKPI,
      icon: TrendingUp,
      color: "from-orange-600 to-orange-400",
    },
  ];

  const colors = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <DashboardLayout userRole="Administrator" onLogout={onLogout}>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-lightGrey">Welcome back! Here's your HR overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-lightGrey text-sm mb-2">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
              <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
            <div className="text-xs text-green-400">↑ 12% from last month</div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart */}
        <Card className="flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">
            Monthly Attendance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #ffffff20",
                }}
              />
              <Legend />
              <Bar dataKey="present" fill="#10b981" />
              <Bar dataKey="absent" fill="#ef4444" />
              <Bar dataKey="late" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* KPI Trend Chart */}
        <Card className="flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">KPI Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="month" stroke="#9ca3af" />
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
        </Card>
      </div>

      {/* Payroll by Department */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">
            Payroll by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={payrollByDepartment.labels.map((label, idx) => ({
                  name: label,
                  value: payrollByDepartment.data[idx],
                }))}
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
        </Card>

        {/* Quick Actions */}
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                View Employee Reports
              </Button>
              <Button variant="secondary" className="w-full">
                Manage Payroll
              </Button>
              <Button variant="secondary" className="w-full">
                Review Attendance
              </Button>
              <Button variant="secondary" className="w-full">
                Employee Analytics
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export { AdminDashboard as DashboardPage };
