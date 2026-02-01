import { useQuery } from "@tanstack/react-query";
import { leaveService } from "../services/leave";
import type { LeaveEntitlementApi } from "../types/api";

const leaveKeys = {
  all: ["leave"] as const,
  entitlements: () => [...leaveKeys.all, "entitlements"] as const,
};

export const useLeaveEntitlements = () => {
  const entitlementsQuery = useQuery({
    queryKey: leaveKeys.entitlements(),
    queryFn: leaveService.getEntitlements,
  });

  return {
    entitlements: (entitlementsQuery.data ?? []) as LeaveEntitlementApi[],
    loading: entitlementsQuery.isLoading,
    error: entitlementsQuery.error?.message ?? null,
  };
};
