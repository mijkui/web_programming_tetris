import { useCallback } from 'react';
import { GameState, TetrominoType, TETROMINO_SHAPES } from '../types';
import { generateNextPieces, getSpawnPosition } from '../utils/gameUtils';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

/**
 * Get the rotated shape blocks for a piece
 * This is the single source of truth for piece shapes at any rotation
 */
export const getRotatedBlocks = (
  type: TetrominoType,
  rotation: number
): boolean[][] => {
  const shape = TETROMINO_SHAPES[type];
  return getRotatedShape(shape.blocks, rotation);
};

/**
 * Get all cell positions for a piece at a given position and rotation
 * Returns array of {x, y} coordinates relative to playfield
 */
export const getPieceCells = (
  type: TetrominoType,
  x: number,
  y: number,
  rotation: number
): Array<{ x: number; y: number }> => {
  const blocks = getRotatedBlocks(type, rotation);
  const cells: Array<{ x: number; y: number }> = [];

  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      if (blocks[row][col]) {
        cells.push({
          x: x + col,
          y: y + row,
        });
      }
    }
  }

  return cells;
};

/**
 * Check if a piece can be placed at a given position
 */
export const canPlacePiece = (
  playfield: (TetrominoType | null)[][],
  type: TetrominoType,
  x: number,
  y: number,
  rotation: number = 0
): boolean => {
  const cells = getPieceCells(type, x, y, rotation);

  for (const cell of cells) {
    // Check boundaries
    if (cell.x < 0 || cell.x >= GRID_WIDTH || cell.y >= GRID_HEIGHT) {
      return false;
    }

    // Check if above the playfield (allowed)
    if (cell.y < 0) {
      continue;
    }

    // Check collision with placed blocks
    if (playfield[cell.y]?.[cell.x]) {
      return false;
    }
  }

  return true;
};

/**
 * Get rotated shape (simple rotation for now)
 */
const getRotatedShape = (blocks: boolean[][], rotation: number): boolean[][] => {
  let rotated = blocks;
  const rotations = rotation % 4;

  for (let i = 0; i < rotations; i++) {
    rotated = rotate90(rotated);
  }

  return rotated;
};


/**
 * Rotate a 2D array 90 degrees clockwise
 */
const rotate90 = (matrix: boolean[][]): boolean[][] => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  
  if (rows === 0 || cols === 0) return matrix;
  
  const rotated: boolean[][] = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (matrix[row]?.[col]) {
        rotated[col][rows - 1 - row] = true;
      }
    }
  }

  return rotated;
};

/**
 * Calculate ghost piece position (where piece will land)
 */
export const calculateGhostPiece = (
  playfield: (TetrominoType | null)[][],
  currentPiece: { type: TetrominoType; x: number; y: number; rotation: number }
): { type: TetrominoType; x: number; y: number; rotation: number } => {
  let ghostY = currentPiece.y;

  // Drop the piece down until it hits something
  while (canPlacePiece(playfield, currentPiece.type, currentPiece.x, ghostY + 1, currentPiece.rotation)) {
    ghostY++;
    // Safety check to prevent infinite loop
    if (ghostY >= GRID_HEIGHT) break;
  }

  return {
    type: currentPiece.type,
    x: currentPiece.x,
    y: ghostY,
    rotation: currentPiece.rotation,
  };
};

/**
 * Lock piece to playfield
 */
const lockPiece = (
  playfield: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number }
): (TetrominoType | null)[][] => {
  const newPlayfield = playfield.map((row) => [...row]);
  const cells = getPieceCells(piece.type, piece.x, piece.y, piece.rotation);

  for (const cell of cells) {
    // Only lock blocks that are within the playfield
    if (cell.y >= 0 && cell.y < GRID_HEIGHT && cell.x >= 0 && cell.x < GRID_WIDTH) {
      newPlayfield[cell.y][cell.x] = piece.type;
    }
  }

  return newPlayfield;
};

/**
 * Clear full lines and return new playfield and number of lines cleared
 */
const clearLines = (playfield: (TetrominoType | null)[][]): {
  newPlayfield: (TetrominoType | null)[][];
  linesCleared: number;
} => {
  const newPlayfield: (TetrominoType | null)[][] = [];
  let linesCleared = 0;

  // Check each row from bottom to top
  for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
    const isFullLine = playfield[row].every((cell) => cell !== null);

    if (!isFullLine) {
      // Keep this row
      newPlayfield.unshift([...playfield[row]]);
    } else {
      // Skip this row (it's full, so we clear it)
      linesCleared++;
    }
  }

  // Add empty rows at the top to maintain GRID_HEIGHT
  while (newPlayfield.length < GRID_HEIGHT) {
    newPlayfield.unshift(Array(GRID_WIDTH).fill(null));
  }

  return { newPlayfield, linesCleared };
};

/**
 * Check if piece can move down (is it locked?)
 */
const canMoveDown = (
  playfield: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number }
): boolean => {
  return canPlacePiece(playfield, piece.type, piece.x, piece.y + 1, piece.rotation);
};

/**
 * Spawn new piece
 */
const spawnNewPiece = (
  nextPieces: TetrominoType[],
  playfield: (TetrominoType | null)[][]
): {
  currentPiece: { type: TetrominoType; x: number; y: number; rotation: number };
  nextPieces: TetrominoType[];
  gameOver: boolean;
} => {
  const newNextPieces = [...nextPieces];
  const newPieceType = newNextPieces.shift()!;
  const spawnPos = getSpawnPosition(newPieceType);

  // Add new piece to queue
  newNextPieces.push(...generateNextPieces(1));

  // Check if game is over (spawn position is blocked)
  const gameOver = !canPlacePiece(playfield, newPieceType, spawnPos.x, spawnPos.y, 0);

  return {
    currentPiece: {
      type: newPieceType,
      x: spawnPos.x,
      y: spawnPos.y,
      rotation: 0,
    },
    nextPieces: newNextPieces,
    gameOver,
  };
};

/**
 * Hook for game logic operations
 */
export const useGameLogic = () => {
  const lockPieceToPlayfield = useCallback((gameState: GameState): GameState | null => {
    if (!gameState.currentPiece) return null;

    // Lock the piece
    const newPlayfield = lockPiece(gameState.playfield, gameState.currentPiece);

    // Clear lines
    const { newPlayfield: clearedPlayfield, linesCleared } = clearLines(newPlayfield);

    // Calculate new score and level
    const lineScores = [0, 100, 300, 500, 800]; // Score for 0, 1, 2, 3, 4 lines
    const scoreIncrease = lineScores[linesCleared] * gameState.level;
    const newScore = gameState.score + scoreIncrease;
    const newLines = gameState.lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;

    // Spawn new piece
    const { currentPiece, nextPieces, gameOver } = spawnNewPiece(gameState.nextPieces, clearedPlayfield);

    if (gameOver) {
      // Game over - keep current state but mark as game over
      return {
        ...gameState,
        playfield: clearedPlayfield,
        score: newScore,
        lines: newLines,
        level: newLevel,
        topScore: Math.max(gameState.topScore, newScore),
        isGameOver: true,
        currentPiece: null, // Clear current piece on game over
        ghostPiece: null,
      };
    }

    const ghostPiece = calculateGhostPiece(clearedPlayfield, currentPiece);

    return {
      ...gameState,
      playfield: clearedPlayfield,
      currentPiece,
      ghostPiece,
      nextPieces,
      score: newScore,
      lines: newLines,
      level: newLevel,
      topScore: Math.max(gameState.topScore, newScore),
    };
  }, []);

  const movePiece = useCallback(
    (
      gameState: GameState,
      direction: 'left' | 'right' | 'down',
      shouldLock: boolean = false
    ): GameState | null => {
      if (!gameState.currentPiece) return null;

      const { currentPiece } = gameState;
      let newX = currentPiece.x;
      let newY = currentPiece.y;

      if (direction === 'left') {
        newX = currentPiece.x - 1;
      } else if (direction === 'right') {
        newX = currentPiece.x + 1;
      } else if (direction === 'down') {
        newY = currentPiece.y + 1;
      }

      // Check if move is valid
      if (canPlacePiece(gameState.playfield, currentPiece.type, newX, newY, currentPiece.rotation)) {
        const updatedPiece = {
          ...currentPiece,
          x: newX,
          y: newY,
        };

        const ghostPiece = calculateGhostPiece(gameState.playfield, updatedPiece);

        return {
          ...gameState,
          currentPiece: updatedPiece,
          ghostPiece,
        };
      } else if (direction === 'down' && shouldLock) {
        // Piece can't move down, lock it
        return lockPieceToPlayfield(gameState);
      }

      return null;
    },
    [lockPieceToPlayfield]
  );

  const rotatePiece = useCallback(
    (gameState: GameState, clockwise: boolean = true): GameState | null => {
      if (!gameState.currentPiece) return null;

      const { currentPiece } = gameState;
      const newRotation = clockwise
        ? (currentPiece.rotation + 1) % 4
        : (currentPiece.rotation + 3) % 4;

      // Wall-kick offsets: try (0,0), then horizontal, then vertical
      const kickOffsets = [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -1 },
      ];

      // Try each kick offset
      for (const offset of kickOffsets) {
        const newX = currentPiece.x + offset.x;
        const newY = currentPiece.y + offset.y;

        if (canPlacePiece(gameState.playfield, currentPiece.type, newX, newY, newRotation)) {
          const updatedPiece = {
            ...currentPiece,
            x: newX,
            y: newY,
            rotation: newRotation,
          };

          const ghostPiece = calculateGhostPiece(gameState.playfield, updatedPiece);

          return {
            ...gameState,
            currentPiece: updatedPiece,
            ghostPiece,
          };
        }
      }

      // All rotation attempts failed
      return null;
    },
    []
  );

  const flipPiece = useCallback(
    (gameState: GameState): GameState | null => {
      if (!gameState.currentPiece) return null;

      // For flipping, we need to rotate 180 degrees and then flip horizontally
      // Or we can use a combination of rotations
      // Simple approach: rotate 180 degrees (2 rotations)
      const currentRotation = gameState.currentPiece.rotation;
      const newRotation = (currentRotation + 2) % 4;

      // Try to place flipped piece
      if (canPlacePiece(gameState.playfield, gameState.currentPiece.type, gameState.currentPiece.x, gameState.currentPiece.y, newRotation)) {
        const updatedPiece = {
          ...gameState.currentPiece,
          rotation: newRotation,
        };

        const ghostPiece = calculateGhostPiece(gameState.playfield, updatedPiece);

        return {
          ...gameState,
          currentPiece: updatedPiece,
          ghostPiece,
        };
      }

      // Try wall kicks (shift left/right if flip fails)
      for (const offset of [-1, 1, -2, 2]) {
        const newX = gameState.currentPiece.x + offset;
        if (canPlacePiece(gameState.playfield, gameState.currentPiece.type, newX, gameState.currentPiece.y, newRotation)) {
          const updatedPiece = {
            ...gameState.currentPiece,
            x: newX,
            rotation: newRotation,
          };

          const ghostPiece = calculateGhostPiece(gameState.playfield, updatedPiece);

          return {
            ...gameState,
            currentPiece: updatedPiece,
            ghostPiece,
          };
        }
      }

      return null;
    },
    []
  );

  const checkAndLockPiece = useCallback(
    (gameState: GameState): GameState | null => {
      if (!gameState.currentPiece) return null;

      // Check if piece can move down
      if (!canMoveDown(gameState.playfield, gameState.currentPiece)) {
        return lockPieceToPlayfield(gameState);
      }

      return null;
    },
    [lockPieceToPlayfield]
  );

  return {
    movePiece,
    rotatePiece,
    flipPiece,
    lockPieceToPlayfield,
    checkAndLockPiece,
    canPlacePiece,
    calculateGhostPiece,
    getRotatedBlocks,
    getPieceCells,
  };
};

