import { Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import type { AttendanceSummary } from "../../utils/attendanceUtils";

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
}

/**
 * AttendanceSummaryCard - Display attendance summary statistics
 */
export const AttendanceSummaryCard = ({ summary }: AttendanceSummaryCardProps) => {
  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-400 bg-green-400/10";
    if (rate >= 85) return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10";
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Attendance Summary
          </h3>
          <p className="text-sm text-gray-400">
            {summary.employeeName} - {summary.period}
          </p>
        </div>
        <Calendar size={24} className="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Present Days */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-400" />
            <p className="text-sm text-gray-400">Present</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {summary.presentDays}
          </p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        {/* Absent Days */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-400" />
            <p className="text-sm text-gray-400">Absent</p>
          </div>
          <p className="text-2xl font-bold text-red-400">
            {summary.absentDays}
          </p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        {/* Late Days */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-400" />
            <p className="text-sm text-gray-400">Late</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {summary.lateDays}
          </p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        {/* Total Recorded Days */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-400" />
            <p className="text-sm text-gray-400">Total Recorded</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {summary.totalDays}
          </p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        {/* Expected Working Days */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-purple-400" />
            <p className="text-sm text-gray-400">Expected</p>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {summary.expectedWorkingDays}
          </p>
          <p className="text-xs text-gray-500 mt-1">working days</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-400">Attendance Rate</p>
          </div>
          <p className={`text-2xl font-bold ${getAttendanceRateColor(summary.attendanceRate)}`}>
            {summary.attendanceRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">of expected</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Days Missing</p>
            <p className="text-lg font-semibold text-orange-400">
              {summary.expectedWorkingDays - summary.totalDays}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Unrecorded Days</p>
            <p className="text-lg font-semibold text-gray-300">
              {summary.expectedWorkingDays - summary.presentDays - summary.absentDays}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Overall Status</p>
            <p className={`text-lg font-semibold ${
              summary.attendanceRate >= 85 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {summary.attendanceRate >= 95 ? 'Excellent' : summary.attendanceRate >= 85 ? 'Good' : 'Needs Attention'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AttendanceSummaryGridProps {
  summaries: AttendanceSummary[];
  isLoading?: boolean;
}

/**
 * AttendanceSummaryGrid - Display multiple employee summaries
 */
export const AttendanceSummaryGrid = ({
  summaries,
  isLoading = false,
}: AttendanceSummaryGridProps) => {
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
        <p className="text-gray-400">Loading attendance summaries...</p>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
        <p className="text-gray-400">No attendance records found for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {summaries.map((summary) => (
        <AttendanceSummaryCard key={summary.employeeId} summary={summary} />
      ))}
    </div>
  );
};
