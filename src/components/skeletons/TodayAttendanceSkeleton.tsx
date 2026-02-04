import { Calendar } from "lucide-react";

export const TodayAttendanceSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Calendar size={20} className="text-green-400" />
      <h3 className="text-lg font-semibold text-white">Today's Attendance</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={`today-attendance-skeleton-${idx}`}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="h-3 w-20 bg-white/10 rounded mb-3" />
          <div className="h-5 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  </div>
);
