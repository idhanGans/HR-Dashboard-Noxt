import { useMemo, useState } from "react";
import { useEmployees } from "./useEmployees";
import type {
  Employee,
  EmployeeForm,
  KPIProfile,
  PayrollFormData,
} from "../types";

const EMPTY_FORM: EmployeeForm = {
  id: null,
  name: "",
  department: "Engineering",
  role: "",
  email: "",
  phone: "",
  status: "present",
  employmentType: "permanent",
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

/**
 * useEmployeeManagement - Custom hook for employee state management
 */
export const useEmployeeManagement = () => {
  const {
    employees: employeeList,
    setEmployees: setEmployeeList,
    updateEmployeeKPI,
    updateEmployeePayroll,
  } = useEmployees();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);

  // KPI modal states
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [kpiForm, setKpiForm] = useState<KPIProfile>({
    currentScore: 8.0,
    target: 8.5,
    metrics: {
      productivity: 8.0,
      quality: 8.0,
      teamwork: 8.0,
      punctuality: 8.0,
    },
  });

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

  const handleSave = () => {
    if (
      !form.name.trim() ||
      !form.department.trim() ||
      !form.role?.trim()
    ) {
      alert("Please fill name, department, and role.");
      return;
    }

    if (mode === "add") {
      const newEmployee = {
        ...form,
        id: Date.now(),
        avatar: (form.name || "")
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
      setEmployeeList((prev) => [newEmployee, ...prev]);
    } else {
      if (form.id === null) {
        return;
      }
      setEmployeeList((prev) =>
        prev.map((emp) =>
          emp.id === form.id ? { ...emp, ...form, id: emp.id } : emp,
        ),
      );
    }

    setIsModalOpen(false);
  };

  const handleMarkFormer = (emp: Employee) => {
    setEmployeeList((prev) =>
      prev.map((item) =>
        item.id === emp.id
          ? { ...item, employmentType: "former", status: "absent" }
          : item,
      ),
    );
  };

  // KPI Management
  const handleOpenKPI = (emp: Employee) => {
    setSelectedEmployee(emp);
    setKpiForm({
      currentScore: emp.kpi?.currentScore || 8.0,
      target: emp.kpi?.target || 8.5,
      metrics: emp.kpi?.metrics || {
        productivity: 8.0,
        quality: 8.0,
        teamwork: 8.0,
        punctuality: 8.0,
      },
    });
    setIsKPIModalOpen(true);
  };

  const handleSaveKPI = () => {
    if (!selectedEmployee) return;

    // Calculate trend
    const oldScore = selectedEmployee.kpi?.currentScore || 0;
    const newScore = kpiForm.currentScore;
    const diff =
      oldScore > 0
        ? Math.round(((newScore - oldScore) / oldScore) * 100)
        : 0;
    const trend = diff > 0 ? `+${diff}%` : `${diff}%`;

    // Update history with month and year
    const now = new Date();
    const currentMonth = now.toLocaleString("en-US", { month: "short" });
    const currentYear = now.getFullYear();

    const history = [...(selectedEmployee.kpi?.history || [])];
    const lastEntryIndex = history.findIndex(
      (h: { month: string; year?: number }) =>
        h.month === currentMonth && h.year === currentYear,
    );

    if (lastEntryIndex >= 0) {
      // Update current month/year
      history[lastEntryIndex] = {
        month: currentMonth,
        year: currentYear,
        score: newScore,
      };
    } else {
      // Add new month/year entry (keep last 12 entries)
      history.push({ month: currentMonth, year: currentYear, score: newScore });
      if (history.length > 12) history.shift();
    }

    updateEmployeeKPI(selectedEmployee.id, {
      ...kpiForm,
      trend,
      history,
      lastUpdated: new Date().toISOString().split("T")[0],
    });

    setIsKPIModalOpen(false);
    setSelectedEmployee(null);
  };

  // Payroll Management
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
    updateEmployeePayroll(selectedEmployee.id, payrollInfo);

    setIsPayrollModalOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp) => {
      const matchesFilter =
        filter === "all"
          ? true
          : (emp.employmentType ?? "").toLowerCase() === filter;
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [employeeList, filter, search]);

  const counts = useMemo(() => {
    const total = employeeList.length;
    const permanent = employeeList.filter(
      (e) => e.employmentType === "permanent",
    ).length;
    const temporary = employeeList.filter(
      (e) => e.employmentType === "temporary",
    ).length;
    const former = employeeList.filter(
      (e) => e.employmentType === "former",
    ).length;
    return { total, permanent, temporary, former };
  }, [employeeList]);

  return {
    employeeList,
    filteredEmployees,
    counts,
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
    // KPI management
    isKPIModalOpen,
    setIsKPIModalOpen,
    selectedEmployee,
    kpiForm,
    setKpiForm,
    handleOpenKPI,
    handleSaveKPI,
    // Payroll management
    isPayrollModalOpen,
    setIsPayrollModalOpen,
    payrollForm,
    setPayrollForm,
    handleOpenPayroll,
    handleSavePayroll,
  };
};
