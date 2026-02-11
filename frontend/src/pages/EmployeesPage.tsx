import { DashboardLayout } from "../components";
import { EmployeeAvatarManager } from "../components";
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
  ManageDepartmentsModal,
} from "../components/employees";
import { useEmployeeManagement } from "../hooks/useEmployeeManagement";
import { useAuth } from "../contexts/AuthContext";
import type { LayoutProps } from "../types/auth";
import { hasRequiredRole } from "../utils/roles";

/**
 * EmployeesPage - Employee management page with add/edit and employment type controls
 */
export const EmployeesPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  const { auth } = useAuth();
  const canManagePayroll = hasRequiredRole(userRole, ["SUPERADMIN"]);

  const {
    filteredEmployees,
    counts,
    organizationBreakdown,
    loading,
    error,
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
    // Department management
    departmentFilter,
    setDepartmentFilter,
    isDepartmentManageOpen,
    openDepartmentManageModal,
    closeDepartmentManageModal,
    // KPI management
    isKPIModalOpen,
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
  } = useEmployeeManagement();

  const handleDepartmentFilterChange = (value: string | number | null) => {
    setDepartmentFilter(value ? String(value) : null);
  };

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
        userRole={userRole}
        onManageDepartments={openDepartmentManageModal}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={handleDepartmentFilterChange}
      />

      <EmployeeStats counts={counts} />

      <EmployeeFilters filter={filter} onFilterChange={setFilter} />

      {loading ? (
        <div className="text-center py-8 text-lightGrey">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleOpenEdit}
          onMarkFormer={handleMarkFormer}
          onManageKPI={handleOpenKPI}
          onManagePayroll={handleOpenPayroll}
          canManagePayroll={canManagePayroll}
        />
      )}

      <div className="mt-8">
        <EmployeeAvatarManager employees={filteredEmployees} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentBreakdown
          organizationBreakdown={organizationBreakdown}
          totalEmployees={counts.total}
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
        saving={saving}
        userRole={userRole}
      />

      <KPIFormModal
        isOpen={isKPIModalOpen}
        onClose={handleCloseKPI}
        employee={selectedEmployee}
        onSaveSuccess={handleKPISaveSuccess}
      />

      <PayrollFormModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        employee={selectedEmployee}
        payrollData={payrollForm}
        onPayrollChange={setPayrollForm}
        onSave={handleSavePayroll}
      />

      <ManageDepartmentsModal
        isOpen={isDepartmentManageOpen}
        onClose={closeDepartmentManageModal}
        userRole={userRole}
        userId={auth.userId}
      />
    </DashboardLayout>
  );
};
