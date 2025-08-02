/**
 * ES Module version of the logger for frontend use
 */

export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

export const LOG_LEVEL_NAMES = Object.keys(LOG_LEVELS);

/**
 * @param {string} filepath
 * @returns {string}
 */
const extractFilename = (filepath) => {
  if (!filepath) return 'unknown';
  
  // Handle both Unix and Windows paths
  const parts = filepath.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  
  // For nested paths, include parent directory
  if (parts.length > 1) {
    const parent = parts[parts.length - 2];
    if (parent !== 'src' && parent !== 'lib' && parent !== 'routes') {
      return `${parent}/${filename}`;
    }
  }
  
  return filename;
};

/**
 * @returns {string}
 */
const formatTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
};

/**
 * @param {number} level
 * @param {string} message
 * @param {Object} data
 * @param {string} filename
 * @returns {string}
 */
const formatMessage = (level, message, data, filename) => {
  const timestamp = formatTimestamp();
  const levelName = LOG_LEVEL_NAMES[level].padEnd(5);
  
  let formattedMessage = `[${timestamp}] - ${levelName} - [${filename}] - ${message}`;
  
  if (data && Object.keys(data).length > 0) {
    formattedMessage += ' ' + JSON.stringify(data);
  }
  
  return formattedMessage;
};

/**
 * @param {string} filename
 * @param {Object} options
 * @param {number} [options.minLevel]
 * @param {boolean} [options.isProduction]
 * @param {boolean} [options.enableColors]
 * @returns {Object}
 */
export const createBaseLogger = (filename, options = {}) => {
  // Private state via closure
  const state = {
    filename: extractFilename(filename),
    minLevel: options.minLevel || LOG_LEVELS.INFO,
    isProduction: options.isProduction || false,
    enableColors: options.enableColors !== false && !options.isProduction
  };

  /**
   * @param {number} level
   * @param {string} message
   * @param {Object} data
   * @returns {Object|null}
   */
  const log = (level, message, data) => {
    if (level > state.minLevel) return null;
    
    const formattedMessage = formatMessage(level, message, data, state.filename);
    
    return {
      formattedMessage,
      level,
      state
    };
  };

  // Public API
  return {
    error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
    warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
    info: (message, data) => log(LOG_LEVELS.INFO, message, data),
    debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
    // Expose state for platform-specific loggers if needed
    getState: () => ({ ...state })
  };
};

// Simple fallback logger that just logs to console
export const Logger = createBaseLogger;

/**
 * @param {string} filename
 * @param {Object} options
 * @returns {Object}
 */
export const createLogger = (filename, options = {}) => {
  // Simple logger that outputs to console
  const baseLogger = createBaseLogger(filename, options);
  
  const enhancedLogger = {};
  
  Object.keys(baseLogger).forEach(method => {
    if (method === 'getState') {
      enhancedLogger[method] = baseLogger[method];
      return;
    }
    
    enhancedLogger[method] = (message, data) => {
      const result = baseLogger[method](message, data);
      if (result) {
        console.log(result.formattedMessage);
      }
    };
  });
  
  return enhancedLogger;
};