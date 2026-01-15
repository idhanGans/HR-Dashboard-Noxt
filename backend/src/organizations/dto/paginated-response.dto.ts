import { ApiProperty } from "@nestjs/swagger";
import { OrganizationResponseDto } from "./organization-response.dto";

export class PaginatedOrganizationsResponseDto {
  @ApiProperty({
    description: "List of organizations",
    type: [OrganizationResponseDto],
  })
  data: OrganizationResponseDto[];

  @ApiProperty({ description: "Total number of items", example: 50 })
  total: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number;

  @ApiProperty({ description: "Number of items per page", example: 10 })
  limit: number;

  @ApiProperty({ description: "Total number of pages", example: 5 })
  totalPages: number;
}
