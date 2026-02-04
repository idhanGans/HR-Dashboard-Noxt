import { Card } from "../Card";
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MonthlyBreakdown {
  month: string;
  period: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalRecords: number;
  attendanceRate: number;
}

interface GroupedSummary {
  employeeName: string;
  employeeId: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalLateDays: number;
  totalRecords: number;
  overallAttendanceRate: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

interface AttendanceGroupedSummaryProps {
  summaries: GroupedSummary[];
}

/**
 * AttendanceGroupedSummary - Display attendance summaries grouped by employee
 * Shows overall stats with expandable monthly breakdown
 * Used when viewing "All Records" to avoid listing hundreds of individual entries
 */
export const AttendanceGroupedSummary = ({
  summaries,
}: AttendanceGroupedSummaryProps) => {
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set());

  const toggleExpand = (employeeId: number) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  if (summaries.length === 0) {
    return (
      <Card>
        <p className="text-gray-400 text-center py-8">
          No attendance records found
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {summaries.map((summary) => {
        const isExpanded = expandedEmployees.has(summary.employeeId);
        
        return (
          <Card key={summary.employeeId}>
            {/* Main Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {summary.employeeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">
                    {summary.employeeName}
                  </h4>
                  <div className="flex items-center gap-2 text-lightGrey text-sm">
                    <Calendar size={14} />
                    <span>{summary.monthlyBreakdown.length} month{summary.monthlyBreakdown.length !== 1 ? 's' : ''} tracked</span>
                  </div>
                </div>
              </div>

              {/* Overall Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {/* Present Days */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-2xl font-bold text-white">
                      {summary.totalPresentDays}
                    </span>
                  </div>
                  <p className="text-xs text-lightGrey">Present</p>
                </div>

                {/* Late Days */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-2xl font-bold text-white">
                      {summary.totalLateDays}
                    </span>
                  </div>
                  <p className="text-xs text-lightGrey">Late</p>
                </div>

                {/* Absent Days */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-2xl font-bold text-white">
                      {summary.totalAbsentDays}
                    </span>
                  </div>
                  <p className="text-xs text-lightGrey">Absent</p>
                </div>

                {/* Attendance Rate */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp size={16} className="text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {summary.overallAttendanceRate}%
                    </span>
                  </div>
                  <p className="text-xs text-lightGrey">Rate</p>
                </div>
              </div>
            </div>

            {/* Total Records and Expand Button */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-lightGrey">
                Total Records: {summary.totalRecords} days tracked
              </p>
              {summary.monthlyBreakdown.length > 1 && (
                <button
                  onClick={() => toggleExpand(summary.employeeId)}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{isExpanded ? 'Hide' : 'Show'} Monthly Breakdown</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {/* Monthly Breakdown (Expandable) */}
            {isExpanded && summary.monthlyBreakdown.length > 1 && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <h5 className="text-sm font-semibold text-white mb-3">Monthly Breakdown</h5>
                {summary.monthlyBreakdown.map((monthData, idx) => (
                  <div
                    key={`${summary.employeeId}-${monthData.period}-${idx}`}
                    className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 text-lightGrey text-sm">
                      <Calendar size={14} />
                      <span className="text-white font-medium">{monthData.month}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          {monthData.presentDays}
                        </div>
                        <p className="text-xs text-lightGrey">Present</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {monthData.lateDays}
                        </div>
                        <p className="text-xs text-lightGrey">Late</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">
                          {monthData.absentDays}
                        </div>
                        <p className="text-xs text-lightGrey">Absent</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          {monthData.attendanceRate}%
                        </div>
                        <p className="text-xs text-lightGrey">Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
