/**
 * AdvancedFilterPanel.jsx — Search filter panel with score, type, and year filters
 *
 * Renders a panel with filter chip buttons for:
 * - Minimum critic score (90%+, 85%+, 80%+)
 * - Content type (Movie, Series, Documentary)
 * - Release year (2024, 2023, 2022)
 *
 * Props:
 *   - filters (object): Current filter state { score, type, year }
 *   - setFilters (function): State setter for filters
 *   - onClose (function): Close the filter panel
 *   - onApply (function): Apply filters and close
 */

import React from 'react';
import { X, Film, Monitor, BookOpen } from 'lucide-react';

const AdvancedFilterPanel = ({ filters, setFilters, onClose, onApply }) => {
  const filterOptions = {
    score: [90, 85, 80],
    type: ['Movie', 'Series', 'Documentary'],
    year: [2020, 2010, 2000],
  };

  const handleScoreChange = (score) => {
    setFilters((prev) => ({
      ...prev,
      score: prev.score === score ? 0 : score,
    }));
  };

  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type === type ? '' : type,
    }));
  };

  const handleYearChange = (year) => {
    setFilters((prev) => ({
      ...prev,
      year: prev.year === year ? 0 : year,
    }));
  };

  // Map content types to icons
  const typeIcons = {
    Movie: Film,
    Series: Monitor,
    Documentary: BookOpen,
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__header">
        Advanced Filters
        <button className="filter-panel__close" onClick={onClose}>
          <X style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Minimum Critic Score */}
      <div className="filter-panel__section">
        <p className="filter-panel__label">Minimum Critic Score</p>
        <div className="filter-panel__options">
          {filterOptions.score.map((score) => (
            <button
              key={score}
              onClick={() => handleScoreChange(score)}
              className={`filter-chip ${
                filters.score === score ? 'filter-chip--active' : 'filter-chip--inactive'
              }`}
            >
              {score}%+
            </button>
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div className="filter-panel__section">
        <p className="filter-panel__label">Content Type</p>
        <div className="filter-panel__options">
          {filterOptions.type.map((type) => {
            const Icon = typeIcons[type];
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`filter-chip ${
                  filters.type === type ? 'filter-chip--active' : 'filter-chip--inactive'
                }`}
              >
                <Icon style={{ width: 20, height: 20 }} />
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Release Year */}
      <div className="filter-panel__section">
        <p className="filter-panel__label">Release Year</p>
        <div className="filter-panel__options">
          {filterOptions.year.map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`filter-chip ${
                filters.year === year ? 'filter-chip--active' : 'filter-chip--inactive'
              }`}
            >
              {year}+
            </button>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <button className="filter-panel__apply" onClick={onApply}>
        Apply Filters & Search
      </button>
    </div>
  );
};

export default AdvancedFilterPanel;
