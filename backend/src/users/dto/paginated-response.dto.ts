import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@/common/dto";
import { UserResponseDto } from "@/users/dto/user-response.dto";

export class PaginatedUsersResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({
    description: "List of users",
    type: [UserResponseDto],
  })
  declare data: UserResponseDto[];
}
