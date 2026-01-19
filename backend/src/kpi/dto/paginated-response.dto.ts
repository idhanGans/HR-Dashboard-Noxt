import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@/common/dto";
import { MetricResponseDto } from "./metric-response.dto";
import { PeriodResponseDto } from "./period-response.dto";
import { TargetResponseDto } from "./target-response.dto";
import { ScoreResponseDto } from "./score-response.dto";

export class PaginatedMetricsResponseDto extends PaginatedResponseDto<MetricResponseDto> {
  @ApiProperty({ description: "List of metrics", type: [MetricResponseDto] })
  declare data: MetricResponseDto[];
}

export class PaginatedPeriodsResponseDto extends PaginatedResponseDto<PeriodResponseDto> {
  @ApiProperty({ description: "List of periods", type: [PeriodResponseDto] })
  declare data: PeriodResponseDto[];
}

export class PaginatedTargetsResponseDto extends PaginatedResponseDto<TargetResponseDto> {
  @ApiProperty({ description: "List of targets", type: [TargetResponseDto] })
  declare data: TargetResponseDto[];
}

export class PaginatedScoresResponseDto extends PaginatedResponseDto<ScoreResponseDto> {
  @ApiProperty({ description: "List of scores", type: [ScoreResponseDto] })
  declare data: ScoreResponseDto[];
}
