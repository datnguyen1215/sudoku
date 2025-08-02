/**
 * Logger utility for backend
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createLogger: sharedCreateLogger } = require('../../../../shared/logger');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create and export a logger factory for backend use
export const createLogger = (filename) => {
  // Normalize the filename to be relative to backend src
  const relativePath = path.relative(
    path.join(__dirname, '..'),
    filename
  );
  
  return sharedCreateLogger(relativePath || filename);
};