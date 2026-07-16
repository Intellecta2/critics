/**
 * ContentCard.jsx — Poster card with hover overlay
 *
 * Displays a content poster with a hover effect that reveals
 * the title, score, year, and a play button.
 *
 * Props:
 *   - content (object): Content data with _id, title, critics_score, year
 *   - onClick (function): Called with content._id when card is clicked
 *   - isAdded (boolean): Whether this item is in the user's watchlist
 */

import React from 'react';
import { Play, Star, Bookmark, Plus } from 'lucide-react';
import { getScoreColorClass } from './CriticsMeter';

const ContentCard = ({ content, onClick, isAdded, onToggleWatchlist, onPlayDirect }) => {
  const scoreClass = getScoreColorClass(content.critics_score);

  return (
    <div
      className="content-card"
      onClick={() => onClick(content._id)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${content.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(content._id)}
    >
      {/* Poster image */}
      <div
        className="content-card__poster"
        style={{
          backgroundImage: `url(${content.poster_url || 'https://placehold.co/300x450/111827/FFFFFF?text=No+Poster'})`,
        }}
      />

      {/* Watchlist bookmark indicator */}
      {isAdded && <Bookmark className="content-card__bookmark" />}

      {/* Hover overlay with details */}
      <div className="content-card__overlay">
        <div className="content-card__info">
          <h3 className="content-card__title">{content.title}</h3>
          <div className="content-card__meta">
            <span className={`content-card__score ${scoreClass}`}>
              <Star style={{ width: 20, height: 20, fill: 'currentColor' }} />
              {content.critics_score}%
            </span>
            <span className="content-card__year">{content.year}</span>
          </div>
          <div className="content-card__actions" style={{ display: 'flex', gap: 'var(--space-2)', width: '100%' }}>
            <button 
              className="content-card__play-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onPlayDirect) onPlayDirect(content);
              }}
              style={{ flexGrow: 1 }}
            >
              <Play style={{ width: 16, height: 16, fill: 'currentColor' }} /> Play
            </button>
            <button 
              className={`content-card__watchlist-btn ${isAdded ? 'content-card__watchlist-btn--added' : 'content-card__watchlist-btn--add'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleWatchlist) onToggleWatchlist(content._id);
              }}
              aria-label={isAdded ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isAdded ? <Bookmark style={{ width: 16, height: 16, fill: 'currentColor' }} /> : <Plus style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
