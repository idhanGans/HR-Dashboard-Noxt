import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  USERS_LIST,
  USERS_CREATE,
  USERS_UPDATE,
  USERS_STATISTICS,
} from "./endpoints";
import type {
  UserApiResponse,
  PaginatedUsersApiResponse,
  EmployeeStatisticsApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/api";

const EMPLOYEE_PAGE_SIZE = 50;

export interface GetEmployeesParams {
  search?: string;
  employmentType?: string;
}

const createEmployeeService = () => {
  // ============ Employee List ============
  const getEmployees = async ({
    search,
    employmentType,
  }: GetEmployeesParams = {}): Promise<UserApiResponse[]> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", String(EMPLOYEE_PAGE_SIZE));
  
      if (search) {
        params.append("search", search);
      }
  
      if (employmentType && employmentType !== "all") {
        params.append("employmentType", employmentType);
      }
  
      // Fetch first page
      const firstResponse = await interceptedAxios.get<PaginatedUsersApiResponse>(
        `${USERS_LIST}?${params.toString()}`
      );
      const { data: firstPageUsers, totalPages } = firstResponse.data;
  
      let allUsers = firstPageUsers;
  
      // Fetch remaining pages in parallel if there are more
      if (totalPages > 1) {
        const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) => {
          const pageParams = new URLSearchParams(params);
          pageParams.set("page", String(i + 2));
          return interceptedAxios.get<PaginatedUsersApiResponse>(
            `${USERS_LIST}?${pageParams.toString()}`
          );
        });
        const responses = await Promise.all(pagePromises);
        const additionalUsers = responses.flatMap((r) => r.data.data);
        allUsers = [...firstPageUsers, ...additionalUsers];
      }
  
      return allUsers;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Employee Statistics ============
  const getEmployeeStatistics = async (): Promise<EmployeeStatisticsApiResponse> => {
    try {
      const response =
        await interceptedAxios.get<EmployeeStatisticsApiResponse>(
          USERS_STATISTICS
        );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Create Employee ============
  const createEmployee = async (data: CreateUserRequest): Promise<UserApiResponse> => {
    try {
      const response = await interceptedAxios.post<UserApiResponse>(
        USERS_CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Update Employee ============
  const updateEmployee = async (
    id: number,
    data: UpdateUserRequest
  ): Promise<UserApiResponse> => {
    try {
      const endpoint = USERS_UPDATE.replace(":id", String(id));
      const response = await interceptedAxios.put<UserApiResponse>(
        endpoint,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  // ============ Mark Employee as Former ============
  const markEmployeeAsFormer = async (
    id: number
  ): Promise<UserApiResponse> => {
    try {
      const endpoint = USERS_UPDATE.replace(":id", String(id));
      const response = await interceptedAxios.put<UserApiResponse>(endpoint, {
        employmentType: "FORMER",
        leaveDate: new Date().toISOString(),
      } as UpdateUserRequest);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return { getEmployees, getEmployeeStatistics, createEmployee, updateEmployee, markEmployeeAsFormer };
}

const employeeService = createEmployeeService();

export { employeeService };