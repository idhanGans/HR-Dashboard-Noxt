import { DashboardLayout } from "../components";
import {
  OverallKPICard,
  KPITrendChartFull,
  DepartmentKPIChart,
  DepartmentPerformanceList,
  PerformanceInsights,
  KPIHeader,
} from "../components/kpi";
import { useEmployees } from "../hooks/useEmployees";

/**
 * ComparisonSection - Department KPI comparison grid
 */
const ComparisonSection = ({ chartData, listData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <DepartmentKPIChart data={chartData} />
    <DepartmentPerformanceList departments={listData} />
  </div>
);

/**
 * KPIPage - KPI tracking page with real employee data
 */
export const KPIPage = ({ onLogout, userName, userRole }) => {
  const {
    getOverallKPI,
    getKPITrendData,
    getDepartmentKPIStats,
    getPerformanceInsights,
  } = useEmployees();

  const overallScore = getOverallKPI();
  const trendData = getKPITrendData();
  const departmentStats = getDepartmentKPIStats();
  const performanceInsights = getPerformanceInsights();

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

      <OverallKPICard score={overallScore} trend={trend} />

      <KPITrendChartFull data={trendData} />

      <ComparisonSection
        chartData={departmentChartData}
        listData={departmentStats}
      />

      <PerformanceInsights insights={performanceInsights} />
    </DashboardLayout>
  );
};
