import { useMemo } from "react";
import { useEmployees } from "./useEmployees";

/**
 * useDashboardStats - Custom hook for real-time dashboard statistics
 * Provides memoized calculations for dashboard cards
 */
export const useDashboardStats = () => {
  const { employees, getOverallKPI, getKPITrendData, getTopPerformers } =
    useEmployees();

  // Calculate total active employees (excluding former employees)
  const totalEmployees = useMemo(() => {
    return employees.filter((emp) => emp.employmentType !== "former").length;
  }, [employees]);

  // Calculate today's attendance: present or late (not absent)
  const presentToday = useMemo(() => {
    return employees.filter(
      (emp) => emp.employmentType !== "former" && emp.status !== "absent",
    ).length;
  }, [employees]);

  // Get overall KPI (memoized from context)
  const overallKPI = useMemo(() => {
    return getOverallKPI();
  }, [getOverallKPI]);

  // Get KPI trend data (memoized from context)
  const kpiTrend = useMemo(() => {
    return getKPITrendData();
  }, [getKPITrendData]);

  // Get top performers (memoized from context)
  const topPerformers = useMemo(() => {
    return getTopPerformers(3);
  }, [getTopPerformers]);

  // Calculate department-wise attendance
  const departmentAttendance = useMemo(() => {
    const deptMap: Record<string, { total: number; present: number }> = {};

    employees.forEach((emp) => {
      if (emp.employmentType === "former") return;

      const dept = emp.department;
      if (!deptMap[dept]) {
        deptMap[dept] = { total: 0, present: 0 };
      }

      deptMap[dept].total += 1;
      if (emp.status !== "absent") {
        deptMap[dept].present += 1;
      }
    });

    return Object.entries(deptMap).map(([dept, data]) => ({
      department: dept,
      total: data.total,
      present: data.present,
      percentage:
        data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [employees]);

  return {
    totalEmployees,
    presentToday,
    overallKPI,
    kpiTrend,
    topPerformers,
    departmentAttendance,
  };
};
