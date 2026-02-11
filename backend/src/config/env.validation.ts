import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";

export enum NodeEnvironment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  @IsOptional()
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEVELOPMENT;

  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_URL: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_DURATION: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_DURATION: string;

  // GCS Storage Configuration (required only in STAGING/PRODUCTION)
  // Uses Application Default Credentials (ADC) - no explicit credentials needed
  // In Cloud Run, ADC automatically uses the service account identity
  @ValidateIf(
    (o: EnvironmentVariables) => o.NODE_ENV !== NodeEnvironment.DEVELOPMENT,
  )
  @IsString()
  @IsNotEmpty()
  GCS_BUCKET_NAME?: string;

  @ValidateIf(
    (o: EnvironmentVariables) => o.NODE_ENV !== NodeEnvironment.DEVELOPMENT,
  )
  @IsString()
  @IsNotEmpty()
  SCHEDULER_TOKEN?: string;

  // Logging Configuration
  @IsString()
  @IsIn(["error", "warn", "info", "http", "verbose", "debug", "silly"])
  @IsOptional()
  LOG_LEVEL?: string = "info";

  @Transform(({ value }: { value: string }) =>
    value ? parseInt(value, 10) : undefined,
  )
  @IsNumber()
  @Min(0)
  @IsOptional()
  SLOW_QUERY_THRESHOLD_MS?: number = 1000;
}
