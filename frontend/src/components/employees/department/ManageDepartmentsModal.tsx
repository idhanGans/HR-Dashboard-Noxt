import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "../../Button";
import { DepartmentTable } from "./DepartmentTable";
import { DepartmentFormModal } from "./DepartmentFormModal";
import { DepartmentDeleteModal } from "./ConfirmDeleteModal";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../../hooks/useDepartments";
import { useDepartmentStore } from "../../../stores/departmentStore";
import type { Department, CreateDepartmentRequest } from "../../../types/api";
import type { DepartmentFormData } from "./DepartmentFormModal";

interface ManageDepartmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  /** Current user ID used as supervisorId when creating departments */
  userId: number | null;
}

/**
 * ManageDepartmentsModal - Full department management drawer/modal
 * Contains department table, search, and CRUD operations
 * SUPERADMIN: full CRUD
 * ADMIN/SUPERVISOR: view only
 * EMPLOYEE: no access (handled at parent level)
 */
export const ManageDepartmentsModal = ({
  isOpen,
  onClose,
  userRole,
  userId,
}: ManageDepartmentsModalProps) => {
  const isSuperAdmin = userRole === "SUPERADMIN";

  // Local search state
  const [searchInput, setSearchInput] = useState("");

  // Store state for sub-modals
  const {
    modals,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
  } = useDepartmentStore();

  // Data fetching
  const { data: departments = [], isLoading } = useDepartments();

  // Mutations
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    if (!searchInput.trim()) return departments;
    const query = searchInput.toLowerCase();
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(query) ||
        dept.supervisorName.toLowerCase().includes(query),
    );
  }, [departments, searchInput]);

  // Existing department names for duplicate check
  const existingNames = useMemo(
    () => departments.map((d) => d.name),
    [departments],
  );

  // ============ Handlers ============

  const handleCreateSubmit = async (data: DepartmentFormData) => {
    if (!userId) return;

    const request: CreateDepartmentRequest = {
      name: data.name.trim(),
      supervisorId: userId,
    };

    try {
      await createMutation.mutateAsync(request);
      closeFormModal();
    } catch {
      // Error is handled by React Query - user sees error state
    }
  };

  const handleEditSubmit = async (data: DepartmentFormData) => {
    const dept = modals.formModal.department;
    if (!dept) return;

    try {
      await updateMutation.mutateAsync({
        id: dept.id,
        data: { name: data.name.trim() },
      });
      closeFormModal();
    } catch {
      // Error handled by React Query
    }
  };

  const handleDeleteConfirm = async () => {
    const dept = modals.deleteModal.department;
    if (!dept) return;

    try {
      await deleteMutation.mutateAsync(dept.id);
      closeDeleteModal();
    } catch {
      // Error handled by React Query
    }
  };

  const handleEdit = (department: Department) => {
    openEditModal(department);
  };

  const handleDelete = (department: Department) => {
    openDeleteModal(department);
  };

  const handleClose = () => {
    setSearchInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-4xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">
                Manage Departments
              </h2>
              <p className="text-lightGrey text-sm mt-1">
                {departments.length} department
                {departments.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <Button
                  onClick={openCreateModal}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Department
                </Button>
              )}
              <button
                onClick={handleClose}
                className="text-lightGrey hover:text-white transition-all p-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex-shrink-0">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-lightGrey"
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search departments..."
                className="glass-input w-full pl-10"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lightGrey hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Department Table */}
          <div className="flex-1 overflow-y-auto">
            <DepartmentTable
              departments={filteredDepartments}
              isLoading={isLoading}
              userRole={userRole}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <DepartmentFormModal
        isOpen={modals.formModal.isOpen}
        onClose={closeFormModal}
        mode={modals.formModal.mode}
        department={modals.formModal.department}
        onSubmit={
          modals.formModal.mode === "create"
            ? handleCreateSubmit
            : handleEditSubmit
        }
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        existingNames={existingNames}
      />

      {/* Delete Confirmation */}
      <DepartmentDeleteModal
        isOpen={modals.deleteModal.isOpen}
        onClose={closeDeleteModal}
        department={modals.deleteModal.department}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};
