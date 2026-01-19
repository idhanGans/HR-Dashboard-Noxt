import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MetricResponseDto } from "./metric-response.dto";
import { PeriodResponseDto } from "./period-response.dto";
import { UserResponseDto } from "@/users/dto";

export class ScoreResponseDto {
  @ApiProperty({ description: "Score ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;

  @ApiProperty({ description: "Metric ID", example: 1 })
  metricId: number;

  @ApiProperty({ description: "ID of the user being scored", example: 5 })
  scoredUserId: number;

  @ApiProperty({ description: "ID of the user who scored", example: 2 })
  scorerId: number;

  @ApiProperty({ description: "Score value", example: 8.5 })
  score: number;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Period details",
    type: PeriodResponseDto,
  })
  period?: PeriodResponseDto;

  @ApiPropertyOptional({
    description: "Metric details",
    type: MetricResponseDto,
  })
  metric?: MetricResponseDto;

  @ApiPropertyOptional({
    description: "Scored user details",
    type: UserResponseDto,
  })
  scoredUser?: UserResponseDto;

  @ApiPropertyOptional({
    description: "Scorer user details",
    type: UserResponseDto,
  })
  scorer?: UserResponseDto;
}
