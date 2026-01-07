import { useState, useEffect } from "react";
import { employees as seedEmployees } from "../utils/dummyData";
import { EmployeeContext } from "../hooks/useEmployees";

/**
 * EmployeeProvider - Provides employee data across the application
 */
export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
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

  const updateEmployee = (id, updates) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const addEmployee = (employee) => {
    setEmployees((prev) => [employee, ...prev]);
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateEmployeeKPI = (id, kpiData) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, kpi: { ...emp.kpi, ...kpiData } } : emp
      )
    );
  };

  const updateEmployeePayroll = (id, payrollData) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, payroll: { ...emp.payroll, ...payrollData } }
          : emp
      )
    );
  };

  // Add or update payroll history for a specific month
  const addPayrollHistory = (employeeId, historyRecord) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;

        const history = emp.payrollHistory || [];
        const existingIndex = history.findIndex(
          (h) => h.month === historyRecord.month && h.year === historyRecord.year
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
        newHistory.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });

        return { ...emp, payrollHistory: newHistory };
      })
    );
  };

  // Get payroll history for a specific employee and period
  const getPayrollHistory = (employeeId, month = null, year = null) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee || !employee.payrollHistory) return null;

    if (month && year) {
      return employee.payrollHistory.find(
        (h) => h.month === month && h.year === year
      );
    }

    return employee.payrollHistory;
  };

  // Get department KPI averages
  const getDepartmentKPIStats = () => {
    const deptMap = {};

    employees.forEach((emp) => {
      if (emp.employmentType === "former") return;

      const dept = emp.department;
      if (!deptMap[dept]) {
        deptMap[dept] = {
          department: dept,
          scores: [],
          targets: [],
        };
      }

      if (emp.kpi?.currentScore) {
        deptMap[dept].scores.push(emp.kpi.currentScore);
      }
      if (emp.kpi?.target) {
        deptMap[dept].targets.push(emp.kpi.target);
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
  const getOverallKPI = () => {
    const activeEmployees = employees.filter(
      (emp) => emp.employmentType !== "former" && emp.kpi?.currentScore
    );

    if (activeEmployees.length === 0) return 0;

    const total = activeEmployees.reduce(
      (sum, emp) => sum + emp.kpi.currentScore,
      0
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
        (emp) => emp.employmentType !== "former" && emp.kpi?.history
      );

      let totalScore = 0;
      let count = 0;

      activeEmployees.forEach((emp) => {
        const monthData = emp.kpi.history.find((h) => h.month === month);
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
  const getTopPerformers = (limit = 3) => {
    return [...employees]
      .filter((emp) => emp.employmentType !== "former" && emp.kpi?.currentScore)
      .sort((a, b) => b.kpi.currentScore - a.kpi.currentScore)
      .slice(0, limit);
  };

  // Get performance insights
  const getPerformanceInsights = () => {
    const deptStats = getDepartmentKPIStats();

    // Top performing department
    const topDept = deptStats.reduce(
      (max, dept) => (dept.score > max.score ? dept : max),
      { department: "N/A", score: 0 }
    );

    // Most improved department
    const mostImproved = deptStats.reduce(
      (max, dept) => {
        const improvement = parseFloat(dept.trend);
        const maxImprovement = parseFloat(max.trend || "0");
        return improvement > maxImprovement ? dept : max;
      },
      { department: "N/A", trend: "0%" }
    );

    // Department needing attention
    const needsAttention = deptStats.find(
      (dept) => dept.score < dept.target
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
