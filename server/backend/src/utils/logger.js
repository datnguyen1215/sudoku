/**
 * Logger utility for backend
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNodeLogger } from '../../../../shared/logger/node.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create and export a logger factory for backend use
export const createLogger = filename => {
  // Normalize the filename to be relative to backend src
  const relativePath = path.relative(path.join(__dirname, '..'), filename);

  return createNodeLogger(relativePath || filename);
};
