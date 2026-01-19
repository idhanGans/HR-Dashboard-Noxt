import { IsInt, IsNumber, Min, Max, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateTargetDto {
  @ApiProperty({
    description: "Metric ID",
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  metricId: number;

  @ApiProperty({
    description: "Period ID",
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  periodId: number;

  @ApiProperty({
    description: "Target score (0-10, 1 decimal place)",
    example: 8.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  target: number;
}
