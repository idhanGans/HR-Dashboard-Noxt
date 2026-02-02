export type AttendanceApiUser = {
  id: number;
  fullName: string;
  email: string;
};

export type AttendanceApiRecord = {
  id: number;
  userId: number;
  checkInAt: string;
  checkOutAt?: string | null;
  checkOutSource?: string;
  status?: "PRESENT" | "LATE" | "ABSENT";
  timezone?: string | null;
  user?: AttendanceApiUser;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedAttendanceRecordsResponse = {
  data: AttendanceApiRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
