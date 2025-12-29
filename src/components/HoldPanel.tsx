import React from 'react';
import { TetrominoPreview } from './TetrominoPreview';
import { TetrominoType } from '../types';
import './HoldPanel.css';

interface HoldPanelProps {
  piece: TetrominoType | null;
}

export const HoldPanel: React.FC<HoldPanelProps> = ({ piece }) => {
  return (
    <div className="hold-panel">
      <div className="hold-panel-label">HOLD</div>
      <div className="hold-panel-preview">
        {piece ? <TetrominoPreview type={piece} /> : null}
      </div>
    </div>
  );
};

