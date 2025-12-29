import React from 'react';
import { TETROMINO_SHAPES, TetrominoType } from '../types';
import './TetrominoPreview.css';

interface TetrominoPreviewProps {
  type: TetrominoType;
  scale?: number;
  opacity?: number;
}

export const TetrominoPreview: React.FC<TetrominoPreviewProps> = ({
  type,
  scale = 0.6,
  opacity = 1,
}) => {
  const shape = TETROMINO_SHAPES[type];
  const blockSize = 16 * scale;

  return (
    <div
      className="tetromino-preview"
      style={{
        width: `${shape.blocks[0].length * blockSize}px`,
        height: `${shape.blocks.length * blockSize}px`,
        opacity,
      }}
    >
      {shape.blocks.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell) return null;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="preview-block"
              style={{
                position: 'absolute',
                left: `${colIndex * blockSize}px`,
                top: `${rowIndex * blockSize}px`,
                width: `${blockSize - 2}px`,
                height: `${blockSize - 2}px`,
                backgroundColor: shape.color,
              }}
            />
          );
        })
      )}
    </div>
  );
};

