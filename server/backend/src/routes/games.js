import express from 'express';
import { fileURLToPath } from 'node:url';
import * as gameService from '#services/gameService.js';
import { createLogger } from '#utils/logger.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const logger = createLogger(__filename);

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
router.post('/', async (req, res) => {
  const { requestId } = req;
  const { difficulty } = req.body;

  logger.info('Creating new game', {
    requestId,
    difficulty,
    bodyKeys: Object.keys(req.body)
  });

  try {
    if (!difficulty || !['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      logger.warn('Invalid difficulty level provided', {
        requestId,
        difficulty,
        validOptions: ['easy', 'medium', 'hard', 'expert']
      });
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const startTime = Date.now();
    const game = await gameService.createNewGame(difficulty);
    const serviceTime = Date.now() - startTime;

    logger.info('Game created successfully', {
      requestId,
      sessionId: game.sessionId,
      difficulty,
      serviceTime: `${serviceTime}ms`,
      puzzleGenerated: true
    });

    res.json(game);
  } catch (error) {
    logger.error('Error creating game', {
      requestId,
      difficulty,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to create game' });
  }
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
router.get('/:sessionId', async (req, res) => {
  const { requestId } = req;
  const { sessionId } = req.params;

  logger.info('Fetching game', {
    requestId,
    sessionId
  });

  try {
    const startTime = Date.now();
    const game = await gameService.getGameById(sessionId);
    const serviceTime = Date.now() - startTime;

    logger.info('Game fetched successfully', {
      requestId,
      sessionId,
      difficulty: game.difficulty,
      timeElapsed: game.timeElapsed,
      serviceTime: `${serviceTime}ms`
    });

    res.json(game);
  } catch (error) {
    if (error.message === 'Game not found') {
      logger.warn('Game not found', {
        requestId,
        sessionId
      });
      return res.status(404).json({ error: 'Game not found' });
    }
    logger.error('Error fetching game', {
      requestId,
      sessionId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
router.put('/:sessionId', async (req, res) => {
  const { requestId } = req;
  const { sessionId } = req.params;
  const { currentGrid, timeElapsed } = req.body;

  logger.info('Updating game state', {
    requestId,
    sessionId,
    timeElapsed,
    hasCurrentGrid: !!currentGrid,
    bodyKeys: Object.keys(req.body)
  });

  try {
    if (!currentGrid || typeof timeElapsed !== 'number') {
      logger.warn('Invalid game update data', {
        requestId,
        sessionId,
        hasCurrentGrid: !!currentGrid,
        timeElapsedType: typeof timeElapsed,
        timeElapsed
      });
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const startTime = Date.now();
    const result = await gameService.updateGameState(sessionId, currentGrid, timeElapsed);
    const serviceTime = Date.now() - startTime;

    logger.info('Game state updated successfully', {
      requestId,
      sessionId,
      timeElapsed,
      success: result.success,
      serviceTime: `${serviceTime}ms`
    });

    res.json(result);
  } catch (error) {
    if (error.message === 'Game not found') {
      logger.warn('Game not found for update', {
        requestId,
        sessionId
      });
      return res.status(404).json({ error: 'Game not found' });
    }
    logger.error('Error updating game', {
      requestId,
      sessionId,
      timeElapsed,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to update game' });
  }
});

export default router;
