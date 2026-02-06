import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DashboardLayout,
  DropdownSelect,
  Modal,
} from "../components";
import { OrgChartTree } from "../components/organization";
import {
  createOrgChartNode,
  deleteOrgChartNode,
  getOrgChartTree,
  updateOrgChartNode,
  type OrgChartNode,
  type OrgChartNodePayload,
} from "../services/orgChart";
import { employeeService } from "../services/employee";
import type { LayoutProps } from "../types/auth";
import type { UserApiResponse } from "../types/api";

type OrgChartFormState = {
  userId: number | null;
  name: string;
  position: string;
};

type OrgChartModalState =
  | {
      isOpen: false;
      mode: "create" | "edit";
      parentId: number | null;
      node: OrgChartNode | null;
    }
  | {
      isOpen: true;
      mode: "create" | "edit";
      parentId: number | null;
      node: OrgChartNode | null;
    };

const EMPTY_FORM: OrgChartFormState = {
  userId: null,
  name: "",
  position: "",
};

export const OrganizationPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [modalState, setModalState] = useState<OrgChartModalState>({
    isOpen: false,
    mode: "create",
    parentId: null,
    node: null,
  });
  const [formState, setFormState] = useState<OrgChartFormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<OrgChartNode | null>(null);

  const orgChartQuery = useQuery({
    queryKey: ["orgChartTree"],
    queryFn: getOrgChartTree,
    staleTime: 5 * 60 * 1000,
  });

  const employeesQuery = useQuery({
    queryKey: ["orgChartEmployees"],
    queryFn: () => employeeService.getEmployees(),
    staleTime: 5 * 60 * 1000,
  });

  const employeeOptions = useMemo(() => {
    const employees = employeesQuery.data ?? [];
    return employees
      .map((employee) => ({
        value: employee.id,
        label: employee.position
          ? `${employee.fullName} — ${employee.position}`
          : employee.fullName,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employeesQuery.data]);

  const employeeLookup = useMemo(() => {
    const employees = employeesQuery.data ?? [];
    return new Map<number, UserApiResponse>(
      employees.map((employee) => [employee.id, employee]),
    );
  }, [employeesQuery.data]);

  const createMutation = useMutation({
    mutationFn: createOrgChartNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgChartTree"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<OrgChartNodePayload>;
    }) => updateOrgChartNode(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgChartTree"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrgChartNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgChartTree"] });
    },
  });

  const openCreateModal = (parentId: number | null) => {
    setFormState(EMPTY_FORM);
    setModalState({
      isOpen: true,
      mode: "create",
      parentId,
      node: null,
    });
  };

  const openEditModal = (node: OrgChartNode) => {
    setFormState({
      userId: node.user?.id ?? null,
      name: node.name,
      position: node.position ?? "",
    });
    setModalState({
      isOpen: true,
      mode: "edit",
      parentId: node.parentId ?? null,
      node,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleEmployeeSelect = (value: string | number | null) => {
    const nextId = value === null ? null : Number(value);
    const selected = nextId ? employeeLookup.get(nextId) : undefined;
    setFormState((prev) => ({
      ...prev,
      userId: nextId,
      name: selected ? selected.fullName : prev.name,
    }));
  };

  const handleSave = async () => {
    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      alert("Please provide a name for the node.");
      return;
    }

    const payload = {
      name: trimmedName,
      position: formState.position.trim() || null,
      userId: formState.userId,
    };

    try {
      if (modalState.mode === "create") {
        await createMutation.mutateAsync({
          ...payload,
          parentId: modalState.parentId,
        });
      } else if (modalState.node) {
        await updateMutation.mutateAsync({
          id: modalState.node.id,
          payload,
        });
      }
      closeModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const selectedEmployee =
    formState.userId !== null ? employeeLookup.get(formState.userId) : undefined;
  const positionHint =
    selectedEmployee?.position && !formState.position.trim()
      ? `If left blank, we will display the employee's position: ${selectedEmployee.position}`
      : null;

  const canEdit = userRole === "SUPERADMIN";
  const editingEnabled = canEdit && isEditing;

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Organization Chart
          </h1>
          <p className="text-lightGrey text-sm">
            Build and maintain your organization structure.
          </p>
        </div>
        {canEdit ? (
          <Button
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Exit Edit Mode" : "Edit Chart"}
          </Button>
        ) : (
          <span className="text-xs text-lightGrey border border-white/10 px-3 py-2 rounded-lg">
            View only
          </span>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        {orgChartQuery.isLoading ? (
          <div className="text-center py-10 text-lightGrey">Loading chart...</div>
        ) : orgChartQuery.error ? (
          <div className="text-center py-10 text-red-400">
            {orgChartQuery.error instanceof Error
              ? orgChartQuery.error.message
              : "Failed to load chart"}
          </div>
        ) : orgChartQuery.data && orgChartQuery.data.length > 0 ? (
          <OrgChartTree
            nodes={orgChartQuery.data}
            isEditing={editingEnabled}
            onAddRoot={editingEnabled ? () => openCreateModal(null) : undefined}
            onAddChild={
              editingEnabled ? (node) => openCreateModal(node.id) : undefined
            }
            onDelete={editingEnabled ? (node) => setDeleteTarget(node) : undefined}
            onEdit={editingEnabled ? (node) => openEditModal(node) : undefined}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lightGrey mb-4">
              No organization nodes yet. Create your first node to get started.
            </p>
            {canEdit ? (
              <Button onClick={() => openCreateModal(null)}>
                Create First Node
              </Button>
            ) : (
              <span className="text-xs text-lightGrey">
                Only superadmins can edit the organization chart.
              </span>
            )}
          </div>
        )}
      </div>

      {canEdit && (
        <>
          <Modal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            title={modalState.mode === "create" ? "Add Node" : "Edit Node"}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                  Link Employee (Optional)
                </label>
                <DropdownSelect
                  value={formState.userId}
                  onChange={handleEmployeeSelect}
                  options={employeeOptions}
                  placeholder="Select employee"
                  showEmptyOption
                  emptyOptionLabel="No linked employee"
                  noOptionsLabel="No employees found"
                  isLoading={employeesQuery.isLoading}
                  error={
                    employeesQuery.error instanceof Error
                      ? employeesQuery.error.message
                      : null
                  }
                  ariaLabel="Select employee"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                  Name
                </label>
                <input
                  className={`glass-input w-full ${
                    formState.userId !== null
                      ? "text-gray-400 opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter name"
                  disabled={formState.userId !== null}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-lightGrey mb-2 uppercase">
                  Position (Optional)
                </label>
                <input
                  className="glass-input w-full"
                  value={formState.position}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      position: event.target.value,
                    }))
                  }
                  placeholder="e.g., Lead Designer"
                />
                {positionHint && (
                  <p className="text-xs text-lightGrey mt-2">{positionHint}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={deleteTarget !== null}
            onClose={() => setDeleteTarget(null)}
            title="Delete Node"
          >
            <div className="space-y-4">
              <p className="text-lightGrey">
                Deleting this user will automatically delete all children of the
                node.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
};
