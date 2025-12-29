import React from 'react';
import { TETROMINO_SHAPES, TetrominoType } from '../types';
import { getRotatedBlocks } from '../hooks/useGameLogic';
import './Playfield.css';

interface PlayfieldProps {
  playfield: (TetrominoType | null)[][];
  currentPiece: { type: TetrominoType; x: number; y: number; rotation: number } | null;
  ghostPiece: { type: TetrominoType; x: number; y: number; rotation: number } | null;
}

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

export const Playfield: React.FC<PlayfieldProps> = ({
  playfield,
  currentPiece,
  ghostPiece,
}) => {
  // Create a merged grid that includes placed blocks, current piece, and ghost piece
  const getCellContent = (row: number, col: number): { type: TetrominoType | null; isGhost: boolean } => {
    // Check placed blocks first
    if (playfield[row]?.[col]) {
      return { type: playfield[row][col], isGhost: false };
    }

    // Check current piece (using rotated shape)
    if (currentPiece) {
      const blocks = getRotatedBlocks(currentPiece.type, currentPiece.rotation);
      const pieceRow = row - currentPiece.y;
      const pieceCol = col - currentPiece.x;
      if (
        pieceRow >= 0 &&
        pieceRow < blocks.length &&
        pieceCol >= 0 &&
        pieceCol < blocks[0].length &&
        blocks[pieceRow][pieceCol]
      ) {
        return { type: currentPiece.type, isGhost: false };
      }
    }

    // Check ghost piece (using rotated shape)
    if (ghostPiece) {
      const blocks = getRotatedBlocks(ghostPiece.type, ghostPiece.rotation);
      const pieceRow = row - ghostPiece.y;
      const pieceCol = col - ghostPiece.x;
      if (
        pieceRow >= 0 &&
        pieceRow < blocks.length &&
        pieceCol >= 0 &&
        pieceCol < blocks[0].length &&
        blocks[pieceRow][pieceCol]
      ) {
        return { type: ghostPiece.type, isGhost: true };
      }
    }

    return { type: null, isGhost: false };
  };

  return (
    <div className="playfield-container" style={{ position: 'relative' }}>
      <div className="playfield">
        {/* Grid background */}
        <div className="playfield-grid">
          {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
            Array.from({ length: GRID_WIDTH }).map((_, col) => (
              <div key={`grid-${row}-${col}`} className="grid-cell" />
            ))
          )}
        </div>

        {/* All blocks (placed, current, ghost) */}
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const { type, isGhost } = getCellContent(row, col);
            if (!type) return null;

            const shape = TETROMINO_SHAPES[type];
            return (
              <div
                key={`block-${row}-${col}`}
                className={`playfield-block ${isGhost ? 'ghost' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${(col / GRID_WIDTH) * 100}%`,
                  top: `${(row / GRID_HEIGHT) * 100}%`,
                  width: `${100 / GRID_WIDTH}%`,
                  height: `${100 / GRID_HEIGHT}%`,
                  backgroundColor: shape.color,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

