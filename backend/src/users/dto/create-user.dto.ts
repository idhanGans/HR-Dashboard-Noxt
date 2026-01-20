import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsDateString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  SUPERVISOR = "SUPERVISOR",
  EMPLOYEE = "EMPLOYEE",
}

export enum EmploymentType {
  PERMANENT = "PERMANENT",
  TEMPORARY = "TEMPORARY",
  FORMER = "FORMER",
}

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name",
    example: "John Doe",
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User's password",
    example: "SecurePassword123!",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+6281234567890",
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "Role name/job title",
    example: "Senior Developer",
  })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiProperty({
    description: "User role permission",
    enum: Role,
    example: Role.EMPLOYEE,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: "Employment type",
    enum: EmploymentType,
    example: EmploymentType.PERMANENT,
  })
  @IsEnum(EmploymentType)
  @IsNotEmpty()
  employmentType: EmploymentType;

  @ApiPropertyOptional({
    description: "Tax number",
    example: "123456789",
  })
  @IsOptional()
  @IsString()
  taxNumber?: string;

  @ApiPropertyOptional({
    description: "Indonesian NIK (Identity Number)",
    example: "3201012345678901",
  })
  @IsOptional()
  @IsString()
  identityNumber?: string;

  @ApiPropertyOptional({
    description: "Employment start date",
    example: "2024-01-01T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Employment leave date",
    example: "2024-12-31T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  leaveDate?: string;

  @ApiPropertyOptional({
    description: "Location",
    example: "Jakarta, Indonesia",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "Bank account number",
    example: "1234567890",
  })
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional({
    description: "Bank name",
    example: "Bank Mandiri",
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({
    description: "Bank account holder name",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  bankAccountHolderName?: string;

  @ApiPropertyOptional({
    description: "Photo/avatar URL",
    example: "https://example.com/photo.jpg",
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: "Organization ID",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  organizationId?: number;
}
