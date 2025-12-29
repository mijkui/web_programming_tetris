import React from 'react';
import './BottomSafeArea.css';

export const BottomSafeArea: React.FC = () => {
  return (
    <div className="bottom-safe-area">
      <div className="hint-bar">
        <span className="hint-text">← → Move • ↓ Soft Drop • ↑/W/X Rotate (90°) • Z Counter-rotate</span>
      </div>
    </div>
  );
};

