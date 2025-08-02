import { query } from "#db/index.js";

export const createGame = async (
  sessionId,
  difficulty,
  puzzleGrid,
  solutionGrid,
) => {
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
    JSON.stringify(solutionGrid),
  ];
  console.log("DB Insert values:", { sessionId, difficulty });
  const result = await query(queryText, values);
  return result.rows[0];
};

export const getGame = async (sessionId) => {
  const queryText = "SELECT * FROM games WHERE session_id = $1";
  const result = await query(queryText, [sessionId]);
  return result.rows[0];
};

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
