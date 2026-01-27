import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { interceptedAxios } from "../lib/axios";
import { ApiError } from "../types/api";
import { AxiosError } from "axios";
import {
  PAYROLL_BY_PERIOD,
  PAYROLL_EMPLOYEE_LIST,
} from "../services/endpoints";
import { hasRequiredRole } from "../utils/roles";
import { getErrorMessage } from "../utils/errors";
import type {
  Employee,
  PayrollHistoryRecord,
  PayrollInfo,
} from "../types";
import type {
  PayrollApiResponse,
  PayrollUser,
  PayrollUsersResponse,
} from "../types/api";

const EMPLOYEE_PAGE_SIZE = 50;

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

const normalizeEmploymentType = (
  value?: string,
): Employee["employmentType"] | undefined => {
  const normalized = value?.toLowerCase();
  if (
    normalized === "permanent" ||
    normalized === "temporary" ||
    normalized === "former"
  ) {
    return normalized as Employee["employmentType"];
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
    role: user.roleName ?? user.role ?? "",
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

const mapPayrollResponse = (
  response: PayrollApiResponse,
): PayrollHistoryRecord => ({
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

const upsertPayrollHistory = (
  history: PayrollHistoryRecord[] | undefined,
  record: PayrollHistoryRecord,
) => {
  const existing = history ? [...history] : [];
  const index = existing.findIndex(
    (entry) => entry.month === record.month && entry.year === record.year,
  );

  if (index >= 0) {
    existing[index] = record;
  } else {
    existing.push(record);
  }

  existing.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return existing;
};

const extractUsers = (response: PayrollUsersResponse) => {
  if (Array.isArray(response)) {
    return { users: response, totalPages: 1 };
  }
  return {
    users: response.data ?? [],
    totalPages: response.totalPages ?? 1,
  };
};

export const usePayrollData = () => {
  const { auth } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrollData, setPayrollData] = useState<
    PayrollInfo | PayrollHistoryRecord | null
  >(null);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [payrollError, setPayrollError] = useState<string | null>(null);

  const canManagePayroll = hasRequiredRole(auth.role, ["SUPERADMIN"]);
  const isSelfPayrollView = !canManagePayroll;
  const canDownloadPayslip = canManagePayroll || isSelfPayrollView;

  useEffect(() => {
    let isActive = true;

    if (isSelfPayrollView) {
      if (!auth.userId) {
        setEmployees([]);
        setEmployeesError("Unable to load your profile");
        setEmployeesLoading(false);
        return () => {
          isActive = false;
        };
      }

      const selfEmployee: Employee = {
        id: auth.userId,
        name: auth.userName,
        department: "General",
        role: auth.userRole,
        employmentType: "permanent",
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

      setEmployees([selfEmployee]);
      setEmployeesError(null);
      setEmployeesLoading(false);
      setSelectedEmployeeId(auth.userId);
      return () => {
        isActive = false;
      };
    }

    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      setEmployeesError(null);
      try {
        const firstResponse = await interceptedAxios.get<PayrollUsersResponse>(
          `${PAYROLL_EMPLOYEE_LIST}?page=1&limit=${EMPLOYEE_PAGE_SIZE}`,
        );
        const { users, totalPages } = extractUsers(firstResponse.data);

        let allUsers = users;
        if (totalPages > 1) {
          const pages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              interceptedAxios.get<PayrollUsersResponse>(
                `${PAYROLL_EMPLOYEE_LIST}?page=${index + 2}&limit=${EMPLOYEE_PAGE_SIZE}`,
              ),
            ),
          );
          const rest = pages.flatMap((page) => extractUsers(page.data).users);
          allUsers = [...users, ...rest];
        }

        if (!isActive) return;
        setEmployees(allUsers.map(mapPayrollUser));
      } catch (error) {
        if (!isActive) return;
        setEmployeesError(getErrorMessage(error, "Unable to load employees"));
      } finally {
        if (isActive) {
          setEmployeesLoading(false);
        }
      }
    };

    fetchEmployees();
    return () => {
      isActive = false;
    };
  }, [auth.userId, auth.userName, auth.userRole, isSelfPayrollView]);

  useEffect(() => {
    let isActive = true;

    const fetchPayroll = async () => {
      if (!selectedEmployeeId) {
        setPayrollData(null);
        setPayrollError(null);
        setPayrollLoading(false);
        return;
      }

      setPayrollLoading(true);
      setPayrollError(null);
      try {
        const path = `${PAYROLL_BY_PERIOD.replace(
          ":userId",
          String(selectedEmployeeId),
        )}?month=${selectedMonth}&year=${selectedYear}`;
        const response = await interceptedAxios.get<PayrollApiResponse>(path);
        if (!isActive) return;
        const mapped = mapPayrollResponse(response.data);
        setPayrollData(mapped);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployeeId
              ? {
                  ...emp,
                  payrollHistory: upsertPayrollHistory(emp.payrollHistory, mapped),
                }
              : emp,
          ),
        );
      } catch (error) {
        if (!isActive) return;
        const is404 =
          (error instanceof ApiError && error.status === 404) ||
          (error instanceof AxiosError && error.response?.status === 404);
        if (is404) {
          setPayrollData(null);
        } else {
          setPayrollError(getErrorMessage(error, "Unable to load payroll data"));
          setPayrollData(null);
        }
      } finally {
        if (isActive) {
          setPayrollLoading(false);
        }
      }
    };

    fetchPayroll();
    return () => {
      isActive = false;
    };
  }, [selectedEmployeeId, selectedMonth, selectedYear]);

  const applyPayrollResponse = useCallback(
    (
      userId: number,
      response: PayrollApiResponse,
      bankInfo?: { bankName?: string; bankAccount?: string },
    ) => {
      const mapped = mapPayrollResponse(response);
      setPayrollData(mapped);
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id !== userId) return emp;
          return {
            ...emp,
            payrollHistory: upsertPayrollHistory(emp.payrollHistory, mapped),
            payroll: {
              basicSalary: mapped.basicSalary ?? 0,
              allowances: mapped.allowances ?? 0,
              bonus: mapped.bonus ?? 0,
              deductions: mapped.deductions ?? 0,
              netSalary: mapped.netSalary ?? 0,
              tax: mapped.tax ?? 0,
              insurance: mapped.insurance ?? 0,
              pension: mapped.pension ?? 0,
              otherDeductions: mapped.otherDeductions ?? 0,
              totalEarnings: mapped.totalEarnings ?? 0,
              totalDeductions: mapped.totalDeductions ?? 0,
              bankName: bankInfo?.bankName ?? emp.payroll?.bankName ?? "",
              bankAccount:
                bankInfo?.bankAccount ?? emp.payroll?.bankAccount ?? "",
            },
          };
        }),
      );
      return mapped;
    },
    [setEmployees, setPayrollData],
  );

  return {
    employees,
    employeesLoading,
    employeesError,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    payrollData,
    payrollLoading,
    payrollError,
    canManagePayroll,
    isSelfPayrollView,
    canDownloadPayslip,
    applyPayrollResponse,
  };
};
