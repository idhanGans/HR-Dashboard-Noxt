import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateOrgChartNodeDto {
  @ApiPropertyOptional({
    description: "Updated display name",
    example: "Jane Doe",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Updated position override",
    example: "Head of Engineering",
  })
  @IsOptional()
  @IsString()
  position?: string | null;

  @ApiPropertyOptional({
    description: "Linked user ID (optional)",
    example: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;
}
