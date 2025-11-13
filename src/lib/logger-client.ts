"use client";

import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const otelLogger = logs.getLogger("nextjs-pinball-stats-client");

/**
 * Simple client-side logger with convenience methods
 */
export const logger = {
  info(
    message: string,
    attributes?: Record<string, string | number | boolean>
  ) {
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: "INFO",
      body: message,
      attributes,
    });
  },

  error(
    message: string,
    error?: Error,
    attributes?: Record<string, string | number | boolean>
  ) {
    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: "ERROR",
      body: message,
      attributes: {
        ...attributes,
        ...(error && {
          "error.message": error.message,
          "error.stack": error.stack,
          "error.name": error.name,
        }),
      },
    });
  },

  debug(
    message: string,
    attributes?: Record<string, string | number | boolean>
  ) {
    otelLogger.emit({
      severityNumber: SeverityNumber.DEBUG,
      severityText: "DEBUG",
      body: message,
      attributes,
    });
  },

  // Convenience methods for common client-side events
  userAction(
    action: string,
    attributes?: Record<string, string | number | boolean>
  ) {
    logger.info(`User action: ${action}`, {
      ...attributes,
      eventType: "user_interaction",
      action,
    });
  },

  pageView(
    path: string,
    attributes?: Record<string, string | number | boolean>
  ) {
    logger.info(`Page view: ${path}`, {
      ...attributes,
      eventType: "page_view",
      path,
    });
  },
};
