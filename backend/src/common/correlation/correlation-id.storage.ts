import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

export interface CorrelationStore {
  correlationId: string;
  userId?: number;
  tenantId?: number;
}

export const correlationStorage = new AsyncLocalStorage<CorrelationStore>();

/**
 * Get the current correlation ID from AsyncLocalStorage
 * Returns undefined if not in a request context
 */
export function getCorrelationId(): string | undefined {
  return correlationStorage.getStore()?.correlationId;
}

/**
 * Get the current user ID from AsyncLocalStorage
 */
export function getCorrelationUserId(): number | undefined {
  return correlationStorage.getStore()?.userId;
}

/**
 * Get the current tenant ID from AsyncLocalStorage
 */
export function getCorrelationTenantId(): number | undefined {
  return correlationStorage.getStore()?.tenantId;
}

/**
 * Set user context in the correlation store
 */
export function setCorrelationUserContext(
  userId?: number,
  tenantId?: number,
): void {
  const store = correlationStorage.getStore();
  if (store) {
    store.userId = userId;
    store.tenantId = tenantId;
  }
}

/**
 * Generate a new correlation ID using UUID v4
 */
export function generateCorrelationId(): string {
  return randomUUID();
}

/**
 * Run a function within a correlation context
 */
export function runWithCorrelationId<T>(correlationId: string, fn: () => T): T {
  return correlationStorage.run({ correlationId }, fn);
}
