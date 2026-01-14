import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "User age",
    example: 30,
    minimum: 18,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;
}
