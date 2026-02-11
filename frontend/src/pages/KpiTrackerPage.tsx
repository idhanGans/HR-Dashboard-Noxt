/**
 * KpiTrackerPage - Enhanced KPI Tracker Page
 * Full-featured KPI management with filters, trends, tables, and modals
 * Uses local state management with Zustand and localStorage persistence
 */

import { useState, useMemo } from "react";
import { DashboardLayout } from "../components";
import { KpiFilters } from "../components/kpi/KpiFilters";
import { KpiTable } from "../components/kpi/KpiTable";
import { KpiTrendChart } from "../components/kpi/KpiTrendChart";
import { ManageKpiModal } from "../components/kpi/ManageKpiModal";
import { useKpiStore } from "../stores/useKpiStore";
import type { LayoutProps } from "../types/auth";

interface OverallKpiSectionProps {
  score: number;
  isLoading?: boolean;
}

/**
 * Overall Company KPI Card
 * Displays animated score and status
 */
const OverallKpiCard = ({ score, isLoading }: OverallKpiSectionProps) => {
  const getStatusLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Warning";
    return "Critical";
  };

  const getStatusColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-yellow-400";
    return "text-red-400";
  };

  const getCardBgColor = (score: number) => {
    if (score >= 8) return "bg-green-500/10 border-green-500/20";
    if (score >= 6) return "bg-blue-500/10 border-blue-500/20";
    if (score >= 4) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div
      className={`bg-gray-800/50 border rounded-xl p-8 mb-6 backdrop-blur transition-all ${getCardBgColor(
        score,
      )}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-300 text-sm font-medium mb-2">
            Overall Company KPI
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-12 w-20 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {score.toFixed(1)}
                </span>
                <span className="text-gray-400">/10</span>
              </div>
              <p
                className={`text-sm font-semibold mt-2 ${getStatusColor(score)}`}
              >
                {getStatusLabel(score)}
              </p>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className={`w-20 h-20 rounded-xl flex items-center justify-center ${getCardBgColor(score)}`}
          >
            <svg
              className={`w-10 h-10 ${getStatusColor(score)}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8L5.228 15.228a1 1 0 00-.001 1.414l1.414 1.414a1 1 0 001.414 0L22 9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Page Header with Add KPI button
 */
interface PageHeaderProps {
  userRole: string;
  onAddKpi: () => void;
}

const PageHeader = ({ userRole, onAddKpi }: PageHeaderProps) => {
  const isSuperAdmin = userRole === "SUPERADMIN";

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">KPI Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor and manage employee performance metrics
        </p>
      </div>

      {isSuperAdmin && (
        <button
          onClick={onAddKpi}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add KPI
        </button>
      )}
    </div>
  );
};

/**
 * Main KPI Tracker Page
 */
export const KpiTrackerPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  const { getCompanyAverage, openManageModal } = useKpiStore();

  const [tableLoading] = useState(false);

  // Compute company average
  const companyAverage = useMemo(
    () => getCompanyAverage(),
    [getCompanyAverage],
  );

  const handleAddKpi = () => {
    openManageModal();
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader userRole={userRole} onAddKpi={handleAddKpi} />

        {/* Overall Company KPI */}
        <OverallKpiCard score={companyAverage} isLoading={false} />

        {/* Filters Section */}
        <KpiFilters />

        {/* KPI Trend Chart */}
        <KpiTrendChart isLoading={false} height={350} />

        {/* KPI Data Table */}
        <KpiTable userRole={userRole} isLoading={tableLoading} />

        {/* Manage KPI Modal */}
        <ManageKpiModal userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};
