import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const otelLogger = logs.getLogger("nextjs-pinball-stats");

/**
 * Simple logger wrapper with convenience methods
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
};
