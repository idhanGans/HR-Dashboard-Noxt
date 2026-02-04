export type PayrollUser = {
  id: number;
  fullName?: string;
  name?: string;
  email?: string;
  position?: string;
  role?: string;
  employmentType?: string;
  bankName?: string;
  bankNumber?: string;
  department?: string;
  organization?: { name?: string };
};

export type PayrollUsersResponse =
  | PayrollUser[]
  | {
      data?: PayrollUser[];
      totalPages?: number;
    };

// User API types (matching backend DTOs)
export interface OrganizationBasic {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type TypeOfWork = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE";
export type Level = "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER" | "DIRECTOR";
export type Gender = "MALE" | "FEMALE";
export type WorkStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface UserApiResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  role: "SUPERADMIN" | "SUPERVISOR" | "EMPLOYEE";
  employmentType: "PERMANENT" | "TEMPORARY" | "FORMER";
  taxNumber?: string;
  identityNumber?: string;
  startDate?: string;
  leaveDate?: string;
  location?: string;
  bankNumber?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  photoUrl?: string;
  organizationId?: number;
  organization?: OrganizationBasic;
  nickname?: string;
  gender?: Gender;
  dateOfBirth?: string;
  typeOfWork?: TypeOfWork;
  workStatus?: WorkStatus;
  division?: string;
  level?: Level;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsersApiResponse {
  data: UserApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrganizationCount {
  name: string;
  count: number;
}

export interface EmployeeStatisticsApiResponse {
  total: number;
  permanent: number;
  temporary: number;
  former: number;
  byOrganization: OrganizationCount[];
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  position?: string;
  role: "SUPERADMIN" | "SUPERVISOR" | "EMPLOYEE";
  employmentType: "PERMANENT" | "TEMPORARY" | "FORMER";
  taxNumber?: string;
  identityNumber?: string;
  startDate?: string;
  leaveDate?: string;
  location?: string;
  bankNumber?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  photoUrl?: string;
  organizationId?: number;
  nickname?: string;
  gender?: Gender;
  dateOfBirth?: string;
  typeOfWork?: TypeOfWork;
  workStatus?: WorkStatus;
  division?: string;
  level?: Level;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  position?: string;
  role?: "SUPERADMIN" | "SUPERVISOR" | "EMPLOYEE";
  employmentType?: "PERMANENT" | "TEMPORARY" | "FORMER";
  taxNumber?: string;
  identityNumber?: string;
  startDate?: string;
  leaveDate?: string;
  location?: string;
  bankNumber?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  photoUrl?: string;
  organizationId?: number | null;
  nickname?: string;
  gender?: Gender;
  dateOfBirth?: string;
  typeOfWork?: TypeOfWork;
  workStatus?: WorkStatus;
  division?: string;
  level?: Level;
}
