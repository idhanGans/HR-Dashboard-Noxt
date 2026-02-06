import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CreateOrgChartNodeDto,
  UpdateOrgChartNodeDto,
  OrgChartNodeDto,
} from "@/org-chart/dto";
import type { Prisma } from "@prisma/client";

const orgChartNodeSelect = {
  id: true,
  name: true,
  position: true,
  parentId: true,
  user: {
    select: {
      id: true,
      fullName: true,
      position: true,
      photoUrl: true,
    },
  },
} as const;

type OrgChartNodeRecord = Prisma.OrgChartNodeGetPayload<{
  select: typeof orgChartNodeSelect;
}>;

@Injectable()
export class OrgChartService {
  constructor(private prisma: PrismaService) {}

  async getTree(): Promise<OrgChartNodeDto[]> {
    const nodes = (await this.prisma.orgChartNode.findMany({
      orderBy: { createdAt: "asc" },
      select: orgChartNodeSelect,
    })) as OrgChartNodeRecord[];

    const nodeMap = new Map<number, OrgChartNodeDto>();

    nodes.forEach((node) => {
      nodeMap.set(node.id, this.toDto(node));
    });

    const roots: OrgChartNodeDto[] = [];

    nodeMap.forEach((node) => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children = parent.children ?? [];
          parent.children.push(node);
          return;
        }
      }
      roots.push(node);
    });

    return roots;
  }

  async createNode(payload: CreateOrgChartNodeDto): Promise<OrgChartNodeDto> {
    if (payload.parentId) {
      const parent = await this.prisma.orgChartNode.findUnique({
        where: { id: payload.parentId },
        select: { id: true },
      });
      if (!parent) {
        throw new BadRequestException(
          `Parent node with ID ${payload.parentId} not found`,
        );
      }
    }

    if (payload.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID ${payload.userId} not found`,
        );
      }
    }

    const node = (await this.prisma.orgChartNode.create({
      data: {
        name: payload.name,
        position: payload.position ?? null,
        parentId: payload.parentId ?? null,
        userId: payload.userId ?? null,
      },
      select: orgChartNodeSelect,
    })) as OrgChartNodeRecord;

    return this.toDto(node);
  }

  async updateNode(
    id: number,
    payload: UpdateOrgChartNodeDto,
  ): Promise<OrgChartNodeDto> {
    const existing = await this.prisma.orgChartNode.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Org chart node with ID ${id} not found`);
    }

    if (payload.userId !== undefined && payload.userId !== null) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID ${payload.userId} not found`,
        );
      }
    }

    const updated = (await this.prisma.orgChartNode.update({
      where: { id },
      data: {
        name: payload.name ?? undefined,
        position:
          payload.position === undefined
            ? undefined
            : (payload.position ?? null),
        userId:
          payload.userId === undefined ? undefined : (payload.userId ?? null),
      },
      select: orgChartNodeSelect,
    })) as OrgChartNodeRecord;

    return this.toDto(updated);
  }

  async deleteNode(id: number): Promise<void> {
    const existing = await this.prisma.orgChartNode.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Org chart node with ID ${id} not found`);
    }

    await this.prisma.orgChartNode.delete({
      where: { id },
    });
  }

  private toDto(node: OrgChartNodeRecord): OrgChartNodeDto {
    return {
      id: node.id,
      name: node.name,
      position: node.position,
      parentId: node.parentId ?? null,
      user: node.user ?? null,
      children: [],
    };
  }
}
