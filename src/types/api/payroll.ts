export type PayrollApiResponse = {
  id: number;
  userId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowance: number;
  bonuses: number;
  tax: number;
  insurance: number;
  pensionFund: number;
  otherDeductions: number;
  totalEarnings?: number;
  totalDeductions?: number;
  netPay?: number;
  createdAt: string;
  updatedAt: string;
};
