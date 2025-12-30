import { useMemo, useState } from "react";
import { DashboardLayout } from "../components";
import {
  EmployeeStats,
  EmployeeFilters,
  EmployeeTable,
  DepartmentBreakdown,
  HRContactCard,
  EmployeeFormModal,
  EmployeeHeader,
  KPIFormModal,
  PayrollFormModal,
} from "../components/employees";
import { useEmployees } from "../contexts/EmployeeContext";

// Default empty form state
const EMPTY_FORM = {
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

// Department list for breakdown
const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Product",
  "Operations",
  "Finance",
  "Customer Success",
];

/**
 * useEmployeeManagement - Custom hook for employee state management
 */
const useEmployeeManagement = () => {
  const {
    employees: employeeList,
    setEmployees: setEmployeeList,
    updateEmployeeKPI,
    updateEmployeePayroll,
  } = useEmployees();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState(EMPTY_FORM);

  // KPI modal states
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [kpiForm, setKpiForm] = useState({
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
  const [payrollForm, setPayrollForm] = useState({
    basicSalary: 10000000,
    allowances: 2000000,
    bonus: 1000000,
    deductions: 1200000,
    netSalary: 11800000,
    bankAccount: "",
    bankName: "",
  });

  const handleOpenAdd = () => {
    setMode("add");
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setMode("edit");
    setForm(emp);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.department.trim() || !form.role.trim()) {
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
      setEmployeeList((prev) =>
        prev.map((emp) => (emp.id === form.id ? { ...form } : emp))
      );
    }

    setIsModalOpen(false);
  };

  const handleMarkFormer = (emp) => {
    setEmployeeList((prev) =>
      prev.map((item) =>
        item.id === emp.id
          ? { ...item, employmentType: "former", status: "absent" }
          : item
      )
    );
  };

  // KPI Management
  const handleOpenKPI = (emp) => {
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
      oldScore > 0 ? (((newScore - oldScore) / oldScore) * 100).toFixed(0) : 0;
    const trend = diff > 0 ? `+${diff}%` : `${diff}%`;

    // Update history
    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    const history = [...(selectedEmployee.kpi?.history || [])];
    const lastEntry = history[history.length - 1];

    if (lastEntry && lastEntry.month === currentMonth) {
      // Update current month
      history[history.length - 1] = { month: currentMonth, score: newScore };
    } else {
      // Add new month
      if (history.length >= 12) history.shift();
      history.push({ month: currentMonth, score: newScore });
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
  const handleOpenPayroll = (emp) => {
    setSelectedEmployee(emp);
    setPayrollForm({
      basicSalary: emp.payroll?.basicSalary || 10000000,
      allowances: emp.payroll?.allowances || 2000000,
      bonus: emp.payroll?.bonus || 1000000,
      deductions: emp.payroll?.deductions || 1200000,
      netSalary: emp.payroll?.netSalary || 11800000,
      bankAccount: emp.payroll?.bankAccount || "",
      bankName: emp.payroll?.bankName || "",
    });
    setIsPayrollModalOpen(true);
  };

  const handleSavePayroll = () => {
    if (!selectedEmployee) return;

    updateEmployeePayroll(selectedEmployee.id, payrollForm);

    setIsPayrollModalOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp) => {
      const matchesFilter =
        filter === "all" ? true : emp.employmentType.toLowerCase() === filter;
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [employeeList, filter, search]);

  const counts = useMemo(() => {
    const total = employeeList.length;
    const permanent = employeeList.filter(
      (e) => e.employmentType === "permanent"
    ).length;
    const temporary = employeeList.filter(
      (e) => e.employmentType === "temporary"
    ).length;
    const former = employeeList.filter(
      (e) => e.employmentType === "former"
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

/**
 * EmployeesPage - Employee management page with add/edit and employment type controls
 */
export const EmployeesPage = ({ onLogout, userName, userRole }) => {
  const {
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
  } = useEmployeeManagement();

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <EmployeeHeader
        search={search}
        onSearchChange={setSearch}
        onAddClick={handleOpenAdd}
      />

      <EmployeeStats counts={counts} />

      <EmployeeFilters filter={filter} onFilterChange={setFilter} />

      <EmployeeTable
        employees={filteredEmployees}
        onEdit={handleOpenEdit}
        onMarkFormer={handleMarkFormer}
        onManageKPI={handleOpenKPI}
        onManagePayroll={handleOpenPayroll}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentBreakdown
          employees={employeeList}
          departments={DEPARTMENTS}
        />
        <HRContactCard />
      </div>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={mode}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
      />

      <KPIFormModal
        isOpen={isKPIModalOpen}
        onClose={() => setIsKPIModalOpen(false)}
        employee={selectedEmployee}
        kpiData={kpiForm}
        onKpiChange={setKpiForm}
        onSave={handleSaveKPI}
      />

      <PayrollFormModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        employee={selectedEmployee}
        payrollData={payrollForm}
        onPayrollChange={setPayrollForm}
        onSave={handleSavePayroll}
      />
    </DashboardLayout>
  );
};
