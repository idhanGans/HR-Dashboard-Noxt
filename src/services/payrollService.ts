import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  PAYROLL_BY_PERIOD,
  PAYROLL_EMPLOYEE_LIST,
  PAYROLL_PAYSLIP,
  PAYROLL_UPDATE,
} from "./endpoints";
import type { PayrollApiResponse, PayrollUser, PayrollUsersResponse } from "../types/api";

export interface GetPayrollParams {
  userId: number;
  month: number;
  year: number;
}

export interface UpdatePayrollParams {
  userId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowance: number;
  bonuses: number;
  tax?: number;
  insurance?: number;
  pensionFund?: number;
  otherDeductions?: number;
}

export interface DownloadPayslipParams {
  userId: number;
  month: number;
  year: number;
  employeeName: string;
}

const EMPLOYEE_PAGE_SIZE = 50;

const getFilenameFromHeader = (header: string | null | undefined) => {
  if (!header) return null;
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(header);
  const value = match?.[1] ?? match?.[2];
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const sanitizeFilename = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]+/g, "_");

const buildPayslipFilename = (
  employeeName: string,
  month: number,
  year: number,
  contentDisposition: string | null | undefined
) => {
  const headerName = getFilenameFromHeader(contentDisposition);
  if (headerName) {
    const sanitized = sanitizeFilename(headerName);
    if (sanitized) return sanitized;
  }

  const safeName = sanitizeFilename(employeeName) || "employee";
  const monthLabel = String(month).padStart(2, "0");
  return `payslip_${safeName}_${year}_${monthLabel}.pdf`;
};

const extractUsers = (response: PayrollUsersResponse) => {
  if (Array.isArray(response)) {
    return { users: response, totalPages: 1 };
  }
  return {
    users: response.data ?? [],
    totalPages: response.totalPages ?? 1,
  };
};

const createPayrollService = () => {
  const getEmployees = async (): Promise<PayrollUser[]> => {
    try {
      const firstResponse = await interceptedAxios.get<PayrollUsersResponse>(
        `${PAYROLL_EMPLOYEE_LIST}?page=1&limit=${EMPLOYEE_PAGE_SIZE}`
      );
      const { users, totalPages } = extractUsers(firstResponse.data);

      let allUsers = users;
      if (totalPages > 1) {
        const pages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            interceptedAxios.get<PayrollUsersResponse>(
              `${PAYROLL_EMPLOYEE_LIST}?page=${index + 2}&limit=${EMPLOYEE_PAGE_SIZE}`
            )
          )
        );
        const rest = pages.flatMap((page) => extractUsers(page.data).users);
        allUsers = [...users, ...rest];
      }

      return allUsers;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const getPayroll = async ({
    userId,
    month,
    year,
  }: GetPayrollParams): Promise<PayrollApiResponse | null> => {
    try {
      const path = `${PAYROLL_BY_PERIOD.replace(
        ":userId",
        String(userId)
      )}?month=${month}&year=${year}`;
      const response = await interceptedAxios.get<PayrollApiResponse | null>(path);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const updatePayroll = async ({
    userId,
    month,
    year,
    ...data
  }: UpdatePayrollParams): Promise<PayrollApiResponse> => {
    try {
      const path = `${PAYROLL_UPDATE.replace(":userId", String(userId))}`;
      const response = await interceptedAxios.put<PayrollApiResponse>(path, {
        month,
        year,
        ...data,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  const downloadPayslip = async ({
    userId,
    month,
    year,
    employeeName,
  }: DownloadPayslipParams): Promise<void> => {
    try {
      const path = `${PAYROLL_PAYSLIP.replace(
        ":userId",
        String(userId)
      )}?month=${month}&year=${year}`;

      const response = await interceptedAxios.get(path, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      });

      const blob = response.data as Blob;
      if (!blob.size) {
        throw new Error("Payslip file is empty");
      }

      const filename = buildPayslipFilename(
        employeeName,
        month,
        year,
        response.headers["content-disposition"]
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return {
    getEmployees,
    getPayroll,
    updatePayroll,
    downloadPayslip,
  };
};

const payrollService = createPayrollService();

export { payrollService };
