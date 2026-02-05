import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
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
}
