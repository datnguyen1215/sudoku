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
  try {
    const { difficulty } = req.body;

    if (!difficulty || !['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const game = await gameService.createNewGame(difficulty);
    logger.info('Game created successfully', {
      sessionId: game.sessionId,
      difficulty
    });
    res.json(game);
  } catch (error) {
    logger.error('Error creating game', { error: error.message });
    res.status(500).json({ error: 'Failed to create game' });
  }
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const game = await gameService.getGameById(sessionId);
    res.json(game);
  } catch (error) {
    if (error.message === 'Game not found') {
      return res.status(404).json({ error: 'Game not found' });
    }
    logger.error('Error fetching game', {
      error: error.message,
      sessionId: req.params.sessionId
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
  try {
    const { sessionId } = req.params;
    const { currentGrid, timeElapsed } = req.body;

    if (!currentGrid || typeof timeElapsed !== 'number') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const result = await gameService.updateGameState(sessionId, currentGrid, timeElapsed);
    res.json(result);
  } catch (error) {
    if (error.message === 'Game not found') {
      return res.status(404).json({ error: 'Game not found' });
    }
    logger.error('Error updating game', {
      error: error.message,
      sessionId: req.params.sessionId
    });
    res.status(500).json({ error: 'Failed to update game' });
  }
});

export default router;
