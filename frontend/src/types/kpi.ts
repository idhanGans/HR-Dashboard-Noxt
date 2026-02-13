/**
 * Enhanced KPI Types for Local State Management
 * These types work alongside API types and provide structure for local KPI data storage
 */

// ── Period Types ──────────────────────────────────────────────────────────

export interface Period {
  id: string;
  name: string; // e.g. "January 2026"
  month: number; // 1-12
  year: number; // 2025, 2026, etc.
  startDate: string;
  endDate: string;
  isActive: boolean; // Only ONE period can be active at a time
  createdAt: string;
}

// ── Metric Types ──────────────────────────────────────────────────────────

export interface Metric {
  id: string;
  title: string;
  description?: string;
  weight?: number; // 0-100 for weighted scoring
}

// ── Employee Types ────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  email?: string;
}

// ── KPI Score Entry ───────────────────────────────────────────────────────

export interface MetricScore {
  metricId: string;
  score: number; // 1-10
  target?: number; // 1-10 optional target
}

// ── KPI Evaluation ────────────────────────────────────────────────────────
// KPI saved per employee PER PERIOD (one evaluation per employee per month)

export interface KpiEvaluation {
  id: string;
  employeeId: string;
  employee?: Employee; // Denormalized for performance
  periodId: string; // MANDATORY - links to active period
  period?: Period; // Denormalized
  metrics: MetricScore[]; // Array of scored metrics
  averageScore: number; // Auto-calculated from metrics
  status: "Excellent" | "Good" | "Warning" | "Critical"; // Auto-calculated
  createdAt: string;
  updatedAt: string;
}

// ── KPI Tracker State ─────────────────────────────────────────────────────

export interface KpiTrackerState {
  // Data collections
  periods: Period[];
  metrics: Metric[];
  employees: Employee[];
  evaluations: KpiEvaluation[];

  // Active selection
  activePeriodId: string | null;

  // Filters
  filters: KpiFilters;

  // UI State
  modalState: {
    manage: {
      isOpen: boolean;
      evaluationId?: string;
    };
  };
}

// ── Filters ───────────────────────────────────────────────────────────────

export interface KpiFilters {
  search: string;
  department?: string;
  periodId?: string;
  status?: "Excellent" | "Good" | "Warning" | "Critical";
}

// ── Computed/Display Types ───────────────────────────────────────────────

export interface KpiTableRow {
  evaluationId: string;
  employeeName: string;
  employeeId: string;
  department: string;
  period: string;
  averageScore: number;
  status: "Excellent" | "Good" | "Warning" | "Critical";
}

export interface TrendDataPoint {
  periodId: string;
  periodName: string;
  companyAverageScore: number;
}

// ── Utilities ─────────────────────────────────────────────────────────────

/**
 * Calculate KPI status based on score
 * >= 8 = Excellent (green)
 * 6-7.9 = Good (blue)
 * 4-5.9 = Warning (yellow)
 * < 4 = Critical (red)
 */
export function getKpiStatus(
  score: number,
): "Excellent" | "Good" | "Warning" | "Critical" {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Warning";
  return "Critical";
}

/**
 * Get status color for display
 */
export function getStatusColor(status: string): string {
  if (status === "Excellent")
    return "bg-green-500/10 border-green-500/30 text-green-400";
  if (status === "Good")
    return "bg-blue-500/10 border-blue-500/30 text-blue-400";
  if (status === "Warning")
    return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
  return "bg-red-500/10 border-red-500/30 text-red-400";
}

/**
 * Get status label color for badges
 */
export function getStatusBadgeColor(status: string): string {
  if (status === "Excellent") return "bg-green-500 text-white";
  if (status === "Good") return "bg-blue-500 text-white";
  if (status === "Warning") return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}

/**
 * Calculate average score from metrics
 */
export function calculateAverageScore(metrics: MetricScore[]): number {
  if (metrics.length === 0) return 0;
  const total = metrics.reduce((sum, m) => sum + m.score, 0);
  return Number((total / metrics.length).toFixed(1));
}

/**
 * Calculate company average from all evaluations
 */
export function calculateCompanyAverage(evaluations: KpiEvaluation[]): number {
  if (evaluations.length === 0) return 0;
  const total = evaluations.reduce((sum, e) => sum + e.averageScore, 0);
  return Number((total / evaluations.length).toFixed(1));
}
