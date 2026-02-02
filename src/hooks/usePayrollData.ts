import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { payrollService } from "../services/payrollService";
import { hasRequiredRole } from "../utils/roles";
import { getInitials } from "../utils/utils";
import type { Employee, PayrollHistoryRecord } from "../types";
import type { PayrollApiResponse, PayrollUser } from "../types/api";

export const payrollKeys = {
  all: ["payroll"] as const,
  employees: () => [...payrollKeys.all, "employees"] as const,
  payrollData: () => [...payrollKeys.all, "data"] as const,
  payroll: (userId: number, month: number, year: number) =>
    [...payrollKeys.payrollData(), { userId, month, year }] as const,
};

const normalizeEmploymentType = (
  value?: string
): Employee["employmentType"] | undefined => {
  if (value === "PERMANENT" || value === "TEMPORARY" || value === "FORMER") {
    return value as Employee["employmentType"];
  }
  return undefined;
};

const mapPayrollUser = (user: PayrollUser): Employee => {
  const name = user.fullName ?? user.name ?? "Unknown";
  return {
    id: user.id,
    name,
    email: user.email,
    department: user.organization?.name ?? user.department ?? "General",
    role: user.position ?? user.role ?? "",
    employmentType: normalizeEmploymentType(user.employmentType),
    avatar: getInitials(name),
    payroll: {
      basicSalary: 0,
      allowances: 0,
      bonus: 0,
      deductions: 0,
      netSalary: 0,
      bankName: user.bankName ?? "",
      bankAccount: user.bankNumber ?? "",
    },
  };
};

const mapPayrollResponse = (response: PayrollApiResponse): PayrollHistoryRecord => ({
  month: response.month,
  year: response.year,
  basicSalary: response.baseSalary ?? 0,
  allowances: response.allowance ?? 0,
  bonus: response.bonuses ?? 0,
  tax: response.tax ?? 0,
  insurance: response.insurance ?? 0,
  pension: response.pensionFund ?? 0,
  otherDeductions: response.otherDeductions ?? 0,
  deductions: response.totalDeductions ?? 0,
  netSalary: response.netPay ?? 0,
  totalEarnings: response.totalEarnings ?? 0,
  totalDeductions: response.totalDeductions ?? 0,
});

export const usePayrollData = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const canManagePayroll = hasRequiredRole(auth.role, ["SUPERADMIN"]);
  const isSelfPayrollView = !canManagePayroll;
  const canDownloadPayslip = canManagePayroll || isSelfPayrollView;

  const employeesQuery = useQuery({
    queryKey: payrollKeys.employees(),
    queryFn: async () => {
      if (isSelfPayrollView) {
        if (!auth.userId) {
          throw new Error("Unable to load your profile");
        }
        const selfEmployee: Employee = {
          id: auth.userId,
          name: auth.userName,
          department: "General",
          role: auth.userRole,
          employmentType: "PERMANENT",
          avatar: getInitials(auth.userName),
          payroll: {
            basicSalary: 0,
            allowances: 0,
            bonus: 0,
            deductions: 0,
            netSalary: 0,
            bankName: "",
            bankAccount: "",
          },
        };
        return [selfEmployee];
      }
      const users = await payrollService.getEmployees();
      return users.map(mapPayrollUser);
    },
    enabled: auth.isAuthenticated && !auth.isInitializing,
  });

  const effectiveEmployeeId = useMemo(() => {
    if (isSelfPayrollView && auth.userId) {
      return auth.userId;
    }
    return selectedEmployeeId;
  }, [isSelfPayrollView, auth.userId, selectedEmployeeId]);

  const payrollQuery = useQuery({
    queryKey: payrollKeys.payroll(
      effectiveEmployeeId ?? 0,
      selectedMonth,
      selectedYear
    ),
    queryFn: () =>
      payrollService.getPayroll({
        userId: effectiveEmployeeId!,
        month: selectedMonth,
        year: selectedYear,
      }),
    select: (data) => (data ? mapPayrollResponse(data) : null),
    enabled:
      auth.isAuthenticated && !auth.isInitializing && !!effectiveEmployeeId,
  });

  const updateMutation = useMutation({
    mutationFn: payrollService.updatePayroll,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.payroll(
          variables.userId,
          variables.month,
          variables.year
        ),
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: payrollService.downloadPayslip,
  });

  const employees = useMemo(
    () => employeesQuery.data ?? [],
    [employeesQuery.data]
  );
  const payrollData = payrollQuery.data ?? null;

  const selectedEmployee = useMemo(
    () => employees.find((emp) => emp.id === effectiveEmployeeId) ?? null,
    [employees, effectiveEmployeeId]
  );

  const handleSelectEmployee = useCallback((id: number | null) => {
    setSelectedEmployeeId(id);
  }, []);

  const handleSelectMonth = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  const handleSelectYear = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleUpdatePayroll = useCallback(
    async (data: {
      baseSalary: number;
      allowance: number;
      bonuses: number;
      tax?: number;
      insurance?: number;
      pensionFund?: number;
      otherDeductions?: number;
    }) => {
      if (!effectiveEmployeeId) {
        throw new Error("No employee selected");
      }
      return updateMutation.mutateAsync({
        userId: effectiveEmployeeId,
        month: selectedMonth,
        year: selectedYear,
        ...data,
      });
    },
    [effectiveEmployeeId, selectedMonth, selectedYear, updateMutation]
  );

  const handleDownloadPayslip = useCallback(async () => {
    if (!effectiveEmployeeId || !selectedEmployee) {
      throw new Error("No employee selected");
    }
    return downloadMutation.mutateAsync({
      userId: effectiveEmployeeId,
      month: selectedMonth,
      year: selectedYear,
      employeeName: selectedEmployee.name,
    });
  }, [
    effectiveEmployeeId,
    selectedEmployee,
    selectedMonth,
    selectedYear,
    downloadMutation,
  ]);

  const applyPayrollResponse = useCallback(
    (userId: number, response: PayrollApiResponse) => {
      const mapped = mapPayrollResponse(response);
      queryClient.setQueryData(
        payrollKeys.payroll(userId, response.month, response.year),
        mapped
      );
      return mapped;
    },
    [queryClient]
  );

  return {
    employees,
    selectedEmployee,
    payrollData,
    selectedEmployeeId: effectiveEmployeeId,
    setSelectedEmployeeId: handleSelectEmployee,
    selectedMonth,
    setSelectedMonth: handleSelectMonth,
    selectedYear,
    setSelectedYear: handleSelectYear,
    employeesLoading: employeesQuery.isLoading,
    employeesError: employeesQuery.error?.message ?? null,
    payrollLoading: payrollQuery.isLoading,
    payrollError: payrollQuery.error?.message ?? null,
    isUpdating: updateMutation.isPending,
    isDownloading: downloadMutation.isPending,
    canManagePayroll,
    isSelfPayrollView,
    canDownloadPayslip,
    handleUpdatePayroll,
    handleDownloadPayslip,
    applyPayrollResponse,
    refreshPayroll: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.all });
    },
  };
};
