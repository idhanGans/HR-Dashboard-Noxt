import { DashboardLayout } from "../components";
import {
  ActivePeriodBanner,
  KPIStatCard,
  KPIFilterBar,
  KPITrackerTrendChart,
  KPIDataTable,
  KPIEditModal,
  ConfirmDeleteModal,
} from "../components/kpi-tracker";
import { KPIHeader } from "../components/kpi";
import {
  useActivePeriod,
  useKPISummary,
  useKPITrend,
  useKPIPeriods,
  useKPIDepartments,
  useEmployeeKPIList,
} from "../hooks/useKPITracker";
import type { LayoutProps } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";

/**
 * KPIPage - Full KPI Tracker page with filters, chart, table, and modals
 */
export const KPIPage = ({ onLogout, userName, userRole }: LayoutProps) => {
  const { auth } = useAuth();

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const { activePeriod, isLoading: periodLoading } = useActivePeriod();
  const { overallScore, isLoading: summaryLoading } = useKPISummary();
  const { trendData, isLoading: trendLoading } = useKPITrend();
  const { periods, isLoading: periodsLoading } = useKPIPeriods();
  const { departments, isLoading: departmentsLoading } = useKPIDepartments();
  const {
    rows,
    total,
    totalPages,
    currentPage,
    isLoading: tableLoading,
    error: tableError,
  } = useEmployeeKPIList();

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <KPIHeader />

      {/* Active Period Banner */}
      <ActivePeriodBanner
        activePeriod={activePeriod}
        isLoading={periodLoading}
      />

      {/* Overall KPI Summary Card */}
      <KPIStatCard score={overallScore} isLoading={summaryLoading} />

      {/* Filters Section */}
      <KPIFilterBar
        departments={departments}
        periods={periods}
        isLoading={periodsLoading || departmentsLoading}
      />

      {/* KPI Trend Chart */}
      <KPITrackerTrendChart data={trendData} isLoading={trendLoading} />

      {/* Error Banner */}
      {tableError && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {tableError}
        </div>
      )}

      {/* KPI Data Table */}
      <KPIDataTable
        rows={rows}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        isLoading={tableLoading}
        userRole={userRole}
        currentUserId={auth.userId ? Number(auth.userId) : undefined}
      />

      {/* Modals */}
      <KPIEditModal userRole={userRole} />
      <ConfirmDeleteModal userRole={userRole} />
    </DashboardLayout>
  );
};
