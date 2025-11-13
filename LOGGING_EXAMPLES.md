# OpenTelemetry Logging Examples

This document demonstrates the logging capabilities implemented in the application.

## Server-Side Logging

### Logger Utility (`src/lib/logger-server.ts`)

The server-side logger provides structured logging with trace correlation:

- **`logger.info(message, attributes?)`** - Informational messages
- **`logger.warn(message, attributes?)`** - Warning messages
- **`logger.error(message, error?, attributes?)`** - Error messages with optional Error object
- **`logger.debug(message, attributes?)`** - Debug messages
- **`logger.traced(operationName, fn, attributes?)`** - Traced operations with automatic logging

### Examples in Action

#### API Routes
- **`/api/tournaments/[userId]`** - Logs API requests, responses, and errors with metadata
- **`/api/tournament/[tournamentId]`** - Logs API requests, responses, and errors with metadata

#### Data Fetching Functions (`src/lib/matchplay.ts`)
- **`fetchUserProfile()`** - Logs user profile fetches with userId, success/failure, and profile metadata
- **`fetchTournamentsByUser()`** - Logs tournament fetches with userId, tournament count, and pagination info
- **`fetchTournamentData()`** - Logs tournament data fetches with detailed metadata (players, standings)

### Server-Side Log Attributes

Logs include rich contextual information:
- User IDs
- Tournament IDs and names
- HTTP status codes
- Player counts
- Error details (message, stack, name)
- Response metadata

## Client-Side Logging

### Logger Utility (`src/lib/logger-client.ts`)

The client-side logger provides browser-specific logging:

- **`logger.info(message, attributes?)`** - Informational messages
- **`logger.warn(message, attributes?)`** - Warning messages
- **`logger.error(message, error?, attributes?)`** - Error messages
- **`logger.debug(message, attributes?)`** - Debug messages
- **`logger.userAction(action, attributes?)`** - User interaction events
- **`logger.pageView(path, attributes?)`** - Page view events
- **`logger.traced(operationName, fn, attributes?)`** - Traced operations

### Examples in Action

#### Application Initialization
- **`OtelClientInit`** - Logs client initialization with browser metadata:
  - User agent
  - Language
  - Screen resolution
  - Viewport size
  - Timezone

#### Page Views
- **Home page (`/`)** - Logs page view with initial state
- **User page (`/user/[userId]`)** - Logs page view with user metadata and tournament count
- **Tournament page (`/tournament/[tournamentId]`)** - Logs page view with tournament metadata

#### User Interactions
- **Submit user ID** - Logs when user submits a user ID from home page
- **Click tournament** - Logs when user clicks on a tournament card

### Client-Side Log Attributes

Logs include browser-specific information:
- Timestamps
- User agent
- Page paths
- Referrer
- User actions
- Performance metrics (load time)
- Screen/viewport dimensions
- Timezone

## Log Severity Levels

Both server and client loggers support standard severity levels:
- **DEBUG** - Detailed debugging information
- **INFO** - General informational messages
- **WARN** - Warning messages
- **ERROR** - Error messages with stack traces

## Trace Correlation

All logs are automatically correlated with OpenTelemetry traces, allowing you to:
- See logs in the context of distributed traces
- Track requests across server and client boundaries
- Debug issues with full context

## Testing the Logging

To see the logging in action:

1. Start the application: `npm run dev`
2. Navigate to the home page - see client initialization logs
3. Submit a user ID - see user action logs and server-side API logs
4. Click on a tournament - see user action logs and server-side data fetching logs
5. View tournament details - see page view logs and detailed data fetching logs

All logs are exported to your configured OTLP endpoint with full trace correlation.

