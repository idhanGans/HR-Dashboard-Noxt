import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "@/app.module";
import { EnvironmentVariables, NodeEnvironment } from "@/config";
import { LoggerService } from "@/common/logging";
import { HttpLoggingInterceptor } from "@/common/interceptors";
import { AllExceptionsFilter } from "@/common/filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Disable default logger, we'll replace it with Winston
    bufferLogs: true,
  });

  // Get services
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const loggerService = app.get(LoggerService);
  const winstonLogger = app.get<import("@nestjs/common").LoggerService>(
    WINSTON_MODULE_NEST_PROVIDER,
  );

  // Use Winston as the NestJS logger
  app.useLogger(winstonLogger);
  loggerService.setContext("Bootstrap");

  const port = configService.get("PORT", { infer: true });
  const nodeEnv = configService.get("NODE_ENV", { infer: true });

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Register global interceptors and filters
  app.useGlobalInterceptors(new HttpLoggingInterceptor(loggerService));
  app.useGlobalFilters(new AllExceptionsFilter(loggerService));

  // Swagger setup (only in non-production)
  const swaggerEnabled = nodeEnv !== NodeEnvironment.PRODUCTION;
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle("HR Dashboard API")
      .setDescription("API documentation for HR Dashboard")
      .setVersion("1.0")
      .addTag("hr")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(port);

  // Log startup configuration
  loggerService.logEvent(
    "application_startup",
    "Application started successfully",
    {
      environment: nodeEnv,
      port,
      node_version: process.version,
      cors_enabled: true,
      swagger_enabled: swaggerEnabled,
    },
  );
}
void bootstrap();
