import { Employee } from "./index";

export interface PayrollHistoryRecord {
  month: number;
  year: number;
  basic: number;
  allowance: number;
  bonus: number;
  deductions: number;
  netSalary: number;
}

export interface DepartmentKPIStats {
  department: string;
  score: number;
  target: number;
  trend: string;
}

export interface PerformanceInsights {
  topPerformer: {
    department: string;
    score: string;
  };
  mostImproved: {
    department: string;
    improvement: string;
  };
  needsAttention: {
    department: string;
    note: string;
  };
}

export interface EmployeeContextValue {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  updateEmployee: (id: number, updates: Partial<Employee>) => void;
  updateEmployeeStatus: (id: number, status: string) => void;
  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: number) => void;
  updateEmployeeKPI: (id: number, kpiData: any) => void;
  updateEmployeePayroll: (id: number, payrollData: any) => void;
  addPayrollHistory: (
    employeeId: number,
    historyRecord: PayrollHistoryRecord,
  ) => void;
  getPayrollHistory: (
    employeeId: number,
    month?: number | null,
    year?: number | null,
  ) => PayrollHistoryRecord | PayrollHistoryRecord[] | null;
  getDepartmentKPIStats: () => DepartmentKPIStats[];
  getOverallKPI: () => number;
  getKPITrendData: () => { month: string; value: number }[];
  getTopPerformers: (limit?: number) => Employee[];
  getPerformanceInsights: () => PerformanceInsights;
}
