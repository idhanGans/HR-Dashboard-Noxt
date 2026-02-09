import { create } from "zustand";
import type { Department, DepartmentApiResponse } from "../types/api";

// ============ Store Types ============

interface DepartmentModalState {
  formModal: {
    isOpen: boolean;
    mode: "create" | "edit";
    department: Department | null;
  };
  deleteModal: {
    isOpen: boolean;
    department: Department | null;
  };
  manageModal: {
    isOpen: boolean;
  };
}

interface DepartmentState {
  departments: Department[];
  selectedDepartment: Department | null;
  modals: DepartmentModalState;
  search: string;
}

interface DepartmentActions {
  // Data actions
  setDepartments: (departments: Department[]) => void;
  setSelectedDepartment: (department: Department | null) => void;

  // Search
  setSearch: (search: string) => void;

  // Manage modal
  openManageModal: () => void;
  closeManageModal: () => void;

  // Form modal actions
  openCreateModal: () => void;
  openEditModal: (department: Department) => void;
  closeFormModal: () => void;

  // Delete modal actions
  openDeleteModal: (department: Department) => void;
  closeDeleteModal: () => void;

  // Reset
  reset: () => void;
}

type DepartmentStore = DepartmentState & DepartmentActions;

// ============ Default State ============

const DEFAULT_MODAL_STATE: DepartmentModalState = {
  formModal: { isOpen: false, mode: "create", department: null },
  deleteModal: { isOpen: false, department: null },
  manageModal: { isOpen: false },
};

// ============ Helper: Map API response to frontend Department ============

export const mapApiToDepartment = (org: DepartmentApiResponse): Department => ({
  id: org.id,
  name: org.name,
  description: "",
  supervisorId: org.supervisorId,
  supervisorName: org.supervisor?.fullName ?? "",
  memberCount: org.members?.length ?? 0,
  status: "ACTIVE",
  createdAt: org.createdAt,
  updatedAt: org.updatedAt,
});

// ============ Store ============

export const useDepartmentStore = create<DepartmentStore>((set) => ({
  // Initial state
  departments: [],
  selectedDepartment: null,
  modals: { ...DEFAULT_MODAL_STATE },
  search: "",

  // Data actions
  setDepartments: (departments) => set({ departments }),
  setSelectedDepartment: (department) =>
    set({ selectedDepartment: department }),

  // Search
  setSearch: (search) => set({ search }),

  // Manage modal
  openManageModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        manageModal: { isOpen: true },
      },
    })),
  closeManageModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        manageModal: { isOpen: false },
      },
      search: "",
    })),

  // Form modal actions
  openCreateModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        formModal: { isOpen: true, mode: "create", department: null },
      },
    })),
  openEditModal: (department) =>
    set((state) => ({
      modals: {
        ...state.modals,
        formModal: { isOpen: true, mode: "edit", department },
      },
    })),
  closeFormModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        formModal: { isOpen: false, mode: "create", department: null },
      },
    })),

  // Delete modal actions
  openDeleteModal: (department) =>
    set((state) => ({
      modals: {
        ...state.modals,
        deleteModal: { isOpen: true, department },
      },
    })),
  closeDeleteModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        deleteModal: { isOpen: false, department: null },
      },
    })),

  // Reset
  reset: () =>
    set({
      departments: [],
      selectedDepartment: null,
      modals: { ...DEFAULT_MODAL_STATE },
      search: "",
    }),
}));
