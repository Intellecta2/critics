/**
 * SearchPage.jsx — Content search with advanced filters
 *
 * Features:
 * - Text search by title or genre
 * - Advanced filter panel (score, type, year)
 * - Active filter tags with clear-all
 * - Popular search suggestions when empty
 * - Results grid with ContentCards
 *
 * Props:
 *   - onCardClick (function): Called when a card is clicked
 *   - watchlist (array): User's watchlist IDs
 *   - allContent (array): All content from API
 */

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';

const SearchPage = ({ onCardClick, watchlist, allContent, onToggleWatchlist, onPlayDirect }) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    score: 0,
    type: '',
    year: 0,
  });

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Combined filtering: text search + advanced filters
  const filteredContent = allContent.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.genre.toLowerCase().includes(query.toLowerCase());

    const matchesScore = activeFilters.score === 0 || item.critics_score >= activeFilters.score;
    const matchesType = activeFilters.type === '' || item.content_type === activeFilters.type;
    const matchesYear = activeFilters.year === 0 || item.year >= activeFilters.year;

    return matchesQuery && matchesScore && matchesType && matchesYear;
  });

  const hasActiveFilters =
    activeFilters.score > 0 || activeFilters.type !== '' || activeFilters.year > 0;

  return (
    <main className="page-container">
      <h1 className="page-title">Precise Search</h1>

      {/* Search bar + filter toggle */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search titles or genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          id="search-input"
        />
        <button
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={`filter-toggle-btn ${
            isFilterOpen ? 'filter-toggle-btn--active' : 'filter-toggle-btn--inactive'
          }`}
          aria-label="Toggle Advanced Filters"
        >
          <Filter style={{ width: 28, height: 28 }} />
        </button>
      </div>

      {/* Advanced filter panel (collapsible) */}
      {isFilterOpen && (
        <AdvancedFilterPanel
          filters={activeFilters}
          setFilters={setActiveFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={applyFilters}
        />
      )}

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters__label">Active Filters:</span>
          {activeFilters.score > 0 && (
            <span className="active-filters__tag">{activeFilters.score}%+ Score</span>
          )}
          {activeFilters.type !== '' && (
            <span className="active-filters__tag">{activeFilters.type}</span>
          )}
          {activeFilters.year > 0 && (
            <span className="active-filters__tag">{activeFilters.year}+ Year</span>
          )}
          <button
            className="active-filters__clear"
            onClick={() => setActiveFilters({ score: 0, type: '', year: 0 })}
          >
            <X style={{ width: 20, height: 20 }} /> Clear All
          </button>
        </div>
      )}

      {/* Popular searches (shown when query is empty) */}
      {query.length === 0 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 className="popular-searches__title" style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-3)' }}>
            Popular Searches
          </h2>
          <div className="popular-searches__tags">
            {[
              'Sci-Fi',
              'Action',
              'Drama',
              'Crime',
              'Adventure',
              'Animation',
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="popular-tag"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredContent.length === 0 && (
        <div className="empty-state">
          <Search className="empty-state__icon" />
          <p className="empty-state__title">No results match your search and filters.</p>
          <p className="empty-state__subtitle">
            Try clearing a filter or simplifying your query.
          </p>
        </div>
      )}

      {/* Search results */}
      {filteredContent.length > 0 && (
        <>
          <h2 className="search-results-title">
            {query || hasActiveFilters ? `Search Results (${filteredContent.length})` : `All Movies & Series (${filteredContent.length})`}
          </h2>
          <div className="content-grid">
            {filteredContent.map((item) => (
              <ContentCard
                key={item._id}
                content={item}
                onClick={onCardClick}
                isAdded={watchlist.includes(item._id)}
                onToggleWatchlist={onToggleWatchlist}
                onPlayDirect={onPlayDirect}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default SearchPage;
