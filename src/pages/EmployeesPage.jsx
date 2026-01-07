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
import { useEmployeeManagement } from "../hooks/useEmployeeManagement";

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
