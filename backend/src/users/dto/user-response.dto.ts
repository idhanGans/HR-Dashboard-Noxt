import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "User ID", example: "1" })
  id: string;

  @ApiProperty({ description: "User full name", example: "John Doe" })
  name: string;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiPropertyOptional({ description: "User age", example: 30 })
  age?: number;
}
