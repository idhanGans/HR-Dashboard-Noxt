import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrgChartService } from "@/org-chart/org-chart.service";
import {
  CreateOrgChartNodeDto,
  UpdateOrgChartNodeDto,
  OrgChartNodeDto,
} from "@/org-chart/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";

@ApiTags("org-chart")
@Controller("org-chart")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrgChartController {
  constructor(private readonly orgChartService: OrgChartService) {}

  @Get("tree")
  @ApiOperation({ summary: "Get org chart tree" })
  @ApiResponse({
    status: 200,
    description: "Returns org chart tree roots",
    type: OrgChartNodeDto,
    isArray: true,
  })
  async getTree(): Promise<OrgChartNodeDto[]> {
    return this.orgChartService.getTree();
  }

  @Post("nodes")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create org chart node" })
  @ApiResponse({
    status: 201,
    description: "Node created successfully",
    type: OrgChartNodeDto,
  })
  async createNode(
    @Body() payload: CreateOrgChartNodeDto,
  ): Promise<OrgChartNodeDto> {
    return this.orgChartService.createNode(payload);
  }

  @Put("nodes/:id")
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Update org chart node" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Node updated successfully",
    type: OrgChartNodeDto,
  })
  async updateNode(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: UpdateOrgChartNodeDto,
  ): Promise<OrgChartNodeDto> {
    return this.orgChartService.updateNode(id, payload);
  }

  @Delete("nodes/:id")
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete org chart node and descendants" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 204, description: "Node deleted" })
  async deleteNode(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.orgChartService.deleteNode(id);
  }
}
