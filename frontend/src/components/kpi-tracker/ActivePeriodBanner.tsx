interface ActivePeriodBannerProps {
  activePeriod: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
  isLoading: boolean;
}

/**
 * ActivePeriodBanner - Shows the active KPI period or a red alert if none exists
 */
export const ActivePeriodBanner = ({
  activePeriod,
  isLoading,
}: ActivePeriodBannerProps) => {
  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl animate-pulse">
        <div className="h-5 bg-white/10 rounded w-48" />
      </div>
    );
  }

  if (!activePeriod) {
    return (
      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-red-400 font-medium text-sm">
          No active period found
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <p className="text-green-400 font-medium text-sm">
            Active Period: {activePeriod.name}
          </p>
        </div>
        <p className="text-green-400/70 text-xs">
          {formatDate(activePeriod.startDate)} –{" "}
          {formatDate(activePeriod.endDate)}
        </p>
      </div>
    </div>
  );
};
