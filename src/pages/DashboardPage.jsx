import { DashboardLayout } from "../components";
import {
  StatCard,
  AttendanceChart,
  KPITrendChart,
  PayrollPieChart,
  QuickActions,
} from "../components/dashboard";
import {
  dashboardStats,
  attendanceData,
  kpiTrendData,
  payrollByDepartment,
} from "../utils/dummyData";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { formatIDR } from "../utils/format";

// Dashboard stats configuration
const STATS_CONFIG = [
  {
    label: "Total Employees",
    valueKey: "totalEmployees",
    icon: Users,
    color: "from-blue-600 to-blue-400",
  },
  {
    label: "Today's Attendance",
    valueKey: "todayAttendance",
    icon: Clock,
    color: "from-green-600 to-green-400",
    format: (val, stats) => `${val}/${stats.totalEmployees}`,
  },
  {
    label: "Current Month Payroll",
    valueKey: "currentPayroll",
    icon: DollarSign,
    color: "from-purple-600 to-purple-400",
    format: (val) => formatIDR(val),
  },
  {
    label: "Average KPI",
    valueKey: "averageKPI",
    icon: TrendingUp,
    color: "from-orange-600 to-orange-400",
  },
];

/**
 * DashboardHeader - Page header component
 */
const DashboardHeader = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
    <p className="text-lightGrey">Welcome back! Here's your HR overview.</p>
  </div>
);

/**
 * StatsGrid - Grid of stat cards
 */
const StatsGrid = ({ stats }) => {
  const statCards = STATS_CONFIG.map((config) => {
    const rawValue = stats[config.valueKey];
    const value = config.format ? config.format(rawValue, stats) : rawValue;

    return {
      label: config.label,
      value,
      icon: config.icon,
      color: config.color,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map(({ label, value, icon, color }) => (
        <StatCard
          key={label}
          label={label}
          value={value}
          icon={icon}
          color={color}
          trend="↑ 12% from last month"
        />
      ))}
    </div>
  );
};

/**
 * ChartsSection - Section containing attendance and KPI charts
 */
const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <AttendanceChart data={attendanceData} />
    <KPITrendChart data={kpiTrendData} />
  </div>
);

/**
 * BottomSection - Payroll pie chart and quick actions
 */
const BottomSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <PayrollPieChart payrollData={payrollByDepartment} />
    <QuickActions />
  </div>
);

/**
 * AdminDashboard - Main admin dashboard view
 */
const AdminDashboard = ({ onLogout, userName, userRole }) => {
  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <DashboardHeader />
      <StatsGrid stats={dashboardStats} />
      <ChartsSection />
      <BottomSection />
    </DashboardLayout>
  );
};

export { AdminDashboard as DashboardPage };
