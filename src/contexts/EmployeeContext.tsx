import { useState, useEffect, ReactNode } from "react";
import { employees as seedEmployees } from "../utils/dummyData";
import { EmployeeContext } from "../hooks/useEmployees";
import { Employee } from "../types";
import {
  PayrollHistoryRecord,
  DepartmentKPIStats,
  PerformanceInsights,
} from "../types/employee";

interface EmployeeProviderProps {
  children: ReactNode;
}

/**
 * EmployeeProvider - Provides employee data across the application
 */
export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    // Try to load from localStorage, fall back safely if corrupted
    try {
      const stored = localStorage.getItem("hr_employees");
      return stored ? JSON.parse(stored) : seedEmployees;
    } catch (err) {
      console.warn("Resetting employee data due to storage parse error", err);
      localStorage.removeItem("hr_employees");
      return seedEmployees;
    }
  });

  // Persist to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem("hr_employees", JSON.stringify(employees));
  }, [employees]);

  const updateEmployee = (id: number, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
    );
  };

  // Update employee status (for attendance tracking)
  const updateEmployeeStatus = (id: number, status: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status } : emp)),
    );
  };

  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [employee, ...prev]);
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateEmployeeKPI = (id: number, kpiData: any) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== id) return emp;

        const currentKPI = { ...emp.kpi, ...kpiData };

        // Track KPI history with month/year
        if (kpiData.month && kpiData.year && kpiData.currentScore) {
          const history = [...(currentKPI.history || [])];
          const existingIndex = history.findIndex(
            (h: any) => h.month === kpiData.month && h.year === kpiData.year,
          );

          if (existingIndex >= 0) {
            history[existingIndex] = {
              month: kpiData.month,
              year: kpiData.year,
              score: kpiData.currentScore,
            };
          } else {
            history.push({
              month: kpiData.month,
              year: kpiData.year,
              score: kpiData.currentScore,
            });
          }

          // Sort by year and month (most recent first)
          history.sort((a: any, b: any) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
          });

          currentKPI.history = history;
        }

        return { ...emp, kpi: currentKPI };
      }),
    );
  };

  const updateEmployeePayroll = (id: number, payrollData: any) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, payroll: { ...emp.payroll, ...payrollData } }
          : emp,
      ),
    );
  };

  // Add or update payroll history for a specific month
  const addPayrollHistory = (
    employeeId: number,
    historyRecord: PayrollHistoryRecord,
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;

        const history = (emp as any).payrollHistory || [];
        const existingIndex = history.findIndex(
          (h: PayrollHistoryRecord) =>
            h.month === historyRecord.month && h.year === historyRecord.year,
        );

        let newHistory;
        if (existingIndex >= 0) {
          // Update existing record
          newHistory = [...history];
          newHistory[existingIndex] = historyRecord;
        } else {
          // Add new record
          newHistory = [...history, historyRecord];
        }

        // Sort by year and month (most recent first)
        newHistory.sort((a: PayrollHistoryRecord, b: PayrollHistoryRecord) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });

        return { ...emp, payrollHistory: newHistory };
      }),
    );
  };

  // Get payroll history for a specific employee and period
  const getPayrollHistory = (
    employeeId: number,
    month: number | null = null,
    year: number | null = null,
  ): PayrollHistoryRecord | PayrollHistoryRecord[] | null => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee || !(employee as any).payrollHistory) return null;

    if (month && year) {
      return (employee as any).payrollHistory.find(
        (h: PayrollHistoryRecord) => h.month === month && h.year === year,
      );
    }

    return (employee as any).payrollHistory;
  };

  // Get department KPI averages
  const getDepartmentKPIStats = (): DepartmentKPIStats[] => {
    const deptMap: Record<
      string,
      { department: string; scores: number[]; targets: number[] }
    > = {};

    employees.forEach((emp) => {
      if ((emp as any).employmentType === "former") return;

      const dept = emp.department;
      if (!deptMap[dept]) {
        deptMap[dept] = {
          department: dept,
          scores: [],
          targets: [],
        };
      }

      if ((emp as any).kpi?.currentScore) {
        deptMap[dept].scores.push((emp as any).kpi.currentScore);
      }
      if ((emp as any).kpi?.target) {
        deptMap[dept].targets.push((emp as any).kpi.target);
      }
    });

    return Object.values(deptMap).map((dept) => {
      const avgScore = dept.scores.length
        ? dept.scores.reduce((a, b) => a + b, 0) / dept.scores.length
        : 0;
      const avgTarget = dept.targets.length
        ? dept.targets.reduce((a, b) => a + b, 0) / dept.targets.length
        : 8.5;
      const trend =
        avgScore >= avgTarget
          ? `+${Math.round(((avgScore - avgTarget) / avgTarget) * 100)}%`
          : `${Math.round(((avgScore - avgTarget) / avgTarget) * 100)}%`;

      return {
        department: dept.department,
        score: parseFloat(avgScore.toFixed(1)),
        target: parseFloat(avgTarget.toFixed(1)),
        trend,
      };
    });
  };

  // Get overall company KPI average
  const getOverallKPI = (): number => {
    const activeEmployees = employees.filter(
      (emp) =>
        (emp as any).employmentType !== "former" &&
        (emp as any).kpi?.currentScore,
    );

    if (activeEmployees.length === 0) return 0;

    const total = activeEmployees.reduce(
      (sum, emp) => sum + (emp as any).kpi.currentScore,
      0,
    );

    return parseFloat((total / activeEmployees.length).toFixed(1));
  };

  // Get KPI trend data for last 12 months
  const getKPITrendData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const trendData = months.map((month) => {
      const activeEmployees = employees.filter(
        (emp) =>
          (emp as any).employmentType !== "former" && (emp as any).kpi?.history,
      );

      let totalScore = 0;
      let count = 0;

      activeEmployees.forEach((emp) => {
        const monthData = (emp as any).kpi.history.find(
          (h: any) => h.month === month,
        );
        if (monthData) {
          totalScore += monthData.score;
          count++;
        }
      });

      return {
        month,
        value: count > 0 ? parseFloat((totalScore / count).toFixed(1)) : 0,
      };
    });

    return trendData.filter((d) => d.value > 0);
  };

  // Get top performers
  const getTopPerformers = (limit: number = 3): Employee[] => {
    return [...employees]
      .filter(
        (emp) =>
          (emp as any).employmentType !== "former" &&
          (emp as any).kpi?.currentScore,
      )
      .sort((a, b) => (b as any).kpi.currentScore - (a as any).kpi.currentScore)
      .slice(0, limit);
  };

  // Get performance insights
  const getPerformanceInsights = (): PerformanceInsights => {
    const deptStats = getDepartmentKPIStats();

    // Top performing department
    const topDept = deptStats.reduce(
      (max, dept) => (dept.score > max.score ? dept : max),
      { department: "N/A", score: 0 },
    );

    // Most improved department
    const mostImproved = deptStats.reduce(
      (max, dept) => {
        const improvement = parseFloat(dept.trend);
        const maxImprovement = parseFloat(max.trend || "0");
        return improvement > maxImprovement ? dept : max;
      },
      { department: "N/A", trend: "0%" },
    );

    // Department needing attention
    const needsAttention = deptStats.find(
      (dept) => dept.score < dept.target,
    ) || {
      department: "All on track",
      score: 0,
    };

    return {
      topPerformer: {
        department: topDept.department,
        score: `${topDept.score}/10`,
      },
      mostImproved: {
        department: mostImproved.department,
        improvement: `${mostImproved.trend} improvement this period`,
      },
      needsAttention: {
        department: needsAttention.department,
        note:
          needsAttention.department === "All on track"
            ? "All departments meeting targets"
            : "Below target performance",
      },
    };
  };

  const value = {
    employees,
    setEmployees,
    updateEmployee,
    updateEmployeeStatus,
    addEmployee,
    deleteEmployee,
    updateEmployeeKPI,
    updateEmployeePayroll,
    addPayrollHistory,
    getPayrollHistory,
    getDepartmentKPIStats,
    getOverallKPI,
    getKPITrendData,
    getTopPerformers,
    getPerformanceInsights,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
