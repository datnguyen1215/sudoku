import express from 'express';
import cors from 'cors';
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
