import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCheckInDto {
  @ApiPropertyOptional({
    description: "Client IANA timezone (e.g., Asia/Jakarta)",
    example: "Asia/Jakarta",
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
