import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrgChartUserDto {
  @ApiProperty({ description: "User ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User full name", example: "Jane Doe" })
  fullName: string;

  @ApiPropertyOptional({
    description: "User position",
    example: "Engineering Manager",
  })
  position?: string | null;

  @ApiPropertyOptional({
    description: "User photo URL key",
    example: "user-avatar/1-1234567890.jpg",
  })
  photoUrl?: string | null;
}

export class OrgChartNodeDto {
  @ApiProperty({ description: "Node ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Node display name", example: "Jane Doe" })
  name: string;

  @ApiPropertyOptional({
    description: "Node position override",
    example: "Head of Engineering",
  })
  position?: string | null;

  @ApiPropertyOptional({ description: "Parent node ID", example: 2 })
  parentId?: number | null;

  @ApiPropertyOptional({
    description: "Linked user details (optional)",
    type: OrgChartUserDto,
  })
  user?: OrgChartUserDto | null;

  @ApiPropertyOptional({
    description: "Child nodes",
    type: OrgChartNodeDto,
    isArray: true,
  })
  children?: OrgChartNodeDto[];
}
