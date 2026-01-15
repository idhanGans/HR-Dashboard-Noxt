import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "@/users/dto/user-response.dto";

export class OrganizationResponseDto {
  @ApiProperty({ description: "Organization ID", example: 1 })
  id: number;

  @ApiProperty({
    description: "Organization name",
    example: "Engineering Team",
  })
  name: string;

  @ApiProperty({ description: "Supervisor User ID", example: 1 })
  supervisorId: number;

  @ApiProperty({ description: "Supervisor details", type: UserResponseDto })
  supervisor: UserResponseDto;

  @ApiProperty({ description: "Organization members", type: [UserResponseDto] })
  members: UserResponseDto[];

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;
}
