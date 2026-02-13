import * as winston from "winston";
import { getCorrelationId } from "@/common/correlation";

// Keys that should be redacted from logs (case-insensitive matching)
const SENSITIVE_KEYS = [
  "password",
  "passwd",
  "pwd",
  "token",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "authorization",
  "cookie",
  "cookies",
  "session",
  "sessionid",
  "session_id",
  "api_key",
  "apikey",
  "secret",
  "credentials",
  "credit_card",
  "creditcard",
  "ssn",
  "social_security",
];

const REDACTED = "[REDACTED]";

function toSafeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value === null || value === undefined) return "";

  try {
    return JSON.stringify(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

/**
 * Recursively redact sensitive fields from an object
 */
function redactSensitiveData(obj: unknown, depth = 0): unknown {
  // Prevent infinite recursion
  if (depth > 10) return obj;

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  if (typeof obj === "object") {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        redacted[key] = REDACTED;
      } else if (typeof value === "object" && value !== null) {
        redacted[key] = redactSensitiveData(value, depth + 1);
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }

  return obj;
}

/**
 * Custom format to inject correlation ID into every log
 */
const correlationIdFormat = winston.format((info) => {
  const correlationId = getCorrelationId();
  if (correlationId) {
    info.correlation_id = correlationId;
  }
  return info;
});

/**
 * Custom format to redact sensitive data from logs
 * Note: We mutate in place to preserve Winston's internal Symbol properties
 * (Symbol(level), Symbol(message)) which colorizer and other formatters need
 */
const redactFormat = winston.format((info) => {
  for (const [key, value] of Object.entries(info)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
      info[key] = REDACTED;
    } else if (typeof value === "object" && value !== null) {
      info[key] = redactSensitiveData(value, 1);
    }
  }
  return info;
});

/**
 * Custom format to add service metadata
 */
const serviceFormat = winston.format((info) => {
  info.service = "hr-dashboard";
  return info;
});

/**
 * Create Winston configuration based on environment
 */
export function createWinstonConfig(
  nodeEnv: string,
  logLevel: string = "info",
): winston.LoggerOptions {
  const isDevelopment = nodeEnv === "development";

  // Base formats applied to all logs
  const baseFormats = [
    winston.format.timestamp({ format: "ISO" }),
    serviceFormat(),
    correlationIdFormat(),
    redactFormat(),
    winston.format.errors({ stack: true }),
  ];

  // Development: Human-readable format with colors
  if (isDevelopment) {
    return {
      level: logLevel,
      format: winston.format.combine(
        ...baseFormats,
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ timestamp, level, message, correlation_id, service, ...meta }) => {
            const correlationPart = correlation_id
              ? ` [${toSafeString(correlation_id)}]`
              : "";
            const metaStr =
              Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
            return `${toSafeString(timestamp)} [${toSafeString(service)}]${correlationPart} ${toSafeString(level)}: ${toSafeString(message)}${metaStr}`;
          },
        ),
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ["error"],
        }),
      ],
    };
  }

  // Production/Staging: JSON format to stdout
  return {
    level: logLevel,
    format: winston.format.combine(...baseFormats, winston.format.json()),
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error"],
      }),
    ],
  };
}

/**
 * Log levels following standard severity
 * NestJS levels mapped to Winston/standard levels
 */
export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
