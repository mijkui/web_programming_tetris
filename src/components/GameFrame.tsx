import React from 'react';
import './GameFrame.css';

interface GameFrameProps {
  children: React.ReactNode;
}

export const GameFrame: React.FC<GameFrameProps> = ({ children }) => {
  return (
    <div className="game-frame">
      <div className="game-container">{children}</div>
    </div>
  );
};

