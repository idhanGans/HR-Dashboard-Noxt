import { create } from "zustand";
import type { KPITrackerFilters, KPITableRow } from "../types/api/kpi-tracker";

// ============ Store Types ============

interface KPITrackerModalState {
  editModal: {
    isOpen: boolean;
    row: KPITableRow | null;
  };
  deleteModal: {
    isOpen: boolean;
    row: KPITableRow | null;
  };
}

interface KPITrackerState {
  // Filters
  filters: KPITrackerFilters;

  // Selected KPI row
  selectedKPI: KPITableRow | null;

  // Modal state
  modals: KPITrackerModalState;

  // Pagination
  page: number;
  limit: number;
}

interface KPITrackerActions {
  // Filter actions
  setSearch: (search: string) => void;
  setDepartmentId: (departmentId: string | null) => void;
  setPeriodId: (periodId: number | null) => void;
  resetFilters: () => void;

  // Selection
  setSelectedKPI: (kpi: KPITableRow | null) => void;

  // Modal actions
  openEditModal: (row: KPITableRow) => void;
  closeEditModal: () => void;
  openDeleteModal: (row: KPITableRow) => void;
  closeDeleteModal: () => void;

  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type KPITrackerStore = KPITrackerState & KPITrackerActions;

// ============ Default State ============

const DEFAULT_FILTERS: KPITrackerFilters = {
  search: "",
  departmentId: null,
  periodId: null,
};

const DEFAULT_MODAL_STATE: KPITrackerModalState = {
  editModal: { isOpen: false, row: null },
  deleteModal: { isOpen: false, row: null },
};

// ============ Store ============

export const useKPITrackerStore = create<KPITrackerStore>((set) => ({
  // Initial state
  filters: { ...DEFAULT_FILTERS },
  selectedKPI: null,
  modals: { ...DEFAULT_MODAL_STATE },
  page: 1,
  limit: 10,

  // Filter actions
  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
      page: 1, // Reset page on filter change
    })),

  setDepartmentId: (departmentId) =>
    set((state) => ({
      filters: { ...state.filters, departmentId },
      page: 1,
    })),

  setPeriodId: (periodId) =>
    set((state) => ({
      filters: { ...state.filters, periodId },
      page: 1,
    })),

  resetFilters: () =>
    set({
      filters: { ...DEFAULT_FILTERS },
      page: 1,
    }),

  // Selection
  setSelectedKPI: (kpi) => set({ selectedKPI: kpi }),

  // Modal actions
  openEditModal: (row) =>
    set({
      modals: {
        editModal: { isOpen: true, row },
        deleteModal: { isOpen: false, row: null },
      },
      selectedKPI: row,
    }),

  closeEditModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        editModal: { isOpen: false, row: null },
      },
      selectedKPI: null,
    })),

  openDeleteModal: (row) =>
    set({
      modals: {
        editModal: { isOpen: false, row: null },
        deleteModal: { isOpen: true, row },
      },
      selectedKPI: row,
    }),

  closeDeleteModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        deleteModal: { isOpen: false, row: null },
      },
      selectedKPI: null,
    })),

  // Pagination
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
}));
