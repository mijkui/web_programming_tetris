import { TetrominoType } from '../types';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

/**
 * Generate a random tetromino type
 */
export const getRandomTetromino = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Generate initial next pieces queue
 */
export const generateNextPieces = (count: number = 4): TetrominoType[] => {
  return Array.from({ length: count }, () => getRandomTetromino());
};

/**
 * Create empty playfield
 */
export const createEmptyPlayfield = (): (TetrominoType | null)[][] => {
  return Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(null));
};

/**
 * Get spawn position for a piece (centered at top)
 */
export const getSpawnPosition = (type: TetrominoType): { x: number; y: number } => {
  // Center horizontally, start at top (negative y for pieces that spawn above)
  return {
    x: Math.floor((GRID_WIDTH - 2) / 2), // Center for most pieces
    y: type === 'I' ? -1 : 0, // I piece needs to start one row higher
  };
};

