import { useEffect, useRef, useCallback } from 'react';
import { GameFrame, TopStatusBar, MainArea, BottomSafeArea, GameOverOverlay } from './components';
import { useGameState, useKeyboardControls, useAutoDrop } from './hooks';
import './styles.css';

function App() {
  const { gameState, updateGameState, resetGame } = useGameState();

  // Update ghost piece whenever current piece changes
  // Note: This is handled in rotatePiece and movePiece, so we don't need to update here
  // to avoid conflicts with rotation updates

  // Handle restart
  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Enable keyboard controls (disabled when game over)
  useKeyboardControls({
    gameState,
    updateGameState,
    isPaused: gameState.isGameOver,
    onRestart: handleRestart,
  });

  // Enable auto-drop (disabled when game over)
  useAutoDrop({
    gameState,
    updateGameState,
    isPaused: gameState.isGameOver,
  });

  // Make sure the game container can receive focus for keyboard events
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the container on mount to enable keyboard input
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div ref={containerRef} tabIndex={0} style={{ outline: 'none', width: '100%', height: '100%', position: 'relative' }}>
      <GameFrame>
        <TopStatusBar
          lines={gameState.lines}
          level={gameState.level}
          score={gameState.score}
          topScore={gameState.topScore}
        />
        <MainArea
          holdPiece={gameState.holdPiece}
          nextPieces={gameState.nextPieces}
          playfield={gameState.playfield}
          currentPiece={gameState.currentPiece}
          ghostPiece={gameState.ghostPiece}
        />
        <BottomSafeArea />
      </GameFrame>
      {gameState.isGameOver && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'auto' }}>
          <GameOverOverlay onRestart={handleRestart} />
        </div>
      )}
    </div>
  );
}

export default App;

