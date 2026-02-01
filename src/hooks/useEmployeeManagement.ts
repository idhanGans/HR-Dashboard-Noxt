import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getInitials } from "../utils/utils";
import { employeeService } from "../services/employee";
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
  list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  statistics: () => [...employeeKeys.all, "statistics"] as const,
};

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
  employmentType: (form.employmentType ?? "PERMANENT") as
    | "PERMANENT"
    | "TEMPORARY"
    | "FORMER",
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
export const useEmployeeManagement = () => {
  const queryClient = useQueryClient();

  // Filter and search state (UI state, not server state)
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);

  // Modal state (UI state)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);

  // KPI modal states
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

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

  // Build filters object for query key
  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      employmentType: filter !== "all" ? filter : undefined,
    }),
    [debouncedSearch, filter]
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
  });

  /**
   * Fetch employee statistics (totals, not affected by filters)
   */
  const statisticsQuery = useQuery({
    queryKey: employeeKeys.statistics(),
    queryFn: employeeService.getEmployeeStatistics,
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
        employeeKeys.list(filters)
      );

      // Optimistically update the cache
      if (previousEmployees) {
        queryClient.setQueryData<Employee[]>(
          employeeKeys.list(filters),
          previousEmployees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, employmentType: "FORMER" as const }
              : emp
          )
        );
      }

      return { previousEmployees };
    },
    // On error, rollback to previous state
    onError: (_err, _employeeId, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(
          employeeKeys.list(filters),
          context.previousEmployees
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
    [employeesQuery.data]
  );
  const filteredEmployees = employeeList;
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

    try {
      if (mode === "add") {
        const createRequest = mapFormToCreateRequest(form);
        await createMutation.mutateAsync(createRequest);
      } else {
        if (form.id === null) {
          return;
        }
        const updateRequest = mapFormToUpdateRequest(form);
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

    // For now, payroll is local state only
    // When backend supports it, this would be a mutation
    setIsPayrollModalOpen(false);
    setSelectedEmployee(null);
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
