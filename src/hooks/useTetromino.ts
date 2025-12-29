import { useMemo } from 'react';
import { TETROMINO_SHAPES, TetrominoType } from '../types';

/**
 * Hook for tetromino-related utilities
 */
export const useTetromino = () => {
  const getTetrominoShape = useMemo(() => {
    return (type: TetrominoType) => TETROMINO_SHAPES[type];
  }, []);

  const getTetrominoColor = useMemo(() => {
    return (type: TetrominoType) => TETROMINO_SHAPES[type].color;
  }, []);

  return {
    getTetrominoShape,
    getTetrominoColor,
  };
};

