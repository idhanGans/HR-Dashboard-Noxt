export const RecentApprovalsSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={`approvals-skeleton-${idx}`}
        className="pb-3 border-b border-white/10 last:border-b-0 animate-pulse"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-5 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-3 w-28 bg-white/10 rounded" />
        </div>
      </div>
    ))}
  </div>
);
