import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationQueryDto } from "@/common/dto";
import { EmploymentType } from "@/users/dto/create-user.dto";

export class UserPaginationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter by employment type",
    enum: EmploymentType,
    example: EmploymentType.PERMANENT,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;
}
