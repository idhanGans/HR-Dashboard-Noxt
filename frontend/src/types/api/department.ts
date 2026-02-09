// ============ Department API Types ============
// Maps to backend Organization entity

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface DepartmentMember {
  id: number;
  fullName: string;
  email: string;
  position?: string;
  role: "SUPERADMIN" | "SUPERVISOR" | "EMPLOYEE";
  employmentType: "PERMANENT" | "TEMPORARY" | "FORMER";
}

export interface DepartmentSupervisor {
  id: number;
  fullName: string;
  email: string;
  position?: string;
  role: "SUPERADMIN" | "SUPERVISOR" | "EMPLOYEE";
}

export interface DepartmentApiResponse {
  id: number;
  name: string;
  supervisorId: number;
  supervisor: DepartmentSupervisor;
  members: DepartmentMember[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDepartmentsApiResponse {
  data: DepartmentApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDepartmentRequest {
  name: string;
  supervisorId: number;
}

export interface UpdateDepartmentRequest {
  name?: string;
  supervisorId?: number;
}

// Frontend Department model
export interface Department {
  id: number;
  name: string;
  description: string;
  supervisorId: number;
  supervisorName: string;
  memberCount: number;
  status: DepartmentStatus;
  createdAt: string;
  updatedAt: string;
}
