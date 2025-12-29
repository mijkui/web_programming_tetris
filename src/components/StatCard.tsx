import React from 'react';
import './StatCard.css';

interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  const formattedValue = value.toLocaleString('en-US');

  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value tabular-nums">{formattedValue}</div>
    </div>
  );
};

