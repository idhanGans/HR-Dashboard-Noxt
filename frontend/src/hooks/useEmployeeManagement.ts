import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getInitials } from "../utils/utils";
import { employeeService } from "../services/employee";
import { payrollService } from "../services/payrollService";
import { useDepartmentStore } from "../stores/departmentStore";
import { useDepartments } from "./useDepartments";
import type { Employee, EmployeeForm, PayrollFormData } from "../types";
import type {
  UserApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
  OrganizationCount,
  TypeOfWork,
  Level,
  Gender,
  WorkStatus,
} from "../types/api";

// ============ Query Key Factory ============
// Colocated with queries per TkDodo's best practices
// @see https://tkdodo.eu/blog/effective-react-query-keys

interface EmployeeFilters {
  search?: string;
  employmentType?: string;
}

const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: EmployeeFilters) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  statistics: () => [...employeeKeys.all, "statistics"] as const,
};

const DEFAULT_PASSWORD = "Welcome123!";

const EMPTY_FORM: EmployeeForm = {
  id: null,
  name: "",
  department: "",
  departmentId: null,
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
  departmentId: user.organizationId ?? null,
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
  employmentType: (form.employmentType ?? "PERMANENT") as
    | "PERMANENT"
    | "TEMPORARY"
    | "FORMER",
  organizationId: form.departmentId ?? undefined,
  taxNumber: form.npwp ?? undefined,
  identityNumber: form.ktp ?? undefined,
  startDate: form.startDate
    ? new Date(form.startDate).toISOString()
    : undefined,
  location: form.domicile ?? undefined,
  nickname: form.nickname ?? undefined,
  gender: form.gender as Gender | undefined,
  dateOfBirth: form.dateOfBirth
    ? new Date(form.dateOfBirth).toISOString()
    : undefined,
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
  employmentType: form.employmentType as
    | "PERMANENT"
    | "TEMPORARY"
    | "FORMER"
    | undefined,
  organizationId: form.departmentId ?? null,
  taxNumber: form.npwp ?? undefined,
  identityNumber: form.ktp ?? undefined,
  startDate: form.startDate
    ? new Date(form.startDate).toISOString()
    : undefined,
  location: form.domicile ?? undefined,
  nickname: form.nickname ?? undefined,
  gender: form.gender as Gender | undefined,
  dateOfBirth: form.dateOfBirth
    ? new Date(form.dateOfBirth).toISOString()
    : undefined,
  typeOfWork: form.typeOfWork as TypeOfWork | undefined,
  workStatus: form.workStatus as WorkStatus | undefined,
  division: form.division ?? undefined,
  level: form.level as Level | undefined,
});

/**
 * useEmployeeManagement - Custom hook for employee state management with TanStack Query
 *
 * Uses:
 * - useQuery for fetching employees and statistics
 * - useMutation for create/update operations with automatic cache invalidation
 * - Optimistic updates for better UX on mark as former
 */
export const useEmployeeManagement = (options?: { enabled?: boolean }) => {
  const isEnabled = options?.enabled ?? true;
  const queryClient = useQueryClient();

  // Filter and search state (UI state, not server state)
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);

  // Department filter state (multi-select)
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>(
    [],
  );
  const [isDepartmentSelectionInitialized, setIsDepartmentSelectionInitialized] =
    useState(false);

  // Department list for name-to-id resolution
  const { data: departments = [] } = useDepartments();
  const departmentIdByName = useMemo(() => {
    const map = new Map<string, number>();
    departments.forEach((dept) => {
      map.set(dept.name, dept.id);
    });
    return map;
  }, [departments]);

  useEffect(() => {
    if (isDepartmentSelectionInitialized || departments.length === 0) return;
    setSelectedDepartmentIds(departments.map((dept) => dept.id));
    setIsDepartmentSelectionInitialized(true);
  }, [departments, isDepartmentSelectionInitialized]);

  // Department management modal
  const {
    modals: departmentModals,
    openManageModal: openDepartmentManageModal,
    closeManageModal: closeDepartmentManageModal,
  } = useDepartmentStore();

  // Modal state (UI state)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);

  // KPI modal states
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Payroll modal states
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollForm, setPayrollForm] = useState<PayrollFormData>({
    basicSalary: 0,
    allowances: 0,
    bonus: 0,
    tax: 0,
    insurance: 0,
    pension: 0,
    otherDeductions: 0,
    deductions: 0,
    netSalary: 0,
    bankAccount: "",
    bankName: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Build filters object for query key
  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      employmentType: filter !== "all" ? filter : undefined,
    }),
    [debouncedSearch, filter],
  );

  // ============ Queries ============

  /**
   * Fetch employees with filters
   * Query key includes filters so it auto-refetches when filters change
   */
  const employeesQuery = useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () =>
      employeeService.getEmployees({
        search: filters.search,
        employmentType: filters.employmentType,
      }),
    select: (data) => data.map(mapUserToEmployee),
    enabled: isEnabled,
  });

  /**
   * Fetch employee statistics (totals, not affected by filters)
   */
  const statisticsQuery = useQuery({
    queryKey: employeeKeys.statistics(),
    queryFn: employeeService.getEmployeeStatistics,
    enabled: isEnabled,
  });

  // ============ Mutations ============

  /**
   * Create employee mutation
   * Invalidates employee lists and statistics on success
   */
  const createMutation = useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      // Invalidate all employee lists (any filter combination)
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      // Also invalidate statistics since totals changed
      queryClient.invalidateQueries({
        queryKey: employeeKeys.statistics(),
      });
    },
  });

  /**
   * Update employee mutation
   * Invalidates employee lists and statistics on success
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.statistics(),
      });
    },
  });

  /**
   * Mark employee as former mutation
   * Uses optimistic update for immediate UI feedback
   */
  const markFormerMutation = useMutation({
    mutationFn: employeeService.markEmployeeAsFormer,
    // Optimistic update: update cache immediately before server responds
    onMutate: async (employeeId) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: employeeKeys.lists(),
      });

      // Snapshot current data for rollback
      const previousEmployees = queryClient.getQueryData<Employee[]>(
        employeeKeys.list(filters),
      );

      // Optimistically update the cache
      if (previousEmployees) {
        queryClient.setQueryData<Employee[]>(
          employeeKeys.list(filters),
          previousEmployees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, employmentType: "FORMER" as const }
              : emp,
          ),
        );
      }

      return { previousEmployees };
    },
    // On error, rollback to previous state
    onError: (_err, _employeeId, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(
          employeeKeys.list(filters),
          context.previousEmployees,
        );
      }
    },
    // Always refetch after mutation to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.statistics(),
      });
    },
  });

  // ============ Derived State ============

  const employeeList = useMemo(
    () => employeesQuery.data ?? [],
    [employeesQuery.data],
  );

  // Apply department filter on client side and sort by department name
  const filteredEmployees = useMemo(() => {
    if (selectedDepartmentIds.length === 0) return [];
    const list = employeeList.filter((emp) =>
      emp.departmentId
        ? selectedDepartmentIds.includes(emp.departmentId)
        : false,
    );
    return [...list].sort((a, b) => {
      const aDept = (a.department ?? "").toString();
      const bDept = (b.department ?? "").toString();
      return aDept.localeCompare(bDept, undefined, { sensitivity: "base" });
    });
  }, [employeeList, selectedDepartmentIds]);
  const statistics = statisticsQuery.data ?? null;

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
      (e) => e.employmentType === "PERMANENT",
    ).length;
    const temporary = employeeList.filter(
      (e) => e.employmentType === "TEMPORARY",
    ).length;
    const former = employeeList.filter(
      (e) => e.employmentType === "FORMER",
    ).length;
    return { total, permanent, temporary, former };
  }, [statistics, employeeList]);

  // Organization breakdown from statistics
  const organizationBreakdown: OrganizationCount[] = useMemo(() => {
    return statistics?.byOrganization ?? [];
  }, [statistics]);

  // ============ Handlers ============

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
    const resolvedDepartmentId =
      form.departmentId ?? departmentIdByName.get(form.department);
    if (!resolvedDepartmentId) {
      alert("Please select a department.");
      return;
    }

    const formWithDepartment = {
      ...form,
      departmentId: resolvedDepartmentId,
    };

    try {
      if (mode === "add") {
        const createRequest = mapFormToCreateRequest(formWithDepartment);
        await createMutation.mutateAsync(createRequest);
      } else {
        if (form.id === null) {
          return;
        }
        const updateRequest = mapFormToUpdateRequest(formWithDepartment);
        await updateMutation.mutateAsync({ id: form.id, data: updateRequest });
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleMarkFormer = async (emp: Employee) => {
    try {
      await markFormerMutation.mutateAsync(emp.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // KPI Management
  const handleOpenKPI = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsKPIModalOpen(true);
  };

  const handleCloseKPI = () => {
    setIsKPIModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleKPISaveSuccess = () => {
    // Invalidate queries to refetch after KPI save
    queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
  };

  const payrollMutation = useMutation({
    mutationFn: payrollService.updatePayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });

  // Payroll Management
  const handleOpenPayroll = (emp: Employee) => {
    setSelectedEmployee(emp);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    setPayrollForm({
      basicSalary: 0,
      allowances: 0,
      bonus: 0,
      tax: 0,
      insurance: 0,
      pension: 0,
      otherDeductions: 0,
      deductions: 0,
      netSalary: 0,
      bankAccount: emp.payroll?.bankAccount || "",
      bankName: emp.payroll?.bankName || "",
      month,
      year,
    });
    setIsPayrollModalOpen(true);

    payrollService
      .getPayroll({ userId: emp.id, month, year })
      .then((response) => {
        if (!response) return;
        setPayrollForm((prev) => ({
          ...prev,
          basicSalary: response.baseSalary ?? 0,
          allowances: response.allowance ?? 0,
          bonus: response.bonuses ?? 0,
          tax: response.tax ?? 0,
          insurance: response.insurance ?? 0,
          pension: response.pensionFund ?? 0,
          otherDeductions: response.otherDeductions ?? 0,
          deductions: response.totalDeductions ?? 0,
          netSalary: response.netPay ?? 0,
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch payroll data:", err);
      });
  };

  const handleSavePayroll = async () => {
    if (!selectedEmployee) return;

    if (payrollMutation.isPending) return;

    try {
      await payrollMutation.mutateAsync({
        userId: selectedEmployee.id,
        month: payrollForm.month,
        year: payrollForm.year,
        baseSalary: payrollForm.basicSalary,
        allowance: payrollForm.allowances,
        bonuses: payrollForm.bonus,
        tax: payrollForm.tax ?? 0,
        insurance: payrollForm.insurance ?? 0,
        pensionFund: payrollForm.pension ?? 0,
        otherDeductions: payrollForm.otherDeductions ?? 0,
      });

      setIsPayrollModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update payroll");
    }
  };

  // Manual refetch function (for external use if needed)
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: employeeKeys.all });
  };

  return {
    // Data
    employeeList,
    filteredEmployees,
    counts,
    organizationBreakdown,
    departments,

    // Loading states
    loading: employeesQuery.isLoading,
    error: employeesQuery.error?.message ?? null,
    statisticsLoading: statisticsQuery.isLoading,
    saving: createMutation.isPending || updateMutation.isPending,

    // Filter state
    filter,
    setFilter,
    search,
    setSearch,

    // Department filter
    selectedDepartmentIds,
    setSelectedDepartmentIds,

    // Department management modal
    isDepartmentManageOpen: departmentModals.manageModal.isOpen,
    openDepartmentManageModal,
    closeDepartmentManageModal,

    // Modal state
    isModalOpen,
    setIsModalOpen,
    mode,
    form,
    setForm,

    // Actions
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
