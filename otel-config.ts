/**
 * Shared OpenTelemetry configuration constants
 * Used by both server-side and client-side telemetry
 */

export const OTEL_CONFIG = {
  // Service identification
  serviceNamespace: "o11y-test-namespace",
  deploymentEnvironment: "o11y-test-env",
  
  // Default OTLP endpoint
  defaultOtlpEndpoint: "http://localhost:4318",
} as const;

