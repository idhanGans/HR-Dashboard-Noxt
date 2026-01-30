import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { interceptedAxios, handleAxiosError } from "../lib/axios";
import { getErrorMessage } from "../utils/errors";
import { getInitials } from "../utils/utils";
import {
  USERS_LIST,
  USERS_CREATE,
  USERS_UPDATE,
  USERS_STATISTICS,
} from "../services/endpoints";
import type {
  Employee,
  EmployeeForm,
  PayrollFormData,
} from "../types";
import type {
  UserApiResponse,
  PaginatedUsersApiResponse,
  EmployeeStatisticsApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
  OrganizationCount,
  TypeOfWork,
  Level,
  Gender,
  WorkStatus,
} from "../types/api";

const EMPLOYEE_PAGE_SIZE = 50;
const DEFAULT_PASSWORD = "Welcome123!";

const EMPTY_FORM: EmployeeForm = {
  id: null,
  name: "",
  department: "",
  role: "",
  email: "",
  phone: "",
  status: "present",
  employmentType: "PERMANENT",
  startDate: "",
  kpi: {
    currentScore: 8.0,
    target: 8.5,
    trend: "+0%",
    history: [],
    metrics: {
      productivity: 8.0,
      quality: 8.0,
      teamwork: 8.0,
      punctuality: 8.0,
    },
    lastUpdated: new Date().toISOString().split("T")[0],
  },
  payroll: {
    basicSalary: 10000000,
    allowances: 2000000,
    bonus: 1000000,
    deductions: 1200000,
    netSalary: 11800000,
    bankAccount: "",
    bankName: "",
  },
};



// Map backend UserApiResponse to frontend Employee
const mapUserToEmployee = (user: UserApiResponse): Employee => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  department: user.organization?.name ?? "",
  role: user.position ?? "",
  phone: user.phoneNumber ?? "",
  employmentType: user.employmentType,
  avatar: getInitials(user.fullName),
  startDate: user.startDate ? user.startDate.split("T")[0] : undefined,
  domicile: user.location ?? "",
  npwp: user.taxNumber ?? "",
  ktp: user.identityNumber ?? "",
  nickname: user.nickname ?? "",
  gender: user.gender ?? "",
  dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : undefined,
  typeOfWork: user.typeOfWork,
  workStatus: user.workStatus ?? "",
  division: user.division ?? "",
  level: user.level,
  payroll: {
    basicSalary: 0,
    allowances: 0,
    bonus: 0,
    deductions: 0,
    netSalary: 0,
    bankName: user.bankName ?? "",
    bankAccount: user.bankNumber ?? "",
  },
});

// Map frontend EmployeeForm to backend CreateUserRequest
const mapFormToCreateRequest = (form: EmployeeForm): CreateUserRequest => ({
  fullName: form.name,
  email: form.email ?? "",
  password: DEFAULT_PASSWORD,
  phoneNumber: form.phone ?? undefined,
  position: form.role ?? undefined,
  role: "EMPLOYEE",
  employmentType: (form.employmentType ?? "PERMANENT") as "PERMANENT" | "TEMPORARY" | "FORMER",
  taxNumber: form.npwp ?? undefined,
  identityNumber: form.ktp ?? undefined,
  startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
  location: form.domicile ?? undefined,
  nickname: form.nickname ?? undefined,
  gender: form.gender as Gender | undefined,
  dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
  typeOfWork: form.typeOfWork as TypeOfWork | undefined,
  workStatus: form.workStatus as WorkStatus | undefined,
  division: form.division ?? undefined,
  level: form.level as Level | undefined,
});

// Map frontend EmployeeForm to backend UpdateUserRequest
const mapFormToUpdateRequest = (form: EmployeeForm): UpdateUserRequest => ({
  fullName: form.name,
  email: form.email ?? undefined,
  phoneNumber: form.phone ?? undefined,
  position: form.role ?? undefined,
  employmentType: form.employmentType as "PERMANENT" | "TEMPORARY" | "FORMER" | undefined,
  taxNumber: form.npwp ?? undefined,
  identityNumber: form.ktp ?? undefined,
  startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
  location: form.domicile ?? undefined,
  nickname: form.nickname ?? undefined,
  gender: form.gender as Gender | undefined,
  dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
  typeOfWork: form.typeOfWork as TypeOfWork | undefined,
  workStatus: form.workStatus as WorkStatus | undefined,
  division: form.division ?? undefined,
  level: form.level as Level | undefined,
});

/**
 * useEmployeeManagement - Custom hook for employee state management with API integration
 */
export const useEmployeeManagement = () => {
  // Employee list state
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics state
  const [statistics, setStatistics] = useState<EmployeeStatisticsApiResponse | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // Filter and search state
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // KPI modal states
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Payroll modal states
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollForm, setPayrollForm] = useState<PayrollFormData>({
    basicSalary: 10000000,
    allowances: 2000000,
    bonus: 1000000,
    deductions: 1200000,
    netSalary: 11800000,
    bankAccount: "",
    bankName: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Fetch all employees with filtering
  const fetchEmployees = useCallback(async (searchQuery?: string, employmentTypeFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", String(EMPLOYEE_PAGE_SIZE));
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      if (employmentTypeFilter && employmentTypeFilter !== "all") {
        params.append("employmentType", employmentTypeFilter);
      }

      // Fetch first page
      const firstResponse = await interceptedAxios.get<PaginatedUsersApiResponse>(
        `${USERS_LIST}?${params.toString()}`
      );
      const { data: firstPageUsers, totalPages } = firstResponse.data;

      let allUsers = firstPageUsers;

      // Fetch remaining pages in parallel if there are more
      if (totalPages > 1) {
        const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) => {
          const pageParams = new URLSearchParams(params);
          pageParams.set("page", String(i + 2));
          return interceptedAxios.get<PaginatedUsersApiResponse>(
            `${USERS_LIST}?${pageParams.toString()}`
          );
        });
        const responses = await Promise.all(pagePromises);
        const additionalUsers = responses.flatMap((r) => r.data.data);
        allUsers = [...firstPageUsers, ...additionalUsers];
      }

      setEmployeeList(allUsers.map(mapUserToEmployee));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load employees"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await interceptedAxios.get<EmployeeStatisticsApiResponse>(
        USERS_STATISTICS
      );
      setStatistics(response.data);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    } finally {
      setStatisticsLoading(false);
    }
  }, []);

  // Fetch data on mount and when filters change
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!isActive) return;
      await Promise.all([
        fetchEmployees(debouncedSearch, filter),
        fetchStatistics(),
      ]);
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [fetchEmployees, fetchStatistics, debouncedSearch, filter]);

  // Refetch function for after mutations
  const refetch = useCallback(async () => {
    await Promise.all([
      fetchEmployees(debouncedSearch, filter),
      fetchStatistics(),
    ]);
  }, [fetchEmployees, fetchStatistics, debouncedSearch, filter]);

  const handleOpenAdd = () => {
    setMode("add");
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeForm) => {
    setMode("edit");
    setForm(emp);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email?.trim()) {
      alert("Please fill in name and email.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "add") {
        const createRequest = mapFormToCreateRequest(form);
        await interceptedAxios.post<UserApiResponse>(USERS_CREATE, createRequest);
      } else {
        if (form.id === null) {
          setSaving(false);
          return;
        }
        const updateRequest = mapFormToUpdateRequest(form);
        const endpoint = USERS_UPDATE.replace(":id", String(form.id));
        await interceptedAxios.put<UserApiResponse>(endpoint, updateRequest);
      }

      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      alert(handleAxiosError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleMarkFormer = async (emp: Employee) => {
    try {
      const endpoint = USERS_UPDATE.replace(":id", String(emp.id));
      await interceptedAxios.put<UserApiResponse>(endpoint, {
        employmentType: "FORMER",
        leaveDate: new Date().toISOString(),
      } as UpdateUserRequest);

      // Update local state immediately for better UX
      setEmployeeList((prev) =>
        prev.map((item) =>
          item.id === emp.id
            ? { ...item, employmentType: "FORMER" as const }
            : item
        )
      );

      // Refetch statistics
      await fetchStatistics();
    } catch (err) {
      alert(handleAxiosError(err));
    }
  };

  // KPI Management - opens modal, submission handled by KPIFormModal internally
  const handleOpenKPI = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsKPIModalOpen(true);
  };

  const handleCloseKPI = () => {
    setIsKPIModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleKPISaveSuccess = () => {
    // Optionally refetch data after successful KPI save
    refetch();
  };

  // Payroll Management (local state only for now)
  const handleOpenPayroll = (emp: Employee) => {
    setSelectedEmployee(emp);
    setPayrollForm({
      basicSalary: emp.payroll?.basicSalary || 10000000,
      allowances: emp.payroll?.allowances || 2000000,
      bonus: emp.payroll?.bonus || 1000000,
      deductions: emp.payroll?.deductions || 1200000,
      netSalary: emp.payroll?.netSalary || 11800000,
      bankAccount: emp.payroll?.bankAccount || "",
      bankName: emp.payroll?.bankName || "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setIsPayrollModalOpen(true);
  };

  const handleSavePayroll = () => {
    if (!selectedEmployee) return;

    const { month, year, ...payrollInfo } = payrollForm;
    void month;
    void year;

    // Update local state
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, payroll: { ...emp.payroll, ...payrollInfo } }
          : emp
      )
    );

    setIsPayrollModalOpen(false);
    setSelectedEmployee(null);
  };

  // Employees are already filtered by backend, so use employeeList directly
  const filteredEmployees = employeeList;

  // Counts from statistics (always shows totals, not affected by filters)
  const counts = useMemo(() => {
    if (statistics) {
      return {
        total: statistics.total,
        permanent: statistics.permanent,
        temporary: statistics.temporary,
        former: statistics.former,
      };
    }
    // Fallback to local calculation if statistics not loaded
    const total = employeeList.length;
    const permanent = employeeList.filter(
      (e) => e.employmentType === "PERMANENT"
    ).length;
    const temporary = employeeList.filter(
      (e) => e.employmentType === "TEMPORARY"
    ).length;
    const former = employeeList.filter(
      (e) => e.employmentType === "FORMER"
    ).length;
    return { total, permanent, temporary, former };
  }, [statistics, employeeList]);

  // Organization breakdown from statistics
  const organizationBreakdown: OrganizationCount[] = useMemo(() => {
    return statistics?.byOrganization ?? [];
  }, [statistics]);

  return {
    employeeList,
    filteredEmployees,
    counts,
    organizationBreakdown,
    loading,
    error,
    statisticsLoading,
    saving,
    filter,
    setFilter,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    mode,
    form,
    setForm,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleMarkFormer,
    refetch,
    // KPI management
    isKPIModalOpen,
    setIsKPIModalOpen,
    selectedEmployee,
    handleOpenKPI,
    handleCloseKPI,
    handleKPISaveSuccess,
    // Payroll management
    isPayrollModalOpen,
    setIsPayrollModalOpen,
    payrollForm,
    setPayrollForm,
    handleOpenPayroll,
    handleSavePayroll,
  };
};
