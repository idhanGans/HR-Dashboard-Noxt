export type PayrollUser = {
  id: number;
  fullName?: string;
  name?: string;
  email?: string;
  roleName?: string;
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
