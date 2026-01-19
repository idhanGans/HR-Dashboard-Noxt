import { ApiProperty } from "@nestjs/swagger";
import { ScoreResponseDto } from "./score-response.dto";

export class BulkScoreResponseDto {
  @ApiProperty({
    description: "List of created/updated scores",
    type: [ScoreResponseDto],
  })
  scores: ScoreResponseDto[];

  @ApiProperty({
    description: "Number of scores processed",
    example: 4,
  })
  count: number;
}
