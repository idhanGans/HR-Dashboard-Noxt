import { IsNumber, Min, Max, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UpdateTargetDto {
  @ApiPropertyOptional({
    description: "Target score (0-10, 1 decimal place)",
    example: 8.5,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(0)
  @Max(10)
  target?: number;
}
