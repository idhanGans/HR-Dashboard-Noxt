import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const omitConfig = {
  user: {
    password: true,
  },
} as const;

@Injectable()
export class PrismaService
  extends PrismaClient<{ omit: typeof omitConfig }>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ omit: omitConfig });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
