import React from 'react';
import './ScoreCard.css';

interface ScoreCardProps {
  score: number;
  topScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, topScore }) => {
  const formattedScore = score.toLocaleString('en-US');
  const formattedTopScore = topScore.toLocaleString('en-US');

  return (
    <div className="score-card">
      <div className="score-card-header">
        <span className="crown-icon">👑</span>
        <span className="top-score-text">TOP {formattedTopScore}</span>
      </div>
      <div className="score-card-value tabular-nums">{formattedScore}</div>
    </div>
  );
};

