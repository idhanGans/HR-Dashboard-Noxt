/**
 * New KPI Tracker Page
 * Full-featured KPI management with filters, trends, and interactive modals
 * Built with React, TailwindCSS, and Framer Motion
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  KPIHeader,
  KPIStatsCard,
  KPIFilters,
  KPITable,
  KPIManageModal,
} from "../components/kpi-tracker";
import {
  mockKPIData,
  evaluationPeriods,
  departments,
  statusOptions,
} from "../data/kpi-mock-data";
import type { EmployeeKPI, KPIFiltersState } from "../types/kpi-tracker";
import type { LayoutProps } from "../types/auth";

/**
 * Main KPI Tracker Page Component
 */
export const NewKpiTrackerPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  // State management
  const [kpiData, setKpiData] = useState<EmployeeKPI[]>(mockKPIData);
  const [filters, setFilters] = useState<KPIFiltersState>({
    searchQuery: "",
    department: "All Departments",
    period: "February 2026 (Active)",
    status: "All Status",
  });
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeKPI | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate average score for an employee
  const calculateAverage = (metrics: EmployeeKPI["metrics"]): number => {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  // Get score status
  const getScoreStatus = (score: number): string => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Warning";
    return "Critical";
  };

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    return kpiData.filter((employee) => {
      // Search filter
      if (
        filters.searchQuery &&
        !employee.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Department filter
      if (
        filters.department !== "All Departments" &&
        employee.department !== filters.department
      ) {
        return false;
      }

      // Period filter - match either with or without (Active) suffix
      const periodLabel = filters.period.replace(" (Active)", "");
      const employeePeriod = employee.period;
      if (employeePeriod !== periodLabel) {
        return false;
      }

      // Status filter
      if (filters.status !== "All Status") {
        const avgScore = calculateAverage(employee.metrics);
        const status = getScoreStatus(avgScore);
        if (status !== filters.status) {
          return false;
        }
      }

      return true;
    });
  }, [kpiData, filters]);

  // Calculate overall company KPI
  const companyKPI = useMemo(() => {
    if (filteredEmployees.length === 0) return 0;

    const totalScore = filteredEmployees.reduce((sum, employee) => {
      return sum + calculateAverage(employee.metrics);
    }, 0);

    return totalScore / filteredEmployees.length;
  }, [filteredEmployees]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<KPIFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle edit employee
  const handleEdit = (employee: EmployeeKPI) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle view employee (same as edit for now)
  const handleView = (employee: EmployeeKPI) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle save KPI
  const handleSave = (
    employee: EmployeeKPI,
    metrics: EmployeeKPI["metrics"],
  ) => {
    setKpiData((prev) =>
      prev.map((emp) => (emp.id === employee.id ? { ...emp, metrics } : emp)),
    );
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Handle add KPI (placeholder)
  const handleAddKPI = () => {
    alert("Add KPI functionality - to be implemented");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <KPIHeader userRole={userRole} onAddKPI={handleAddKPI} />

        {/* Overall Company KPI Card */}
        <KPIStatsCard score={companyKPI} />

        {/* Filters */}
        <KPIFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          periods={evaluationPeriods}
          statusOptions={statusOptions}
        />

        {/* KPI Table */}
        <KPITable
          employees={filteredEmployees}
          userRole={userRole}
          onEdit={handleEdit}
          onView={handleView}
        />

        {/* Edit Modal */}
        <KPIManageModal
          isOpen={isModalOpen}
          employee={selectedEmployee}
          userRole={userRole}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </motion.div>
    </DashboardLayout>
  );
};
