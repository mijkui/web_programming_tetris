import React from 'react';
import { StatCard } from './StatCard';
import { ScoreCard } from './ScoreCard';
import './TopStatusBar.css';

interface TopStatusBarProps {
  lines: number;
  level: number;
  score: number;
  topScore: number;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  lines,
  level,
  score,
  topScore,
}) => {
  return (
    <div className="top-status-bar">
      <StatCard label="LINES" value={lines} />
      <StatCard label="LEVEL" value={level} />
      <ScoreCard score={score} topScore={topScore} />
    </div>
  );
};

