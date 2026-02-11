/**
 * Zustand Store for Local KPI Data Management
 * Handles KPI evaluations, periods, metrics, and employees with localStorage persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  KpiEvaluation,
  Period,
  Metric,
  Employee,
  KpiFilters,
  TrendDataPoint,
  KpiTableRow,
} from "../types/kpi";
import { calculateCompanyAverage } from "../types/kpi";

// ── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_PERIODS: Period[] = [
  {
    id: "p1",
    name: "January 2026",
    month: 1,
    year: 2026,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    isActive: true,
    createdAt: "2026-01-01",
  },
  {
    id: "p2",
    name: "December 2025",
    month: 12,
    year: 2025,
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    isActive: false,
    createdAt: "2025-12-01",
  },
  {
    id: "p3",
    name: "November 2025",
    month: 11,
    year: 2025,
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    isActive: false,
    createdAt: "2025-11-01",
  },
  {
    id: "p4",
    name: "October 2025",
    month: 10,
    year: 2025,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    isActive: false,
    createdAt: "2025-10-01",
  },
  {
    id: "p5",
    name: "September 2025",
    month: 9,
    year: 2025,
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    isActive: false,
    createdAt: "2025-09-01",
  },
  {
    id: "p6",
    name: "August 2025",
    month: 8,
    year: 2025,
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    isActive: false,
    createdAt: "2025-08-01",
  },
];

const MOCK_METRICS: Metric[] = [
  {
    id: "m1",
    title: "Team Collaboration",
    description: "Team collaboration and communication effectiveness",
    weight: 25,
  },
  {
    id: "m2",
    title: "Code Quality Score",
    description: "Average code quality assessment score",
    weight: 25,
  },
  {
    id: "m3",
    title: "Project Completion Rate",
    description: "Percentage of projects completed on time",
    weight: 25,
  },
  {
    id: "m4",
    title: "Customer Satisfaction",
    description: "Overall customer satisfaction rating",
    weight: 25,
  },
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "e1",
    name: "John Smith",
    department: "Engineering",
    role: "Senior Developer",
    email: "john@example.com",
  },
  {
    id: "e2",
    name: "Sarah Johnson",
    department: "Engineering",
    role: "Frontend Developer",
    email: "sarah@example.com",
  },
  {
    id: "e3",
    name: "Mike Chen",
    department: "Product",
    role: "Product Manager",
    email: "mike@example.com",
  },
  {
    id: "e4",
    name: "Emily Brown",
    department: "Design",
    role: "UX Designer",
    email: "emily@example.com",
  },
  {
    id: "e5",
    name: "Alex Wilson",
    department: "Marketing",
    role: "Marketing Manager",
    email: "alex@example.com",
  },
];

// ── Store Types ───────────────────────────────────────────────────────────

export interface UseKpiStoreState {
  // Data
  periods: Period[];
  metrics: Metric[];
  employees: Employee[];
  evaluations: KpiEvaluation[];

  // Active selection
  activePeriodId: string | null;

  // Filters
  filters: KpiFilters;

  // Modal state
  manageModalOpen: boolean;
  editingEvaluationId: string | null;

  // Actions
  // Period actions
  addPeriod: (period: Period) => void;
  setActivePeriod: (periodId: string) => void;
  getActivePeriod: () => Period | null;

  // KPI evaluation actions
  addKpiEvaluation: (evaluation: KpiEvaluation) => void;
  updateKpiEvaluation: (evaluation: KpiEvaluation) => void;
  deleteKpiEvaluation: (evaluationId: string) => void;
  getEmployeeKpi: (employeeId: string, periodId: string) => KpiEvaluation | null;
  saveKpiEvaluation: (
    employeeId: string,
    metrics: MetricScore[],
  ) => { success: boolean; error?: string; evaluationId?: string; action?: "created" | "updated" };

  // Filter actions
  setFilters: (filters: Partial<KpiFilters>) => void;
  resetFilters: () => void;

  // Modal actions
  openManageModal: (evaluationId?: string) => void;
  closeManageModal: () => void;

  // Computed data
  getFilteredEvaluations: () => KpiEvaluation[];
  getCompanyAverage: () => number;
  getTrendData: () => TrendDataPoint[];
  getKpiTableRows: () => KpiTableRow[];
  getEvaluationById: (id: string) => KpiEvaluation | undefined;
  getPeriodById: (id: string) => Period | undefined;
}

// ── Store ─────────────────────────────────────────────────────────────────

export const useKpiStore = create<UseKpiStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      periods: MOCK_PERIODS,
      metrics: MOCK_METRICS,
      employees: MOCK_EMPLOYEES,
      evaluations: [],
      activePeriodId: "p1",
      filters: {
        search: "",
        department: undefined,
        periodId: undefined,
        status: undefined,
      },
      manageModalOpen: false,
      editingEvaluationId: null,

      // Period actions
      addPeriod: (period) =>
        set((state) => ({
          periods: [...state.periods, period],
        })),

      setActivePeriod: (periodId) =>
        set((state) => {
          // Deactivate all periods first
          const updatedPeriods = state.periods.map((period) => ({
            ...period,
            isActive: period.id === periodId,
          }));

          return {
            activePeriodId: periodId,
            periods: updatedPeriods,
          };
        }),

      // Helper: Get the current active period object
      getActivePeriod: () => {
        const state = get();
        return state.periods.find((p) => p.isActive) || null;
      },

      // Helper: Get existing evaluation for employee in specific period
      getEmployeeKpi: (employeeId: string, periodId: string) => {
        const state = get();
        return (
          state.evaluations.find(
            (e) => e.employeeId === employeeId && e.periodId === periodId,
          ) || null
        );
      },

      // Save KPI evaluation (create or update based on duplicate check)
      saveKpiEvaluation: (employeeId: string, metrics: MetricScore[]) => {
        const state = get();

        // 1. Validate active period exists
        const activePeriod = state.getActivePeriod();
        if (!activePeriod) {
          return {
            success: false,
            error: "No active evaluation period exists. Please create a period first.",
          };
        }

        // 2. Calculate average score
        const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);
        const averageScore =
          metrics.length > 0 ? parseFloat((totalScore / metrics.length).toFixed(2)) : 0;

        // 3. Determine status based on average
        let status: "needs-improvement" | "meets-expectations" | "exceeds-expectations";
        if (averageScore < 5) {
          status = "needs-improvement";
        } else if (averageScore < 8) {
          status = "meets-expectations";
        } else {
          status = "exceeds-expectations";
        }

        // 4. Check for existing evaluation (same employee + same period)
        const existingEval = state.getEmployeeKpi(employeeId, activePeriod.id);

        if (existingEval) {
          // UPDATE existing evaluation
          const updatedEvaluation: KpiEvaluation = {
            ...existingEval,
            metrics,
            averageScore,
            status,
            updatedAt: new Date().toISOString(),
          };

          set((s) => ({
            evaluations: s.evaluations.map((e) =>
              e.id === existingEval.id ? updatedEvaluation : e,
            ),
          }));

          return {
            success: true,
            evaluationId: existingEval.id,
            action: "updated" as const,
          };
        } else {
          // CREATE new evaluation
          const newEvaluation: KpiEvaluation = {
            id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            employeeId,
            periodId: activePeriod.id,
            metrics,
            averageScore,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((s) => ({
            evaluations: [...s.evaluations, newEvaluation],
          }));

          return {
            success: true,
            evaluationId: newEvaluation.id,
            action: "created" as const,
          };
        }
      },

      // KPI evaluation actions
      addKpiEvaluation: (evaluation) =>
        set((state) => ({
          evaluations: [...state.evaluations, evaluation],
        })),

      updateKpiEvaluation: (evaluation) =>
        set((state) => ({
          evaluations: state.evaluations.map((e) =>
            e.id === evaluation.id ? evaluation : e,
          ),
        })),

      deleteKpiEvaluation: (evaluationId) =>
        set((state) => ({
          evaluations: state.evaluations.filter((e) => e.id !== evaluationId),
        })),

      // Filter actions
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      resetFilters: () =>
        set(() => ({
          filters: {
            search: "",
            department: undefined,
            periodId: undefined,
            status: undefined,
          },
        })),

      // Modal actions
      openManageModal: (evaluationId?: string) =>
        set(() => ({
          manageModalOpen: true,
          editingEvaluationId: evaluationId || null,
        })),

      closeManageModal: () =>
        set(() => ({
          manageModalOpen: false,
          editingEvaluationId: null,
        })),

      // Computed data
      getFilteredEvaluations: () => {
        const state = get();
        let filtered = [...state.evaluations];

        // Filter by period
        const periodId = state.filters.periodId || state.activePeriodId;
        if (periodId) {
          filtered = filtered.filter((e) => e.periodId === periodId);
        }

        // Filter by department
        if (state.filters.department) {
          filtered = filtered.filter((e) => {
            const employee = state.employees.find(
              (emp) => emp.id === e.employeeId,
            );
            return employee?.department === state.filters.department;
          });
        }

        // Filter by search (employee name)
        if (state.filters.search) {
          const searchLower = state.filters.search.toLowerCase();
          filtered = filtered.filter((e) => {
            const employee = state.employees.find(
              (emp) => emp.id === e.employeeId,
            );
            return employee?.name.toLowerCase().includes(searchLower);
          });
        }

        // Filter by status
        if (state.filters.status) {
          filtered = filtered.filter((e) => e.status === state.filters.status);
        }

        return filtered;
      },

      getCompanyAverage: () => {
        const state = get();
        const filtered = state.getFilteredEvaluations();
        return calculateCompanyAverage(filtered);
      },

      getTrendData: () => {
        const state = get();
        return state.periods.map((period) => {
          const periodEvaluations = state.evaluations.filter(
            (e) => e.periodId === period.id,
          );
          return {
            periodId: period.id,
            periodName: period.name,
            companyAverageScore: calculateCompanyAverage(periodEvaluations),
          };
        });
      },

      getKpiTableRows: () => {
        const state = get();
        const filtered = state.getFilteredEvaluations();

        return filtered.map((evaluation) => {
          const employee = state.employees.find(
            (e) => e.id === evaluation.employeeId,
          );
          const period = state.periods.find(
            (p) => p.id === evaluation.periodId,
          );

          return {
            evaluationId: evaluation.id,
            employeeName: employee?.name || "Unknown",
            employeeId: employee?.id || "",
            department: employee?.department || "Unknown",
            period: period?.name || "Unknown",
            averageScore: evaluation.averageScore,
            status: evaluation.status,
          };
        });
      },

      getEvaluationById: (id: string) => {
        const state = get();
        return state.evaluations.find((e) => e.id === id);
      },

      getPeriodById: (id: string) => {
        const state = get();
        return state.periods.find((p) => p.id === id);
      },
    }),
    {
      name: "kpi-store",
      version: 1,
      partialize: (state) => ({
        periods: state.periods,
        evaluations: state.evaluations,
        activePeriodId: state.activePeriodId,
        filters: state.filters,
      }),
    },
  ),
);
