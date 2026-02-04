import { Card } from "../Card";

export const LeaveBalanceGridSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {Array.from({ length: count }).map((_, idx) => (
      <Card key={`leave-balance-skeleton-${idx}`} className="animate-pulse">
        <div className="mb-4">
          <div className="h-4 w-32 bg-white/10 rounded mb-2" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-3 w-12 bg-white/10 rounded" />
            </div>
            <div className="w-full bg-white/10 rounded-full h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-3 w-12 bg-white/10 rounded" />
            </div>
            <div className="w-full bg-white/10 rounded-full h-2" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);
