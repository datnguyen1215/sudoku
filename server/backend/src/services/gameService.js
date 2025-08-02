import * as gameQueries from '#db/queries/games.js';

// Pre-made valid sudoku solutions (same as frontend)
const SUDOKU_SOLUTIONS = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ],
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 1, 4, 3, 6, 5, 8, 9, 7],
    [3, 6, 5, 8, 9, 7, 2, 1, 4],
    [8, 9, 7, 2, 1, 4, 3, 6, 5],
    [5, 3, 1, 6, 4, 2, 9, 7, 8],
    [6, 4, 2, 9, 7, 8, 5, 3, 1],
    [9, 7, 8, 5, 3, 1, 6, 4, 2]
  ],
  [
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4]
  ]
];

const getClueCount = (difficulty) => {
  const clueMap = {
    easy: 45,
    medium: 35,
    hard: 28,
    expert: 22
  };
  return clueMap[difficulty] || 35;
}

const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `game-${timestamp}-${random}`;
}

const generateSudokuPuzzle = (difficulty) => {
  // Select a random complete solution
  const solutionGrid = SUDOKU_SOLUTIONS[Math.floor(Math.random() * SUDOKU_SOLUTIONS.length)].map(
    row => [...row]
  );

  // Create puzzle grid by removing numbers
  const puzzleGrid = solutionGrid.map(row => [...row]);
  const clueCount = getClueCount(difficulty);
  const totalCells = 81;
  const cellsToRemove = totalCells - clueCount;

  // Create array of all cell positions
  const allPositions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allPositions.push({ row, col });
    }
  }

  // Shuffle positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Remove numbers from random positions
  for (let i = 0; i < cellsToRemove && i < allPositions.length; i++) {
    const { row, col } = allPositions[i];
    puzzleGrid[row][col] = null;
  }

  return {
    puzzleGrid,
    solutionGrid
  };
}

export const createNewGame = async (difficulty) => {
  const sessionId = generateSessionId();
  const { puzzleGrid, solutionGrid } = generateSudokuPuzzle(difficulty);
  
  const game = await gameQueries.createGame(
    sessionId,
    difficulty,
    JSON.stringify(puzzleGrid),
    JSON.stringify(solutionGrid)
  );

  // Return without solution for client
  return {
    sessionId: game.session_id,
    difficulty: game.difficulty,
    puzzle: JSON.parse(game.puzzle_grid),
    startTime: game.created_at
  };
}

export const getGameById = async (sessionId) => {
  const game = await gameQueries.getGame(sessionId);
  
  if (!game) {
    throw new Error('Game not found');
  }

  // Return without solution for client
  return {
    sessionId: game.session_id,
    difficulty: game.difficulty,
    puzzle: JSON.parse(game.puzzle_grid),
    currentGrid: JSON.parse(game.current_grid),
    timeElapsed: game.time_elapsed,
    startTime: game.created_at
  };
}

export const updateGameState = async (sessionId, currentGrid, timeElapsed) => {
  const game = await gameQueries.updateGame(
    sessionId,
    JSON.stringify(currentGrid),
    timeElapsed
  );

  if (!game) {
    throw new Error('Game not found');
  }

  return { success: true };
}

