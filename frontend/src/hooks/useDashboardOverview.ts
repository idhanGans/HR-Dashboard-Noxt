import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard";

const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (params: { months: number; timezone: string }) =>
    [...dashboardKeys.all, "overview", params] as const,
  payrollByDepartment: () => [...dashboardKeys.all, "payrollByDepartment"] as const,
};

export const useDashboardOverview = (options: {
  enabled: boolean;
  months?: number;
}) => {
  const months = options.months ?? 12;
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
    [],
  );

  const overviewQuery = useQuery({
    queryKey: dashboardKeys.overview({ months, timezone }),
    queryFn: () => dashboardService.getOverview({ months, timezone }),
    enabled: options.enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    timezone,
    ...overviewQuery,
  };
};

export const usePayrollByDepartment = (options: { enabled: boolean }) => {
  return useQuery({
    queryKey: dashboardKeys.payrollByDepartment(),
    queryFn: dashboardService.getPayrollByDepartment,
    enabled: options.enabled,
    staleTime: 5 * 60 * 1000,
  });
};

