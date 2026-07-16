/**
 * ContentDetailModal.jsx — Full detail overlay for a content item
 *
 * Displays a rich modal with:
 * - Hero background image with gradient overlay
 * - Title, year, duration, and recommended badge
 * - Play Now and watchlist toggle buttons
 * - CriticsMeter score gauge
 * - Synopsis, director, cast, genre
 * - Critics' Consensus block with source transparency
 * - Episodes list (for series-type content)
 * - Technical specs sidebar
 *
 * Props:
 *   - content (object|null): Full content object from API, or null while loading
 *   - onClose (function): Close the modal
 *   - isAddedToWatchlist (boolean): Whether content is in user's watchlist
 *   - onToggleWatchlist (function): Toggle watchlist state
 *   - onPlay (function): Trigger video playback
 */

import React, { useEffect, useState } from 'react';
import { Play, Plus, Bookmark, X, Star, ChevronRight, Youtube } from 'lucide-react';
import CriticsMeter, { getScoreColorClass } from './CriticsMeter';
import LoadingSpinner from './LoadingSpinner';

// Mock critic sources (in production, these would come from the API)
const MOCK_CRITIC_SOURCES = [
  { name: 'The Global Critic', score: 95, logo: 'GC' },
  { name: 'Review Digest', score: 92, logo: 'RD' },
  { name: 'Film Today', score: 90, logo: 'FT' },
];

// Mock episodes (in production, these would be a sub-collection or embedded array)
const DUMMY_EPISODES = [
  {
    title: 'The First Spark',
    duration: '45m',
    score: 95,
    summary:
      "A sudden temporal anomaly disrupts the city's power grid, catching the attention of Dr. Aris Thorne.",
  },
  {
    title: 'Fractured Mirror',
    duration: '48m',
    score: 92,
    summary:
      "Thorne uses his prototype device to witness a murder that hasn't officially occurred, complicating the timeline.",
  },
  {
    title: 'Consensus Zero',
    duration: '50m',
    score: 96,
    summary:
      'The conspiracy is revealed. Thorne must choose between preventing the past or saving the future.',
  },
];

const ContentDetailModal = ({
  content,
  onClose,
  isAddedToWatchlist,
  onToggleWatchlist,
  onPlay,
  onPlayTrailer,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!content);
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <div className="modal-overlay" style={{ alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  const AddRemoveIcon = isAddedToWatchlist ? Bookmark : Plus;
  const watchlistText = isAddedToWatchlist ? 'Remove from List' : 'Add to List';
  const isSeries = content.content_type === 'Series';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header with background image ───────────────── */}
        <div
          className="modal__header"
          style={{
            backgroundImage: `url(${content.backdrop_url || content.poster_url})`,
          }}
        >
          <div className="modal__header-gradient" />

          <button className="modal__close-btn" onClick={onClose} aria-label="Close">
            <X style={{ width: 24, height: 24 }} />
          </button>

          <div className="modal__title-area">
            <h1 className="modal__title">{content.title}</h1>
            <div className="modal__meta">
              <span className="modal__meta-item">{content.year}</span>
              <span className="modal__meta-item">{content.duration}</span>
              <span className="modal__badge">Recommended</span>
            </div>

            <div className="modal__actions">
              <button className="btn btn--primary" onClick={onPlay}>
                <Play style={{ width: 24, height: 24, fill: '#000' }} /> Play Now
              </button>
              <button className="btn btn--secondary" onClick={onPlayTrailer} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', padding: '0 24px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                <Youtube style={{ width: 24, height: 24, color: '#ff0000' }} /> Watch Trailer
              </button>
              <button
                className={`btn btn--watchlist ${isAddedToWatchlist ? 'btn--watchlist-remove' : 'btn--watchlist-add'}`}
                onClick={onToggleWatchlist}
              >
                <AddRemoveIcon style={{ width: 24, height: 24 }} />
                {watchlistText}
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="modal__body">
          {/* Left column — Synopsis, consensus, episodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
              <CriticsMeter score={content.critics_score} userScore={content.user_score} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: '#f5c518' }}>
                  <Star style={{ width: 24, height: 24, fill: '#f5c518', marginRight: '4px' }} />
                  {content.imdb_rating} <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>/ 10</span>
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{content.no_of_votes?.toLocaleString()} Votes</span>
              </div>
            </div>

            <p className="modal__synopsis">{content.synopsis}</p>

            <div className="modal__details">
              <p>
                <strong>Director:</strong>{' '}
                <span className="modal__detail-label">{content.director}</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <strong>Cast:</strong>
                {content.cast?.map((actor, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px'
                  }}>
                    {actor}
                  </span>
                ))}
              </p>
              <p>
                <strong>Genre:</strong>{' '}
                <span
                  style={{
                    background: 'var(--color-bg-card)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-base)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {content.genre}
                </span>
              </p>
            </div>

            {/* Critics' Consensus Block */}
            <div className="consensus-block">
              <h3 className="consensus-block__title">
                <Star style={{ width: 28, height: 28 }} />
                Critics' Consensus
              </h3>
              <p className="consensus-block__quote">"{content.quote}"</p>
              <p className="consensus-block__analysis">
                <strong>Why It Works:</strong> The consensus praises the film's intelligent
                plot, its strong, focused direction, and a lead performance that grounds the
                high-concept premise. It is rated as one of the best new releases of the year.
              </p>

              {/* Source Transparency */}
              <div className="consensus-block__sources">
                <h4 className="consensus-block__sources-title">
                  Top Contributing Critic Sources:
                </h4>
                <div className="consensus-block__source-list">
                  {MOCK_CRITIC_SOURCES.map((source, index) => (
                    <div key={index} className="consensus-block__source">
                      <span className="consensus-block__source-logo">{source.logo}</span>
                      <span>{source.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Episodes (Series only) */}
            {isSeries && (
              <div style={{ paddingTop: 'var(--space-6)' }}>
                <h3 className="episodes__title">Episodes</h3>
                {DUMMY_EPISODES.map((ep, index) => (
                  <div key={index} className="episode-item">
                    <div>
                      <h4 className="episode-item__title">
                        E{index + 1}: {ep.title}
                      </h4>
                      <p className="episode-item__summary">{ep.summary}</p>
                    </div>
                    <div className={`episode-item__score ${getScoreColorClass(ep.score)}`}>
                      {ep.score}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Technical Specs */}
          <div className="tech-specs modal__tech-specs">
            <h3 className="tech-specs__title">Technical Specs</h3>
            <ul className="tech-specs__list">
              <li className="tech-specs__item">
                <span>Video Quality:</span>
                <span className="tech-specs__value">{content.resolution}</span>
              </li>
              <li className="tech-specs__item">
                <span>HDR Support:</span>
                <span className="tech-specs__value">
                  {content.resolution?.includes('Dolby Vision') ? 'Dolby Vision' : 'HDR10'}
                </span>
              </li>
              <li className="tech-specs__item">
                <span>Audio Formats:</span>
                <span className="tech-specs__value">{content.audio}</span>
              </li>
              <li className="tech-specs__item">
                <span>Subtitles:</span>
                <span className="tech-specs__value">English, Spanish, Hindi</span>
              </li>
            </ul>

            <button className="tech-specs__cta">
              View Cast & Crew Profiles{' '}
              <ChevronRight style={{ width: 20, height: 20, display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
