This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Observability

This application includes OpenTelemetry instrumentation for comprehensive observability:

### Features
- **Distributed Tracing**: Automatic instrumentation of HTTP requests, API calls, and database operations
- **Metrics Collection**: Performance metrics including response times, throughput, and resource usage
- **Structured Logging**: Centralized logging with trace correlation
- **Error Tracking**: Automatic error capture and monitoring

### Configuration

Set the following environment variables to configure telemetry data export:

```bash
# OTLP endpoint (defaults to http://localhost:4318)
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-observe-endpoint.com

# Optional: Bearer token for authentication
OTEL_EXPORTER_OTLP_BEARER_TOKEN=your-token-here

# For client-side telemetry (browser), use NEXT_PUBLIC_ prefix:
NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT=https://your-observe-endpoint.com
NEXT_PUBLIC_OTEL_EXPORTER_OTLP_BEARER_TOKEN=your-token-here
```

### Files Added
- `instrumentation.ts` - Next.js server-side instrumentation entry point
- `otel-server.ts` - Server-side OpenTelemetry configuration
- `otel-client.ts` - Client-side OpenTelemetry configuration
- `src/components/providers/otel-client-init.tsx` - Client-side initialization component

The instrumentation is designed to be non-intrusive and automatically captures telemetry data without modifying existing application logic.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
