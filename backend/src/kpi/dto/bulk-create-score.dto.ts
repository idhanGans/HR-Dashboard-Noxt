import {
  IsInt,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class MetricScoreDto {
  @ApiProperty({
    description: "Metric ID",
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  metricId: number;

  @ApiProperty({
    description: "Score value (0-10, 1 decimal place)",
    example: 8.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  score: number;
}

export class BulkCreateScoreDto {
  @ApiProperty({
    description: "Period ID",
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  periodId: number;

  @ApiProperty({
    description: "ID of the user being scored",
    example: 5,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  scoredUserId: number;

  @ApiProperty({
    description: "Array of metric scores",
    type: [MetricScoreDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricScoreDto)
  @IsNotEmpty()
  scores: MetricScoreDto[];
}
