/**
 * Logger utility for frontend
 */

import { BrowserLogger } from '$shared/logger/browser.js';
import { LOG_LEVELS } from '$shared/logger/index.mjs';

// Export a factory function for creating loggers
export function createLogger(filename) {
  // For Svelte components, extract a cleaner name
  if (filename && filename.includes('+page.svelte')) {
    // Convert '+page.svelte' to the route name
    filename = filename.replace('+page.svelte', 'page');
  }
  
  return new BrowserLogger(filename || 'app');
}

// Re-export LOG_LEVELS for convenience
export { LOG_LEVELS };