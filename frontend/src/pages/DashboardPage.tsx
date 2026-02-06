import { DashboardLayout } from "../components";
import {
  StatCard,
  AttendanceChart,
  KPITrendChart,
  PayrollPieChart,
  QuickActions,
  TopPerformersCard,
  OrganizationChart,
} from "../components/dashboard";
import {
  dashboardStats,
  attendanceData,
  payrollByDepartment,
} from "../utils/dummyData";
import { TrendingUp, Users, Clock } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import type { ComponentType } from "react";
import type { DashboardStats, Employee, KPITrendData } from "../types";
import type { LayoutProps } from "../types/auth";

// Dashboard stats configuration
type StatConfig = {
  label: string;
  valueKey: keyof DashboardStats;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  format?: (value: number, stats: DashboardStats) => string | number;
};

const STATS_CONFIG: StatConfig[] = [
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
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
      Dashboard
    </h1>
    <p className="text-lightGrey">Welcome back! Here's your HR overview.</p>
  </div>
);

/**
 * StatsGrid - Grid of stat cards
 */
const StatsGrid = ({ stats }: { stats: DashboardStats }) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map(({ label, value, icon, color }) => (
        <StatCard
          key={label}
          label={label}
          value={value}
          icon={icon}
          color={color}
        />
      ))}
    </div>
  );
};

/**
 * ChartsSection - Section containing attendance and KPI charts
 */
const ChartsSection = ({ kpiData }: { kpiData: KPITrendData[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <AttendanceChart data={attendanceData} />
    <KPITrendChart data={kpiData} />
  </div>
);

/**
 * BottomSection - Payroll pie chart, quick actions, and top performers
 */
const BottomSection = ({ topPerformers }: { topPerformers: Employee[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <PayrollPieChart payrollData={payrollByDepartment} />
    <QuickActions />
    <TopPerformersCard performers={topPerformers} />
  </div>
);

/**
 * OrganizationChartSection - Organization chart display
 */
const OrganizationChartSection = () => {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Organization Structure</h2>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm overflow-auto">
        <OrganizationChart />
      </div>
    </div>
  );
};

/**
 * AdminDashboard - Main admin dashboard view with real employee data
 */
const AdminDashboard = ({ onLogout, userName, userRole }: LayoutProps) => {
  const { totalEmployees, presentToday, overallKPI, kpiTrend, topPerformers } =
    useDashboardStats();

  // Update dashboard stats with real-time data
  const updatedStats = {
    ...dashboardStats,
    totalEmployees,
    todayAttendance: presentToday,
    averageKPI: overallKPI,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <DashboardHeader />
      <StatsGrid stats={updatedStats} />
      <ChartsSection kpiData={kpiTrend} />
      <BottomSection topPerformers={topPerformers} />
      <OrganizationChartSection />
    </DashboardLayout>
  );
};

export { AdminDashboard as DashboardPage };
