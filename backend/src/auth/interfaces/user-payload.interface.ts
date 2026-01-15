import { Role } from "@/users/dto";

export interface UserPayload {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleName?: string;
  role: Role;
  employmentType: string;
  taxNumber?: string;
  identityNumber?: string;
  startDate?: Date;
  leaveDate?: Date;
  location?: string;
  bankNumber?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  photoUrl?: string;
  organizationId?: number;
  createdAt: Date;
  updatedAt: Date;
}
