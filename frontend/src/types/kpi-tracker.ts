/**
 * KPI Tracker Types
 * Type definitions for the KPI Tracker feature
 */

export interface EmployeeKPI {
  id: number;
  name: string;
  department: string;
  period: string;
  avatar?: string;
  metrics: {
    attendance: number;
    punctuality: number;
    response: number;
    communication: number;
    workAsTeam: number;
    productivity: number;
    qualityOfWork: number;
    initiativeProblemSolving: number;
  };
  history: number[]; // Last 6 months average scores
}

export interface KPIFiltersState {
  searchQuery: string;
  department: string;
  period: string;
  status: string;
}

export type Department =
  | "All Departments"
  | "Engineering"
  | "Product"
  | "Design"
  | "Marketing"
  | "Sales";

export type EvaluationPeriod = {
  id: string;
  label: string;
  isActive: boolean;
};

export type KPIStatus =
  | "All Status"
  | "Excellent"
  | "Good"
  | "Warning"
  | "Critical";
