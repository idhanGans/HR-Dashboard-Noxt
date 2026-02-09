import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../services/department";
import { mapApiToDepartment } from "../stores/departmentStore";
import type {
  Department,
  DepartmentApiResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/api";

// ============ Query Key Factory ============

interface DepartmentFilters {
  search?: string;
}

const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters: DepartmentFilters) =>
    [...departmentKeys.lists(), filters] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
};

// Also invalidate employee queries when departments change
const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  statistics: () => [...employeeKeys.all, "statistics"] as const,
};

// ============ Hooks ============

/**
 * useDepartments - Fetch all departments
 * Automatically maps API response to frontend Department model
 */
export const useDepartments = (filters: DepartmentFilters = {}) => {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: () => departmentService.getDepartments({ search: filters.search }),
    select: (data): Department[] => data.data.map(mapApiToDepartment),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * useDepartmentById - Fetch a single department by ID
 */
export const useDepartmentById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getDepartmentById(id),
    select: (data: DepartmentApiResponse): Department =>
      mapApiToDepartment(data),
    enabled,
  });
};

/**
 * useCreateDepartment - Create a new department with optimistic updates
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      departmentService.createDepartment(data),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: departmentKeys.lists(),
      });

      // Snapshot previous data
      const previousDepartments = queryClient.getQueryData(
        departmentKeys.lists(),
      );

      return { previousDepartments };
    },
    onError: (_err, _newDepartment, context) => {
      // Rollback on error
      if (context?.previousDepartments) {
        queryClient.setQueryData(
          departmentKeys.lists(),
          context.previousDepartments,
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.statistics(),
      });
    },
  });
};

/**
 * useUpdateDepartment - Update an existing department with optimistic updates
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDepartmentRequest }) =>
      departmentService.updateDepartment(id, data),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: departmentKeys.lists(),
      });
      await queryClient.cancelQueries({
        queryKey: departmentKeys.detail(id),
      });

      const previousDepartments = queryClient.getQueryData(
        departmentKeys.lists(),
      );

      return { previousDepartments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(
          departmentKeys.lists(),
          context.previousDepartments,
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

/**
 * useDeleteDepartment - Delete a department with optimistic removal
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => departmentService.deleteDepartment(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: departmentKeys.lists(),
      });

      const previousDepartments = queryClient.getQueryData(
        departmentKeys.lists(),
      );

      return { previousDepartments };
    },
    onError: (_err, _id, context) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(
          departmentKeys.lists(),
          context.previousDepartments,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.statistics(),
      });
    },
  });
};
