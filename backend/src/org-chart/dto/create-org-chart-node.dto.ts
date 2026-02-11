import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateOrgChartNodeDto {
  @ApiProperty({
    description: "Node display name",
    example: "Jane Doe",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: "Position override for the node",
    example: "Head of Engineering",
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: "Parent node ID (omit for root)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @ApiPropertyOptional({
    description: "Linked user ID (optional)",
    example: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;
}
