"use client";

import { useEffect } from "react";

export function OtelClientInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import and initialize client-side OpenTelemetry
      import("../../../otel-client").then(({ initOtel }) => {
        initOtel();

        // Import logger after OTEL is initialized
        import("../../lib/logger-client").then(({ logger }) => {
          logger.info("Client-side application initialized", {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        });
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
