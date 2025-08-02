# Custom Logger

A lightweight, cross-platform logger that works in both Node.js and browser environments.

## Features

- Consistent format: `[timestamp] - [LEVEL] - [(filename)] - [message]`
- Color-coded output in development
- JSON output in production (Node.js)
- Automatic filename detection
- Log levels: ERROR, WARN, INFO, DEBUG
- Zero dependencies

## Usage

### Backend (Node.js)

```javascript
const { createLogger } = require('./src/utils/logger');

const logger = createLogger(__filename);

logger.info('Server started', { port: 3001 });
logger.error('Database connection failed', { error: err.message });
logger.warn('Slow query detected', { duration: '500ms' });
logger.debug('Request details', { method: 'POST', url: '/api/games' });
```

### Frontend (Browser)

```javascript
import { createLogger } from '$utils/logger.js';

const logger = createLogger('MyComponent.svelte');

logger.info('Component mounted');
logger.error('API call failed', { status: 404 });
logger.debug('State updated', { newValue: 42 });
```

## Output Examples

### Development (Colored)
```
[2025-08-01 14:23:45.123] - INFO  - [server.js] - Server started on port 3001
[2025-08-01 14:23:47.456] - ERROR - [games.js] - Failed to create game {"error":"Database unavailable"}
[2025-08-01 14:23:52.789] - WARN  - [api.js] - Slow response time {"duration":"523ms"}
[2025-08-01 14:24:03.012] - DEBUG - [auth.js] - User authenticated {"userId":123}
```

### Production (JSON)
```json
{"timestamp":"2025-08-01 14:23:45.123","level":"INFO","filename":"server.js","message":"Server started on port 3001"}
{"timestamp":"2025-08-01 14:23:47.456","level":"ERROR","filename":"games.js","message":"Failed to create game {\"error\":\"Database unavailable\"}"}
```

## Configuration

### Log Levels

Set minimum log level:
```javascript
const logger = createLogger(__filename, { minLevel: LOG_LEVELS.WARN });
```

### Environment Detection

- **Node.js**: Uses `NODE_ENV` to determine production mode
- **Browser**: Uses `import.meta.env.MODE` for Vite-based apps

## Implementation Details

- **Timestamp**: Full date and time with milliseconds
- **Filename extraction**: Smart detection of relevant path components
- **Performance**: Minimal overhead, no external dependencies
- **Browser compatibility**: Works in all modern browsers
- **Node.js compatibility**: Works with CommonJS and ES modules