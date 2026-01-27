import { OmitType } from "@nestjs/swagger";
import { CreatePayrollDto } from "@/payroll/dto/create-payroll.dto";

export class UpsertPayrollDto extends OmitType(CreatePayrollDto, [
  "month",
  "year",
] as const) {}
