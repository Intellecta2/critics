/**
 * CriticsMeter.jsx — Circular score gauge with user score
 *
 * Renders an SVG ring that fills proportionally to the critics score,
 * color-coded green/yellow/red. Also displays the community user score.
 *
 * Props:
 *   - score (number): Critics score 0-100
 *   - userScore (number): User/community score 0-100
 */

import React from 'react';
import { Users } from 'lucide-react';

// Returns the CSS class for score coloring
export const getScoreColorClass = (score) => {
  if (score >= 90) return 'score-green';
  if (score >= 80) return 'score-yellow';
  return 'score-red';
};

// Returns the SVG stroke class for score coloring
export const getStrokeColorClass = (score) => {
  if (score >= 90) return 'stroke-green';
  if (score >= 80) return 'stroke-yellow';
  return 'stroke-red';
};

const CriticsMeter = ({ score, userScore }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="critics-meter">
      {/* SVG Ring Gauge */}
      <div className="critics-meter__ring">
        <svg className="critics-meter__svg" viewBox="0 0 49 49">
          {/* Background track circle */}
          <circle
            stroke="#374151"
            strokeWidth="5"
            fill="transparent"
            r={radius}
            cx="24.5"
            cy="24.5"
          />
          {/* Animated progress circle */}
          <circle
            className={getStrokeColorClass(score)}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="24.5"
            cy="24.5"
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
        </svg>
        <span className={`critics-meter__score-text ${getScoreColorClass(score)}`}>
          {score}%
        </span>
      </div>

      {/* Labels */}
      <div>
        <div className="critics-meter__label">Critics' Consensus</div>
        <div className="critics-meter__user-score">
          <Users style={{ width: 16, height: 16, color: '#a855f7' }} />
          User Score:
          <span className="critics-meter__user-score-value">{userScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default CriticsMeter;
