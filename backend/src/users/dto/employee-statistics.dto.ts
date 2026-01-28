import { ApiProperty } from "@nestjs/swagger";

export class OrganizationCountDto {
  @ApiProperty({ description: "Organization name", example: "Engineering" })
  name: string;

  @ApiProperty({
    description: "Number of employees in this organization",
    example: 15,
  })
  count: number;
}

export class EmployeeStatisticsDto {
  @ApiProperty({ description: "Total number of employees", example: 50 })
  total: number;

  @ApiProperty({ description: "Number of permanent employees", example: 30 })
  permanent: number;

  @ApiProperty({ description: "Number of temporary employees", example: 15 })
  temporary: number;

  @ApiProperty({ description: "Number of former employees", example: 5 })
  former: number;

  @ApiProperty({
    description: "Employee count by organization",
    type: [OrganizationCountDto],
  })
  byOrganization: OrganizationCountDto[];
}
