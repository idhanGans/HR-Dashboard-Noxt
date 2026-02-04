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
} from "../components/employees";
import { useEmployeeManagement } from "../hooks/useEmployeeManagement";
import type { LayoutProps } from "../types/auth";

/**
 * EmployeesPage - Employee management page with add/edit and employment type controls
 */
export const EmployeesPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
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
        />
      )}

      <div className="mt-8">
        <EmployeeAvatarManager
          employees={filteredEmployees}
          onAvatarUpdate={() => {
            // Trigger re-render if needed
          }}
        />
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
    </DashboardLayout>
  );
};
