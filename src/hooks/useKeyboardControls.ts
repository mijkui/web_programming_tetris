import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '../types';
import { useGameLogic } from './useGameLogic';

interface UseKeyboardControlsProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState> | GameState) => void;
  isPaused?: boolean;
  onRestart?: () => void;
}

/**
 * Hook for keyboard controls with repeat on hold
 */
export const useKeyboardControls = ({
  gameState,
  updateGameState,
  isPaused = false,
  onRestart,
}: UseKeyboardControlsProps) => {
  const { movePiece, rotatePiece, checkAndLockPiece } = useGameLogic();
  const keysPressed = useRef<Set<string>>(new Set());
  const repeatTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const initialMoveTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const gameStateRef = useRef(gameState);

  // Keep gameStateRef updated
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const handleMove = useCallback(
    (direction: 'left' | 'right' | 'down') => {
      if (isPaused) return;

      const currentState = gameStateRef.current;
      const newState = movePiece(currentState, direction, direction === 'down');
      if (newState) {
        updateGameState(newState);
        
        // After moving down, check if piece should lock
        if (direction === 'down') {
          setTimeout(() => {
            const lockedState = checkAndLockPiece(newState);
            if (lockedState) {
              updateGameState(lockedState);
            }
          }, 0);
        }
      }
    },
    [movePiece, updateGameState, isPaused, checkAndLockPiece]
  );

  const handleRotate = useCallback(
    (clockwise: boolean) => {
      if (isPaused) return;

      const currentState = gameStateRef.current;
      if (!currentState.currentPiece) return;

      const newState = rotatePiece(currentState, clockwise);
      if (newState) {
        updateGameState(newState);
      }
    },
    [rotatePiece, updateGameState, isPaused]
  );


  const startRepeat = useCallback(
    (key: string, direction: 'left' | 'right' | 'down') => {
      // Clear any existing timer for this key
      const existingTimer = repeatTimers.current.get(key);
      if (existingTimer) {
        clearInterval(existingTimer);
      }

      // Start repeating after initial delay
      const timer = setInterval(() => {
        handleMove(direction);
      }, 50); // Fast repeat when holding

      repeatTimers.current.set(key, timer);
    },
    [handleMove]
  );

  const stopRepeat = useCallback((key: string) => {
    const timer = repeatTimers.current.get(key);
    if (timer) {
      clearInterval(timer);
      repeatTimers.current.delete(key);
    }

    const initialTimer = initialMoveTimers.current.get(key);
    if (initialTimer) {
      clearTimeout(initialTimer);
      initialMoveTimers.current.delete(key);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
      }

      // Ignore if key is already pressed or game is paused
      if (keysPressed.current.has(event.key) || isPaused) {
        return;
      }

      keysPressed.current.add(event.key);

      let direction: 'left' | 'right' | 'down' | null = null;
      let shouldRotate = false;
      let rotateClockwise = true;

      // Handle restart keys (R or Enter) - works even when paused/game over
      if ((event.key === 'r' || event.key === 'R' || event.key === 'Enter') && onRestart) {
        onRestart();
        return;
      }

      // Ignore movement/rotation keys when paused/game over
      if (isPaused) {
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        direction = 'left';
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        direction = 'right';
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        direction = 'down';
      } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        // Up key rotates clockwise 90 degrees
        shouldRotate = true;
        rotateClockwise = true;
      } else if (event.key === 'x' || event.key === 'X') {
        shouldRotate = true;
        rotateClockwise = true;
      } else if (event.key === 'z' || event.key === 'Z') {
        shouldRotate = true;
        rotateClockwise = false;
      }

      if (direction) {
        // Immediate move on first press
        handleMove(direction);

        // Set up initial delay before starting repeat
        const initialTimer = setTimeout(() => {
          startRepeat(event.key, direction!);
        }, 200); // 200ms delay before starting to repeat

        initialMoveTimers.current.set(event.key, initialTimer);
      } else if (shouldRotate) {
        // Rotate immediately (no repeat for rotation)
        handleRotate(rotateClockwise);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key);
      stopRepeat(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      // Clean up all timers
      repeatTimers.current.forEach((timer) => clearInterval(timer));
      initialMoveTimers.current.forEach((timer) => clearTimeout(timer));
      repeatTimers.current.clear();
      initialMoveTimers.current.clear();
    };
  }, [handleMove, handleRotate, startRepeat, stopRepeat, isPaused]);
};

