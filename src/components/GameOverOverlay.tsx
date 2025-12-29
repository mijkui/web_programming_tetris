import React from 'react';
import './GameOverOverlay.css';

interface GameOverOverlayProps {
  onRestart: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <div className="game-over-title">TETRIS</div>
        <div className="game-over-label">GAME OVER</div>
        <button className="game-over-restart-button" onClick={onRestart}>
          RESTART
        </button>
        <div className="game-over-hint">Press R or Enter to restart</div>
      </div>
    </div>
  );
};

