import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsDateString,
  MinLength,
  Min,
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

export enum TypeOfWork {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
}

export enum Level {
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
  MANAGER = "MANAGER",
  DIRECTOR = "DIRECTOR",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum WorkStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
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
    description: "Position/job title",
    example: "Senior Developer",
  })
  @IsOptional()
  @IsString()
  position?: string;

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
    description: "Extra paid leave days per year",
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  extraPaidLeaveDays?: number;

  @ApiPropertyOptional({
    description: "Organization ID",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @ApiPropertyOptional({
    description: "Nickname",
    example: "Johnny",
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    description: "Gender",
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: "Date of birth",
    example: "1990-01-15T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: "Type of work",
    enum: TypeOfWork,
    example: TypeOfWork.FULL_TIME,
  })
  @IsOptional()
  @IsEnum(TypeOfWork)
  typeOfWork?: TypeOfWork;

  @ApiPropertyOptional({
    description: "Work status",
    enum: WorkStatus,
    example: WorkStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(WorkStatus)
  workStatus?: WorkStatus;

  @ApiPropertyOptional({
    description: "Division",
    example: "Engineering",
  })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiPropertyOptional({
    description: "Level",
    enum: Level,
    example: Level.SENIOR,
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;
}
