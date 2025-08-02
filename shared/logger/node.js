/**
 * Node.js-specific logger implementation
 */

import { createBaseLogger, LOG_LEVELS, LOG_LEVEL_NAMES } from './index.js';

// ANSI color codes for terminal output
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  GREEN: '\x1b[32m',
  GRAY: '\x1b[90m',
  CYAN: '\x1b[36m',
  BRIGHT: '\x1b[1m'
};

/**
 * @param {number} level
 * @returns {string}
 */
const getColorForLevel = (level) => {
  switch (level) {
    case LOG_LEVELS.ERROR:
      return COLORS.RED;
    case LOG_LEVELS.WARN:
      return COLORS.YELLOW;
    case LOG_LEVELS.INFO:
      return COLORS.GREEN;
    case LOG_LEVELS.DEBUG:
      return COLORS.GRAY;
    default:
      return COLORS.RESET;
  }
};

/**
 * @param {string} formattedMessage
 * @param {number} level
 * @param {Object} state
 */
const outputToNodeConsole = (formattedMessage, level, state) => {
  if (state.isProduction) {
    // In production, output JSON for better parsing
    const [timestamp, , levelName, , filename, , ...messageParts] = formattedMessage.split(' - ');
    const message = messageParts.join(' - ');
    
    const logObject = {
      timestamp: timestamp.replace(/[\[\]]/g, ''),
      level: levelName.trim(),
      filename: filename.replace(/[\[\]]/g, ''),
      message: message
    };
    
    // Use appropriate console method
    if (level === LOG_LEVELS.ERROR) {
      console.error(JSON.stringify(logObject));
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(JSON.stringify(logObject));
    } else {
      console.log(JSON.stringify(logObject));
    }
  } else {
    // In development, use colors
    let coloredMessage = formattedMessage;
    
    if (state.enableColors) {
      const color = getColorForLevel(level);
      const parts = formattedMessage.split(' - ');
      
      // Color the level
      parts[1] = `${color}${parts[1]}${COLORS.RESET}`;
      
      // Color the filename in cyan
      parts[2] = `${COLORS.CYAN}${parts[2]}${COLORS.RESET}`;
      
      // Color the message based on level
      if (parts[3]) {
        parts[3] = `${color}${parts[3]}${COLORS.RESET}`;
      }
      
      coloredMessage = parts.join(' - ');
    }
    
    // Use appropriate console method
    if (level === LOG_LEVELS.ERROR) {
      console.error(coloredMessage);
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(coloredMessage);
    } else {
      console.log(coloredMessage);
    }
  }
};

/**
 * @param {string} filename
 * @param {Object} options
 * @returns {Object}
 */
export const createNodeLogger = (filename, options = {}) => {
  // Set production mode based on NODE_ENV
  const nodeOptions = { ...options };
  
  if (process.env.NODE_ENV === 'production') {
    nodeOptions.isProduction = true;
    nodeOptions.enableColors = false;
    nodeOptions.minLevel = options.minLevel || LOG_LEVELS.INFO;
  }
  
  // Allow DEBUG level in development
  if (process.env.NODE_ENV === 'development' && !options.minLevel) {
    nodeOptions.minLevel = LOG_LEVELS.DEBUG;
  }
  
  const baseLogger = createBaseLogger(filename, nodeOptions);
  
  // Enhance with Node-specific output
  const enhancedLogger = {};
  
  Object.keys(baseLogger).forEach(method => {
    if (method === 'getState') {
      enhancedLogger[method] = baseLogger[method];
      return;
    }
    
    enhancedLogger[method] = (message, data) => {
      const result = baseLogger[method](message, data);
      if (result) {
        outputToNodeConsole(result.formattedMessage, result.level, result.state);
      }
    };
  });
  
  return enhancedLogger;
};

// Maintain backward compatibility
export const NodeLogger = createNodeLogger;