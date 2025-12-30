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
} from "../components/employees";
import { employees as seedEmployees } from "../utils/dummyData";

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
  const [employeeList, setEmployeeList] = useState(seedEmployees);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState(EMPTY_FORM);

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
    </DashboardLayout>
  );
};
