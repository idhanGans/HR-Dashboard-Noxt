import { DashboardLayout } from "../components";
import {
  OverallKPICard,
  KPITrendChartFull,
  DepartmentKPIChart,
  DepartmentPerformanceList,
  PerformanceInsights,
  KPIHeader,
} from "../components/kpi";
import { useKPIData } from "../hooks/useKPIData";
import type { DepartmentKPIStats } from "../types/employee";
import type { LayoutProps } from "../types/auth";

/**
 * ComparisonSection - Department KPI comparison grid
 */
const ComparisonSection = ({
  chartData,
  listData,
}: {
  chartData: { name: string; score: number; target: number; trend?: string }[];
  listData: DepartmentKPIStats[];
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <DepartmentKPIChart data={chartData} />
    <DepartmentPerformanceList departments={listData} />
  </div>
);

/**
 * KPIPage - KPI tracking page with backend data
 */
export const KPIPage = ({ onLogout, userName, userRole }: LayoutProps) => {
  const {
    overallScore,
    trendData,
    departmentStats,
    performanceInsights,
    loading,
    error,
  } = useKPIData();

  // Calculate trend from last period
  const lastTwoMonths = trendData.slice(-2);
  const trend =
    lastTwoMonths.length === 2
      ? `↑ ${(lastTwoMonths[1].value - lastTwoMonths[0].value).toFixed(
          1
        )} points from last month`
      : "N/A";

  // Format department data for charts
  const departmentChartData = departmentStats.map((dept) => ({
    name: dept.department,
    score: dept.score,
    target: dept.target,
    trend: dept.trend,
  }));

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <KPIHeader />

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading data...</span>
        </div>
      ) : (
        <>
          <OverallKPICard score={overallScore} trend={trend} />

          <KPITrendChartFull data={trendData} />

          <ComparisonSection
            chartData={departmentChartData}
            listData={departmentStats}
          />

          <PerformanceInsights insights={performanceInsights} />
        </>
      )}
    </DashboardLayout>
  );
};
