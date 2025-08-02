/**
 * Custom logger that works in both Node.js and browser environments
 * Format: [timestamp] - [LEVEL] - [(filename)] - [message]
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL_NAMES = Object.keys(LOG_LEVELS);

class Logger {
  constructor(filename, options = {}) {
    this.filename = this.extractFilename(filename);
    this.minLevel = options.minLevel || LOG_LEVELS.INFO;
    this.isProduction = options.isProduction || false;
    this.enableColors = options.enableColors !== false && !this.isProduction;
  }

  extractFilename(filepath) {
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
  }

  formatTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
  }

  formatMessage(level, message, data) {
    const timestamp = this.formatTimestamp();
    const levelName = LOG_LEVEL_NAMES[level].padEnd(5);
    
    let formattedMessage = `[${timestamp}] - ${levelName} - [${this.filename}] - ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      formattedMessage += ' ' + JSON.stringify(data);
    }
    
    return formattedMessage;
  }

  log(level, message, data) {
    if (level > this.minLevel) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    // This will be overridden by platform-specific implementations
    this.output(level, formattedMessage);
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  // To be implemented by platform-specific loggers
  output(level, formattedMessage) {
    console.log(formattedMessage);
  }
}

// Factory function to create logger instances
function createLogger(filename, options = {}) {
  // For Node.js, we always use NodeLogger
  // Browser will use the ES module version
  const { NodeLogger } = require('./node');
  return new NodeLogger(filename, options);
}

module.exports = {
  Logger,
  createLogger,
  LOG_LEVELS,
  LOG_LEVEL_NAMES
};