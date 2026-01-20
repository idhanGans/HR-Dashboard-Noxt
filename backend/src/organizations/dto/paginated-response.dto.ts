import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@/common/dto";
import { OrganizationResponseDto } from "@/organizations/dto/organization-response.dto";

export class PaginatedOrganizationsResponseDto extends PaginatedResponseDto<OrganizationResponseDto> {
  @ApiProperty({
    description: "List of organizations",
    type: [OrganizationResponseDto],
  })
  declare data: OrganizationResponseDto[];
}
