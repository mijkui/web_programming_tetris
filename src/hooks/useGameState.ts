import { useState, useCallback } from 'react';
import { GameState } from '../types';
import { createInitialGameState } from '../mockData';

/**
 * Hook for managing game state
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const updateGameState = useCallback((newState: Partial<GameState> | GameState) => {
    setGameState((prev) => {
      // If it's a full GameState, use it directly; otherwise merge
      if ('currentPiece' in newState && 'playfield' in newState && 'nextPieces' in newState) {
        return newState as GameState;
      }
      return { ...prev, ...newState };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  return {
    gameState,
    updateGameState,
    resetGame,
  };
};

