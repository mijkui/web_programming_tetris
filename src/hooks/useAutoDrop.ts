import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '../types';
import { useGameLogic } from './useGameLogic';

interface UseAutoDropProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState> | GameState) => void;
  isPaused?: boolean;
}

/**
 * Hook for automatic piece dropping based on level
 */
export const useAutoDrop = ({
  gameState,
  updateGameState,
  isPaused = false,
}: UseAutoDropProps) => {
  const { movePiece, checkAndLockPiece } = useGameLogic();
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(gameState);

  // Keep gameStateRef updated
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (isPaused || !gameState.currentPiece) {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      return;
    }

    // Calculate drop speed based on level (faster at higher levels)
    // Formula: 1000ms - (level * 50ms), minimum 100ms
    const dropInterval = Math.max(100, 1000 - gameState.level * 50);

    const dropPiece = () => {
      const currentState = gameStateRef.current;
      if (!currentState.currentPiece) return;

      const newState = movePiece(currentState, 'down', true);
      if (newState) {
        updateGameState(newState);

        // Check if piece should lock after auto-drop
        setTimeout(() => {
          const lockedState = checkAndLockPiece(newState);
          if (lockedState) {
            updateGameState(lockedState);
          }
        }, 0);
      } else {
        // Can't move down, lock the piece
        const lockedState = checkAndLockPiece(currentState);
        if (lockedState) {
          updateGameState(lockedState);
        }
      }
    };

    dropTimerRef.current = setInterval(dropPiece, dropInterval);

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
    };
  }, [gameState.level, gameState.currentPiece, isPaused, movePiece, checkAndLockPiece, updateGameState]);
};

