import { DashboardLayout } from "../components";
import {
  OverallKPICard,
  KPITrendChartFull,
  DepartmentKPIChart,
  DepartmentPerformanceList,
  PerformanceInsights,
  KPIHeader,
} from "../components/kpi";
import { kpiTrendData } from "../utils/dummyData";

// Department KPI data
const DEPARTMENT_KPI = [
  { department: "Engineering", score: 8.7, target: 8.5, trend: "+5%" },
  { department: "Sales", score: 8.2, target: 8.0, trend: "+3%" },
  { department: "HR", score: 8.9, target: 9.0, trend: "-1%" },
  { department: "Marketing", score: 8.0, target: 8.0, trend: "0%" },
  { department: "Operations", score: 8.4, target: 8.5, trend: "+2%" },
];

// Format department data for chart
const DEPARTMENT_CHART_DATA = DEPARTMENT_KPI.map((item) => ({
  name: item.department,
  score: item.score,
  target: item.target,
}));

// Performance insights data
const PERFORMANCE_INSIGHTS = {
  topPerformer: { department: "HR Department", score: "8.9/10" },
  mostImproved: {
    department: "Engineering",
    improvement: "+5% improvement this month",
  },
  needsAttention: { department: "Marketing", note: "Below target performance" },
};

/**
 * ComparisonSection - Department KPI comparison grid
 */
const ComparisonSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <DepartmentKPIChart data={DEPARTMENT_CHART_DATA} />
    <DepartmentPerformanceList departments={DEPARTMENT_KPI} />
  </div>
);

/**
 * KPIPage - KPI tracking page
 */
export const KPIPage = ({ onLogout, userName, userRole }) => {
  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <KPIHeader />

      <OverallKPICard score={8.5} trend="↑ 0.3 points from last month" />

      <KPITrendChartFull data={kpiTrendData} />

      <ComparisonSection />

      <PerformanceInsights insights={PERFORMANCE_INSIGHTS} />
    </DashboardLayout>
  );
};
