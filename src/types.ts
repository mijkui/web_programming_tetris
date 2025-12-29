export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface GameState {
  lines: number;
  level: number;
  score: number;
  topScore: number;
  holdPiece: TetrominoType | null;
  nextPieces: TetrominoType[];
  playfield: (TetrominoType | null)[][];
  currentPiece: {
    type: TetrominoType;
    x: number;
    y: number;
    rotation: number;
  } | null;
  ghostPiece: {
    type: TetrominoType;
    x: number;
    y: number;
    rotation: number;
  } | null;
  isGameOver: boolean;
}

export interface TetrominoShape {
  blocks: boolean[][];
  color: string;
}

export const TETROMINO_SHAPES: Record<TetrominoType, TetrominoShape> = {
  I: {
    blocks: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
    color: '#00f0f0', // Cyan
  },
  O: {
    blocks: [
      [true, true],
      [true, true],
    ],
    color: '#f0f000', // Yellow
  },
  T: {
    blocks: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    color: '#a000f0', // Purple
  },
  S: {
    blocks: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    color: '#00f000', // Green
  },
  Z: {
    blocks: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    color: '#f00000', // Red
  },
  J: {
    blocks: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    color: '#0000f0', // Blue
  },
  L: {
    blocks: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
    color: '#f0a000', // Orange
  },
};

