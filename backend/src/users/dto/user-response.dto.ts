import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role, EmploymentType } from "./create-user.dto";

export class OrganizationBasicDto {
  @ApiProperty({ description: "Organization ID", example: 1 })
  id: number;

  @ApiProperty({
    description: "Organization name",
    example: "Engineering Team",
  })
  name: string;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;
}

export class UserResponseDto {
  @ApiProperty({ description: "User ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User's full name", example: "John Doe" })
  fullName: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+6281234567890",
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "Role name/job title",
    example: "Senior Developer",
  })
  roleName?: string;

  @ApiProperty({
    description: "User role permission",
    enum: Role,
    example: Role.EMPLOYEE,
  })
  role: Role;

  @ApiProperty({
    description: "Employment type",
    enum: EmploymentType,
    example: EmploymentType.PERMANENT,
  })
  employmentType: EmploymentType;

  @ApiPropertyOptional({ description: "Tax number", example: "123456789" })
  taxNumber?: string;

  @ApiPropertyOptional({
    description: "Indonesian NIK",
    example: "3201012345678901",
  })
  identityNumber?: string;

  @ApiPropertyOptional({
    description: "Employment start date",
    example: "2024-01-01T00:00:00Z",
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: "Employment leave date",
    example: "2024-12-31T00:00:00Z",
  })
  leaveDate?: Date;

  @ApiPropertyOptional({
    description: "Location",
    example: "Jakarta, Indonesia",
  })
  location?: string;

  @ApiPropertyOptional({
    description: "Bank account number",
    example: "1234567890",
  })
  bankNumber?: string;

  @ApiPropertyOptional({ description: "Bank name", example: "Bank Mandiri" })
  bankName?: string;

  @ApiPropertyOptional({
    description: "Bank account holder name",
    example: "John Doe",
  })
  bankAccountHolderName?: string;

  @ApiPropertyOptional({
    description: "Photo/avatar URL",
    example: "https://example.com/photo.jpg",
  })
  photoUrl?: string;

  @ApiPropertyOptional({ description: "Organization ID", example: 1 })
  organizationId?: number;

  @ApiPropertyOptional({
    description: "Organization details",
    type: OrganizationBasicDto,
  })
  organization?: OrganizationBasicDto;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;
}
