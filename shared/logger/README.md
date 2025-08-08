# Custom Logger

A lightweight browser logger utility for web applications.

## Features

- Consistent format: `[timestamp] - [LEVEL] - [(filename)] - [message]`
- Color-coded output in development
- Automatic filename detection
- Log levels: ERROR, WARN, INFO, DEBUG
- Zero dependencies
- Optimized for browser environments

## Usage

### Browser Application

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
[2025-08-01 14:23:45.123] - INFO  - [gameContext.js] - Game session started
[2025-08-01 14:23:47.456] - ERROR - [client.js] - Failed to load saved game {"error":"Invalid session data"}
[2025-08-01 14:23:52.789] - WARN  - [sessionManager.js] - Slow puzzle generation {"duration":"523ms"}
[2025-08-01 14:24:03.012] - DEBUG - [SudokuGrid.svelte] - Cell selected {"row":3,"col":5}
```

### Production (JSON)
```json
{"timestamp":"2025-08-01 14:23:45.123","level":"INFO","filename":"gameContext.js","message":"Game session started"}
{"timestamp":"2025-08-01 14:23:47.456","level":"ERROR","filename":"client.js","message":"Failed to load saved game {\"error\":\"Invalid session data\"}"}
```

## Configuration

### Log Levels

Set minimum log level:
```javascript
const logger = createLogger(__filename, { minLevel: LOG_LEVELS.WARN });
```

### Environment Detection

- **Browser**: Uses `import.meta.env.MODE` for Vite-based apps to determine production mode

## Implementation Details

- **Timestamp**: Full date and time with milliseconds
- **Filename extraction**: Smart detection of relevant path components
- **Performance**: Minimal overhead, no external dependencies
- **Browser compatibility**: Works in all modern browsers
- **Framework integration**: Optimized for SvelteKit and Vite applications