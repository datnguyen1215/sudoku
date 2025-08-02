/**
 * Node.js-specific logger implementation
 */

// Import only the base class to avoid circular dependency
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Copy the Logger class to avoid circular dependency
class Logger {
  constructor(filename, options = {}) {
    this.filename = this.extractFilename(filename);
    this.minLevel = options.minLevel || LOG_LEVELS.INFO;
    this.isProduction = options.isProduction || false;
    this.enableColors = options.enableColors !== false && !this.isProduction;
  }

  extractFilename(filepath) {
    if (!filepath) return 'unknown';
    const parts = filepath.split(/[\\/]/);
    const filename = parts[parts.length - 1];
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
    const levelName = Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level).padEnd(5);
    let formattedMessage = `[${timestamp}] - ${levelName} - [${this.filename}] - ${message}`;
    if (data && Object.keys(data).length > 0) {
      formattedMessage += ' ' + JSON.stringify(data);
    }
    return formattedMessage;
  }

  log(level, message, data) {
    if (level > this.minLevel) return;
    const formattedMessage = this.formatMessage(level, message, data);
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

  output(level, formattedMessage) {
    console.log(formattedMessage);
  }
}

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

class NodeLogger extends Logger {
  constructor(filename, options = {}) {
    super(filename, options);
    
    // Set production mode based on NODE_ENV
    if (process.env.NODE_ENV === 'production') {
      this.isProduction = true;
      this.enableColors = false;
      this.minLevel = options.minLevel || LOG_LEVELS.INFO;
    }
    
    // Allow DEBUG level in development
    if (process.env.NODE_ENV === 'development' && !options.minLevel) {
      this.minLevel = LOG_LEVELS.DEBUG;
    }
  }

  getColorForLevel(level) {
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
  }

  output(level, formattedMessage) {
    if (this.isProduction) {
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
      
      if (this.enableColors) {
        const color = this.getColorForLevel(level);
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
  }
}

module.exports = { NodeLogger };