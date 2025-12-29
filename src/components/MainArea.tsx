import React from 'react';
import { HoldPanel } from './HoldPanel';
import { Playfield } from './Playfield';
import { NextPanel } from './NextPanel';
import { TetrominoType } from '../types';
import './MainArea.css';

interface MainAreaProps {
  holdPiece: TetrominoType | null;
  nextPieces: TetrominoType[];
  playfield: (TetrominoType | null)[][];
  currentPiece: { type: TetrominoType; x: number; y: number; rotation: number } | null;
  ghostPiece: { type: TetrominoType; x: number; y: number; rotation: number } | null;
}

export const MainArea: React.FC<MainAreaProps> = ({
  holdPiece,
  nextPieces,
  playfield,
  currentPiece,
  ghostPiece,
}) => {
  return (
    <div className="main-area" style={{ position: 'relative' }}>
      <HoldPanel piece={holdPiece} />
      <Playfield
        playfield={playfield}
        currentPiece={currentPiece}
        ghostPiece={ghostPiece}
      />
      <NextPanel pieces={nextPieces} />
    </div>
  );
};

