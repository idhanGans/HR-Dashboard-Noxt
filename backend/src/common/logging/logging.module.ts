import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { createWinstonConfig } from "./winston.config";
import { LoggerService } from "./logger.service";
import { EnvironmentVariables } from "@/config";

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        const nodeEnv = configService.get("NODE_ENV", { infer: true });
        const logLevel =
          configService.get("LOG_LEVEL", { infer: true }) || "info";
        return createWinstonConfig(nodeEnv, logLevel);
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService, WinstonModule],
})
export class LoggingModule {}
