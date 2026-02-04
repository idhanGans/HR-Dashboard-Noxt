import type { AttendanceRecord } from "../types";

export interface AttendanceSummary {
  period: string; // "2025-01" for monthly, "2025" for yearly
  employeeName: string;
  employeeId?: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalDays: number;
  expectedWorkingDays: number;
  attendanceRate: number; // percentage
  records: AttendanceRecord[];
}

/**
 * Calculate working days in a month (excluding weekends)
 * @param year - Year (e.g., 2025)
 * @param month - Month (1-12)
 * @returns Number of working days (Mon-Fri)
 */
export function getWorkingDaysInMonth(year: number, month: number): number {
  let workingDays = 0;
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}

/**
 * Get year working days (Mon-Fri, excluding weekends)
 * @param year - Year (e.g., 2025)
 * @returns Number of working days in the year
 */
export function getWorkingDaysInYear(year: number): number {
  let workingDays = 0;
  for (let month = 1; month <= 12; month++) {
    workingDays += getWorkingDaysInMonth(year, month);
  }
  return workingDays;
}

/**
 * Group attendance records by employee and month
 * @param records - Array of attendance records
 * @returns Map of "YYYY-MM-employeeId" to array of records
 */
export function groupAttendanceByEmployeeAndMonth(
  records: AttendanceRecord[],
): Map<string, AttendanceRecord[]> {
  const grouped = new Map<string, AttendanceRecord[]>();

  records.forEach((record) => {
    // Parse DD-MM-YYYY format
    const [day, month, year] = record.date.split("-");
    const key = `${year}-${month}-${record.employeeId || "unassigned"}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  });

  return grouped;
}

/**
 * Calculate attendance summary for a specific employee and month
 * @param records - Array of attendance records
 * @param employeeId - Employee ID to filter by
 * @param year - Year (e.g., 2025)
 * @param month - Month (1-12)
 * @returns AttendanceSummary object
 */
export function calculateMonthlySummary(
  records: AttendanceRecord[],
  employeeId: number,
  year: number,
  month: number,
): AttendanceSummary {
  const monthStr = String(month).padStart(2, "0");
  const periodStr = `${monthStr}-${year}`;

  const filtered = records.filter((r) => {
    // Parse DD-MM-YYYY format
    const [day, recordMonth, recordYear] = r.date.split("-");
    return (
      recordYear === String(year) &&
      recordMonth === monthStr &&
      r.employeeId === employeeId
    );
  });

  const employeeName =
    filtered.length > 0 ? filtered[0].employeeName || "Unknown" : "Unknown";

  const presentDays = filtered.filter((r) => r.status === "present").length;
  const absentDays = filtered.filter((r) => r.status === "absent").length;
  const lateDays = filtered.filter((r) => r.status === "late").length;
  const totalDays = filtered.length;

  const expectedWorkingDays = getWorkingDaysInMonth(year, month);
  const attendanceRate =
    expectedWorkingDays > 0
      ? Math.round((presentDays / expectedWorkingDays) * 100)
      : 0;

  return {
    period: periodStr,
    employeeName,
    employeeId,
    presentDays,
    absentDays,
    lateDays,
    totalDays,
    expectedWorkingDays,
    attendanceRate,
    records: filtered,
  };
}

/**
 * Calculate attendance summary for a specific employee and year
 * @param records - Array of attendance records
 * @param employeeId - Employee ID to filter by
 * @param year - Year (e.g., 2025)
 * @returns AttendanceSummary object
 */
export function calculateYearlySummary(
  records: AttendanceRecord[],
  employeeId: number,
  year: number,
): AttendanceSummary {
  const filtered = records.filter((r) => {
    // Parse DD-MM-YYYY format
    const [day, month, recordYear] = r.date.split("-");
    return recordYear === String(year) && r.employeeId === employeeId;
  });

  const employeeName =
    filtered.length > 0 ? filtered[0].employeeName || "Unknown" : "Unknown";

  const presentDays = filtered.filter((r) => r.status === "present").length;
  const absentDays = filtered.filter((r) => r.status === "absent").length;
  const lateDays = filtered.filter((r) => r.status === "late").length;
  const totalDays = filtered.length;

  const expectedWorkingDays = getWorkingDaysInYear(year);
  const attendanceRate =
    expectedWorkingDays > 0
      ? Math.round((presentDays / expectedWorkingDays) * 100)
      : 0;

  return {
    period: String(year),
    employeeName,
    employeeId,
    presentDays,
    absentDays,
    lateDays,
    totalDays,
    expectedWorkingDays,
    attendanceRate,
    records: filtered,
  };
}

/**
 * Calculate attendance summaries for all employees for a specific month
 * @param records - Array of attendance records
 * @param year - Year (e.g., 2025)
 * @param month - Month (1-12)
 * @returns Array of AttendanceSummary objects
 */
export function calculateMonthlyAllEmployeesSummary(
  records: AttendanceRecord[],
  year: number,
  month: number,
): AttendanceSummary[] {
  const monthStr = String(month).padStart(2, "0");
  const periodStr = `${monthStr}-${year}`;

  const filtered = records.filter((r) => {
    // Parse DD-MM-YYYY format
    const [day, recordMonth, recordYear] = r.date.split("-");
    return recordYear === String(year) && recordMonth === monthStr;
  });

  // Group by employee
  const groupedByEmployee = new Map<
    number | undefined,
    AttendanceRecord[]
  >();
  filtered.forEach((record) => {
    const empId = record.employeeId;
    if (!groupedByEmployee.has(empId)) {
      groupedByEmployee.set(empId, []);
    }
    groupedByEmployee.get(empId)!.push(record);
  });

  // Calculate summary for each employee
  const summaries: AttendanceSummary[] = [];
  groupedByEmployee.forEach((empRecords, empId) => {
    const employeeName =
      empRecords.length > 0 ? empRecords[0].employeeName || "Unknown" : "Unknown";

    const presentDays = empRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absentDays = empRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const lateDays = empRecords.filter((r) => r.status === "late").length;
    const totalDays = empRecords.length;

    const expectedWorkingDays = getWorkingDaysInMonth(year, month);
    const attendanceRate =
      expectedWorkingDays > 0
        ? Math.round((presentDays / expectedWorkingDays) * 100)
        : 0;

    summaries.push({
      period: periodStr,
      employeeName,
      employeeId: empId,
      presentDays,
      absentDays,
      lateDays,
      totalDays,
      expectedWorkingDays,
      attendanceRate,
      records: empRecords,
    });
  });

  return summaries.sort((a, b) =>
    a.employeeName.localeCompare(b.employeeName),
  );
}
