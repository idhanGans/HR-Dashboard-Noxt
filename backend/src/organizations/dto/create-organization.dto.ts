import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
  @ApiProperty({
    description: "Organization name",
    example: "Engineering Team",
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Supervisor/Manager User ID",
    example: 1,
  })
  @IsInt()
  supervisorId: number;
}
