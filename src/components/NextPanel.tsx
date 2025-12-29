import React from 'react';
import { TetrominoPreview } from './TetrominoPreview';
import { TetrominoType } from '../types';
import './NextPanel.css';

interface NextPanelProps {
  pieces: TetrominoType[];
}

export const NextPanel: React.FC<NextPanelProps> = ({ pieces }) => {
  return (
    <div className="next-panel">
      <div className="next-panel-label">NEXT</div>
      <div className="next-panel-pieces">
        {pieces.slice(0, 4).map((piece, index) => (
          <div key={index} className="next-panel-piece">
            <TetrominoPreview type={piece} />
          </div>
        ))}
      </div>
    </div>
  );
};

