import { Card } from "../Card";

interface AttendanceGroupedSummarySkeletonProps {
  rows?: number;
}

export const AttendanceGroupedSummarySkeleton = ({
  rows = 3,
}: AttendanceGroupedSummarySkeletonProps) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: rows }).map((_, idx) => (
      <Card key={`grouped-summary-skeleton-${idx}`}>
        {/* Main Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div>
              {/* Name placeholder */}
              <div className="h-5 w-32 bg-white/10 rounded mb-2" />
              {/* Months tracked placeholder */}
              <div className="h-4 w-24 bg-white/10 rounded" />
            </div>
          </div>

          {/* Overall Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* Present Days */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-4 h-4 bg-white/10 rounded" />
                <div className="h-7 w-8 bg-white/10 rounded" />
              </div>
              <div className="h-3 w-12 bg-white/10 rounded mx-auto" />
            </div>

            {/* Late Days */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-4 h-4 bg-white/10 rounded" />
                <div className="h-7 w-8 bg-white/10 rounded" />
              </div>
              <div className="h-3 w-10 bg-white/10 rounded mx-auto" />
            </div>

            {/* Absent Days */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-4 h-4 bg-white/10 rounded" />
                <div className="h-7 w-8 bg-white/10 rounded" />
              </div>
              <div className="h-3 w-12 bg-white/10 rounded mx-auto" />
            </div>

            {/* Attendance Rate */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-4 h-4 bg-white/10 rounded" />
                <div className="h-7 w-12 bg-white/10 rounded" />
              </div>
              <div className="h-3 w-8 bg-white/10 rounded mx-auto" />
            </div>
          </div>
        </div>

        {/* Total Records and Expand Button */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="h-4 w-40 bg-white/10 rounded" />
          <div className="h-4 w-36 bg-white/10 rounded" />
        </div>
      </Card>
    ))}
  </div>
);
