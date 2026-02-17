import type { ComponentType } from "react";
import { TrendingUp, Users, Clock } from "lucide-react";
import { DashboardLayout, Card } from "../components";
import {
  StatCard,
  AttendanceChart,
  KPITrendChart,
  PayrollPieChart,
  QuickActions,
  OrganizationChart,
} from "../components/dashboard";
import { hasRequiredRole } from "../utils/roles";
import {
  useDashboardOverview,
  usePayrollByDepartment,
} from "../hooks/useDashboardOverview";
import type { AttendanceData, DashboardStats, KPITrendData } from "../types";
import type { LayoutProps } from "../types/auth";

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

const DashboardHeader = () => (
  <div className="mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
      Dashboard
    </h1>
    <p className="text-lightGrey">Welcome back! Here's your HR overview.</p>
  </div>
);

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

const ChartsSection = ({
  attendance,
  kpiData,
}: {
  attendance: AttendanceData[];
  kpiData: KPITrendData[];
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <AttendanceChart data={attendance} />
    <KPITrendChart data={kpiData} />
  </div>
);

const PayrollPanel = ({
  loading,
  error,
  payrollData,
}: {
  loading: boolean;
  error: string | null;
  payrollData?: { labels: string[]; data: number[] };
}) => {
  if (loading) {
    return (
      <Card className="flex flex-col">
        <h2 className="text-lg font-bold text-white mb-4">
          Payroll by Department
        </h2>
        <p className="text-lightGrey">Loading payroll data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <h2 className="text-lg font-bold text-white mb-4">
          Payroll by Department
        </h2>
        <p className="text-red-400">{error}</p>
      </Card>
    );
  }

  return (
    <PayrollPieChart payrollData={payrollData ?? { labels: [], data: [] }} />
  );
};

const BottomSection = ({
  canSeePayroll,
  payrollData,
  payrollLoading,
  payrollError,
}: {
  canSeePayroll: boolean;
  payrollData?: { labels: string[]; data: number[] };
  payrollLoading: boolean;
  payrollError: string | null;
}) => {
  if (!canSeePayroll) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PayrollPanel
        loading={payrollLoading}
        error={payrollError}
        payrollData={payrollData}
      />
      <QuickActions />
    </div>
  );
};
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

const AdminDashboard = ({ onLogout, userName, userRole }: LayoutProps) => {
  const canSeeSupervisorDashboard = hasRequiredRole(userRole, ["SUPERVISOR"]);
  const canSeePayroll = hasRequiredRole(userRole, ["SUPERADMIN"]);

  const overview = useDashboardOverview({
    enabled: canSeeSupervisorDashboard,
    months: 12,
  });

  const payroll = usePayrollByDepartment({ enabled: canSeePayroll });

  const stats: DashboardStats = {
    totalEmployees: overview.data?.totalEmployees ?? 0,
    todayAttendance: overview.data?.todayAttendance ?? 0,
    averageKPI: overview.data?.averageKpi ?? 0,
    currentPayroll: 0,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <DashboardHeader />

      {!canSeeSupervisorDashboard ? (
        <OrganizationChartSection />
      ) : overview.isLoading ? (
        <div className="text-center py-8 text-lightGrey">
          Loading dashboard...
        </div>
      ) : overview.error ? (
        <>
          <div className="text-center py-8 text-red-400">
            {overview.error instanceof Error
              ? overview.error.message
              : "Failed to load dashboard"}
          </div>
          <OrganizationChartSection />
        </>
      ) : (
        <>
          <StatsGrid stats={stats} />
          <ChartsSection
            attendance={overview.data?.monthlyAttendance ?? []}
            kpiData={overview.data?.kpiTrend ?? []}
          />
          <BottomSection
            canSeePayroll={canSeePayroll}
            payrollData={payroll.data}
            payrollLoading={payroll.isLoading}
            payrollError={
              payroll.error instanceof Error ? payroll.error.message : null
            }
          />
          <OrganizationChartSection />
        </>
      )}
    </DashboardLayout>
  );
};

export { AdminDashboard as DashboardPage };

