interface LoadingSkeletonProps {
  /** Number of skeleton rows to show */
  rows?: number;
}

/**
 * LoadingSkeleton - Full-page loading skeleton for KPI tracker
 */
export const LoadingSkeleton = ({ rows = 5 }: LoadingSkeletonProps) => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Period Banner skeleton */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="h-5 bg-white/10 rounded w-48" />
      </div>

      {/* Stat card skeleton */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-40" />
            <div className="h-12 bg-white/10 rounded w-20" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
          <div className="bg-white/10 p-6 rounded-lg w-20 h-20" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="glass-card">
        <div className="flex gap-4">
          <div className="h-10 bg-white/5 rounded-xl flex-1 max-w-xs" />
          <div className="h-10 bg-white/5 rounded-lg w-48" />
          <div className="h-10 bg-white/5 rounded-lg w-48" />
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="glass-card">
        <div className="h-5 bg-white/10 rounded w-40 mb-4" />
        <div className="h-72 bg-white/5 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="glass-card">
        <div className="h-5 bg-white/10 rounded w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 bg-white/5 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
