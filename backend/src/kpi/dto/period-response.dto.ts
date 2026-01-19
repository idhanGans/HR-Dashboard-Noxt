import { ApiProperty } from "@nestjs/swagger";

export class PeriodResponseDto {
  @ApiProperty({ description: "Period ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Period name", example: "January 2024" })
  name: string;

  @ApiProperty({
    description: "Period start date",
    example: "2024-01-20T00:00:00Z",
  })
  startDate: Date;

  @ApiProperty({
    description: "Period end date",
    example: "2024-02-01T23:59:59Z",
  })
  endDate: Date;

  @ApiProperty({ description: "Whether the period is active", example: true })
  isActive: boolean;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;
}
