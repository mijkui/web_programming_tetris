import { GameState, TetrominoType } from './types';
import { createEmptyPlayfield, generateNextPieces, getRandomTetromino, getSpawnPosition } from './utils/gameUtils';

/**
 * Create initial game state (fresh start)
 */
export const createInitialGameState = (): GameState => {
  const nextPieces = generateNextPieces(4);
  const firstPiece = nextPieces[0];
  const spawnPos = getSpawnPosition(firstPiece);

  return {
    lines: 0,
    level: 1,
    score: 0,
    topScore: 0,
    holdPiece: null,
    nextPieces: nextPieces.slice(1), // Remove first piece as it becomes current
    playfield: createEmptyPlayfield(),
    currentPiece: {
      type: firstPiece,
      x: spawnPos.x,
      y: spawnPos.y,
      rotation: 0,
    },
    ghostPiece: {
      type: firstPiece,
      x: spawnPos.x,
      y: spawnPos.y,
      rotation: 0,
    },
    isGameOver: false,
  };
};

// Keep mockGameState for reference, but use initial state for new games
export const mockGameState: GameState = createInitialGameState();

