import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import gameRoutes from '#routes/games.js';
import { createLogger } from '#utils/logger.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const logger = createLogger(__filename);
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

/**
 * Request logging middleware - captures all incoming requests
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  // Attach metadata to request for use in response logging
  req.requestId = requestId;
  req.startTime = startTime;

  // Log incoming request
  logger.info('API Request', {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    userAgent: req.get('user-agent'),
    ip: req.ip || req.connection?.remoteAddress,
    contentLength: req.get('content-length'),
    ...(req.method !== 'GET' && req.body && Object.keys(req.body).length > 0 && {
      bodyKeys: Object.keys(req.body)
    })
  });

  next();
};

/**
 * Response logging middleware - captures all outgoing responses
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const responseLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - req.startTime;

    // Log response
    logger.info('API Response', {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('content-length')
    });

    return originalSend.call(this, data);
  };

  next();
};

// Apply logging middleware
app.use(requestLogger);
app.use(responseLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/games', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error in request', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
