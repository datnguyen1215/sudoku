/**
 * Logger utility for frontend
 */

import { createBrowserLogger } from '$shared/logger/browser.js';
import { LOG_LEVELS } from '$shared/logger/index.js';

// Export a factory function for creating loggers
export function createLogger(filename) {
  // For Svelte components, extract a cleaner name
  if (filename && filename.includes('+page.svelte')) {
    // Convert '+page.svelte' to the route name
    filename = filename.replace('+page.svelte', 'page');
  }
  
  return createBrowserLogger(filename || 'app');
}

// Re-export LOG_LEVELS for convenience
export { LOG_LEVELS };