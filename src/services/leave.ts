import { interceptedAxios, handleAxiosError } from "../lib/axios";
import { ATTENDANCE_LEAVES_ENTITLEMENTS } from "./endpoints";
import type { LeaveEntitlementApi } from "../types/api";

const createLeaveService = () => {
  const getEntitlements = async (): Promise<LeaveEntitlementApi[]> => {
    try {
      const response = await interceptedAxios.get<LeaveEntitlementApi[]>(
        ATTENDANCE_LEAVES_ENTITLEMENTS
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return {
    getEntitlements,
  };
};

const leaveService = createLeaveService();

export { leaveService };
