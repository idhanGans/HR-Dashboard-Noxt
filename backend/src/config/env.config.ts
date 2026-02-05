import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "@/config/env.validation";

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(", ")
          : "Unknown validation error";
        return `${error.property}: ${constraints}`;
      })
      .join("\n");

    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  return validatedConfig;
}
