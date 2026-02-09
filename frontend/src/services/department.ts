import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_CREATE,
  ORGANIZATIONS_UPDATE,
  ORGANIZATIONS_DELETE,
  ORGANIZATIONS_BY_ID,
} from "./endpoints";
import type {
  DepartmentApiResponse,
  PaginatedDepartmentsApiResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/api";

export interface GetDepartmentsParams {
  search?: string;
  page?: number;
  limit?: number;
}

const createDepartmentService = () => {
  // ============ Get All Departments ============
  const getDepartments = async ({
    search,
    page = 1,
    limit = 100,
  }: GetDepartmentsParams = {}): Promise<PaginatedDepartmentsApiResponse> => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));

      if (search) {
        params.append("search", search);
      }

      const response =
        await interceptedAxios.get<PaginatedDepartmentsApiResponse>(
          `${ORGANIZATIONS_LIST}?${params.toString()}`,
        );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Get Department by ID ============
  const getDepartmentById = async (
    id: number,
  ): Promise<DepartmentApiResponse> => {
    try {
      const endpoint = ORGANIZATIONS_BY_ID.replace(":id", String(id));
      const response =
        await interceptedAxios.get<DepartmentApiResponse>(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Create Department ============
  const createDepartment = async (
    data: CreateDepartmentRequest,
  ): Promise<DepartmentApiResponse> => {
    try {
      const response = await interceptedAxios.post<DepartmentApiResponse>(
        ORGANIZATIONS_CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Update Department ============
  const updateDepartment = async (
    id: number,
    data: UpdateDepartmentRequest,
  ): Promise<DepartmentApiResponse> => {
    try {
      const endpoint = ORGANIZATIONS_UPDATE.replace(":id", String(id));
      const response = await interceptedAxios.put<DepartmentApiResponse>(
        endpoint,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Delete Department ============
  const deleteDepartment = async (id: number): Promise<void> => {
    try {
      const endpoint = ORGANIZATIONS_DELETE.replace(":id", String(id));
      await interceptedAxios.delete(endpoint);
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};

const departmentService = createDepartmentService();

export { departmentService };
