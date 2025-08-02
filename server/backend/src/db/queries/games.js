import { query } from '#db/index.js';

/**
 * @param {string} sessionId - Unique game session identifier
 * @param {string} difficulty - Game difficulty level
 * @param {Array<Array<number|null>>} puzzleGrid - Initial puzzle state
 * @param {Array<Array<number>>} solutionGrid - Complete solution
 * @returns {Promise<Object>} Created game record
 */
export const createGame = async (sessionId, difficulty, puzzleGrid, solutionGrid) => {
  const queryText = `
    INSERT INTO games (session_id, difficulty, puzzle_grid, current_grid, solution_grid)
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb)
    RETURNING *
  `;
  const values = [
    sessionId,
    difficulty,
    JSON.stringify(puzzleGrid),
    JSON.stringify(puzzleGrid),
    JSON.stringify(solutionGrid)
  ];
  const result = await query(queryText, values);
  return result.rows[0];
};

/**
 * @param {string} sessionId - Game session identifier
 * @returns {Promise<Object|undefined>} Game record or undefined
 */
export const getGame = async sessionId => {
  const queryText = 'SELECT * FROM games WHERE session_id = $1';
  const result = await query(queryText, [sessionId]);
  return result.rows[0];
};

/**
 * @param {string} sessionId - Game session identifier
 * @param {Array<Array<number|null>>} currentGrid - Current game state
 * @param {number} timeElapsed - Time elapsed in seconds
 * @returns {Promise<Object>} Updated game record
 */
export const updateGame = async (sessionId, currentGrid, timeElapsed) => {
  const queryText = `
    UPDATE games 
    SET current_grid = $2::jsonb, time_elapsed = $3, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = $1
    RETURNING *
  `;
  const values = [sessionId, JSON.stringify(currentGrid), timeElapsed];
  const result = await query(queryText, values);
  return result.rows[0];
};
