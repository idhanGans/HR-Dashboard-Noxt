import { interceptedAxios, handleAxiosError } from "../lib/axios";
import { DASHBOARD_OVERVIEW, PAYROLL_STATS_DEPARTMENT } from "./endpoints";
import type {
  DashboardOverviewResponseDto,
  DepartmentPayrollTotalDto,
} from "../types/api";
import type { PayrollByDepartment } from "../types";

export interface GetDashboardOverviewParams {
  timezone?: string;
  months?: number;
}

const createDashboardService = () => {
  const getOverview = async ({
    timezone,
    months,
  }: GetDashboardOverviewParams = {}): Promise<DashboardOverviewResponseDto> => {
    try {
      const params = new URLSearchParams();
      if (timezone) params.set("timezone", timezone);
      if (months) params.set("months", String(months));

      const path = params.toString()
        ? `${DASHBOARD_OVERVIEW}?${params.toString()}`
        : DASHBOARD_OVERVIEW;

      const response = await interceptedAxios.get<DashboardOverviewResponseDto>(
        path,
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getPayrollByDepartment = async (): Promise<PayrollByDepartment> => {
    try {
      const response = await interceptedAxios.get<DepartmentPayrollTotalDto[]>(
        PAYROLL_STATS_DEPARTMENT,
      );

      return {
        labels: response.data.map((row) => row.organizationName),
        data: response.data.map((row) => row.totalNetPay),
      };
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return { getOverview, getPayrollByDepartment };
};

const dashboardService = createDashboardService();

export { dashboardService };

