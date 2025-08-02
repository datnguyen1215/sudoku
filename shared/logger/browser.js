/**
 * Browser-specific logger implementation
 */

import { Logger, LOG_LEVELS } from './index.js';

// Console styles for different log levels
const STYLES = {
  ERROR: 'color: #ff4444; font-weight: bold',
  WARN: 'color: #ff9944; font-weight: bold',
  INFO: 'color: #44aa44',
  DEBUG: 'color: #888888',
  FILENAME: 'color: #4444ff',
  TIMESTAMP: 'color: #666666'
};

export class BrowserLogger extends Logger {
  constructor(filename, options = {}) {
    super(filename, options);
    
    // In production builds, disable debug logs
    if (import.meta.env?.MODE === 'production') {
      this.isProduction = true;
      this.minLevel = options.minLevel || LOG_LEVELS.INFO;
    }
    
    // Extract filename from stack trace if not provided
    if (!filename || filename === 'unknown') {
      this.filename = this.getFilenameFromStack();
    }
  }

  getFilenameFromStack() {
    try {
      const error = new Error();
      const stack = error.stack?.split('\n') || [];
      
      // Look for the first stack frame that's not from the logger
      for (const line of stack) {
        if (line.includes('.svelte') || line.includes('.js')) {
          const match = line.match(/([^/\\]+\.(svelte|js))/);
          if (match && !match[1].includes('logger')) {
            return match[1];
          }
        }
      }
    } catch (e) {
      // Fallback if stack parsing fails
    }
    
    return 'app';
  }

  output(level, formattedMessage) {
    if (this.isProduction) {
      // In production, use simple console output
      const method = level === LOG_LEVELS.ERROR ? 'error' : 
                     level === LOG_LEVELS.WARN ? 'warn' : 'log';
      console[method](formattedMessage);
      return;
    }

    // In development, use styled console output
    const parts = formattedMessage.split(' - ');
    const [timestamp, levelName, filename, ...messageParts] = parts;
    const message = messageParts.join(' - ');
    
    const styleForLevel = STYLES[Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level)] || '';
    
    // Create formatted console output with styles
    const consoleArgs = [
      `%c${timestamp}%c - %c${levelName}%c - %c${filename}%c - ${message}`,
      STYLES.TIMESTAMP,
      'color: inherit',
      styleForLevel,
      'color: inherit',
      STYLES.FILENAME,
      'color: inherit'
    ];
    
    // Use appropriate console method
    const method = level === LOG_LEVELS.ERROR ? 'error' : 
                   level === LOG_LEVELS.WARN ? 'warn' : 
                   level === LOG_LEVELS.DEBUG ? 'debug' : 'log';
    
    console[method](...consoleArgs);
  }
}

// For ES modules, also export a factory function
export function createBrowserLogger(filename, options = {}) {
  return new BrowserLogger(filename, options);
}