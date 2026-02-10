import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import {
  correlationStorage,
  generateCorrelationId,
  CorrelationStore,
} from "@/common/correlation/correlation-id.storage";

const CORRELATION_ID_HEADER = "x-correlation-id";
const REQUEST_ID_HEADER = "x-request-id";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Extract correlation ID from headers or generate a new one
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) ||
      (req.headers[REQUEST_ID_HEADER] as string) ||
      generateCorrelationId();

    // Set correlation ID in response header for traceability
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Store correlation ID in request for access in guards/interceptors
    (req as Request & { correlationId: string }).correlationId = correlationId;

    // Run the rest of the request within the AsyncLocalStorage context
    const store: CorrelationStore = { correlationId };
    correlationStorage.run(store, () => {
      next();
    });
  }
}
