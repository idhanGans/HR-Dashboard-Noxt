import { PartialType } from "@nestjs/swagger";
import { CreatePayrollDto } from "@/payroll/dto/create-payroll.dto";

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {}
