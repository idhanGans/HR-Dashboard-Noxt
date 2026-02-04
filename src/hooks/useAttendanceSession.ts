import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance";
import { attendanceKeys } from "./useAttendanceRecords";

export interface UseAttendanceSessionOptions {
  currentUserId?: number;
  initialCheckInAt?: number | null;
}

export const useAttendanceSession = (options?: UseAttendanceSessionOptions) => {
  const queryClient = useQueryClient();

  const currentUserId = options?.currentUserId;
  const initialCheckInAt = options?.initialCheckInAt ?? null;

  const [localOverride, setLocalOverride] = useState<number | "cleared" | null>(null);

  const checkInTime = useMemo(() => {
    if (localOverride === "cleared") return null;
    if (localOverride !== null) return localOverride;
    return initialCheckInAt;
  }, [localOverride, initialCheckInAt]);

  const prevInitialRef = useRef(initialCheckInAt);
  if (prevInitialRef.current !== initialCheckInAt) {
    prevInitialRef.current = initialCheckInAt;
    if (localOverride !== null) {
      setLocalOverride(null);
    }
  }

  const isCheckedIn = !!checkInTime;

  const [elapsedState, setElapsedState] = useState(0);

  useEffect(() => {
    if (!checkInTime) return;

    const updateElapsed = () => setElapsedState(Date.now() - checkInTime);
    const initialId = setTimeout(updateElapsed, 0);
    const intervalId = setInterval(updateElapsed, 1000);

    return () => {
      clearTimeout(initialId);
      clearInterval(intervalId);
    };
  }, [checkInTime]);

  const elapsed = checkInTime ? elapsedState : 0;

  const checkInMutation = useMutation({
    mutationFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return attendanceService.checkIn(timezone ? { timezone } : undefined);
    },
    onSuccess: (data) => {
      const checkInDate = new Date(data.checkInAt);
      setLocalOverride(checkInDate.getTime());
      queryClient.invalidateQueries({ queryKey: attendanceKeys.records() });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => attendanceService.checkOut(),
    onSuccess: () => {
      setLocalOverride("cleared");
      queryClient.invalidateQueries({ queryKey: attendanceKeys.records() });
    },
  });

  const handleCheckIn = useCallback(async (): Promise<string | null> => {
    if (!currentUserId) {
      return "Unable to determine user for check-in.";
    }

    try {
      await checkInMutation.mutateAsync();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Check-in failed";
    }
  }, [currentUserId, checkInMutation]);

  const handleCheckOut = useCallback(async (): Promise<string | null> => {
    if (!currentUserId) {
      return "Unable to determine user for check-out.";
    }

    try {
      await checkOutMutation.mutateAsync();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Check-out failed";
    }
  }, [currentUserId, checkOutMutation]);

  return {
    checkInTime,
    elapsed,
    isCheckedIn,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    checkInError: checkInMutation.error?.message ?? null,
    checkOutError: checkOutMutation.error?.message ?? null,
    handleCheckIn,
    handleCheckOut,
  };
};
