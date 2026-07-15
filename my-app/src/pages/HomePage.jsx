/**
 * HomePage.jsx — Landing page with hero banner and content rows
 *
 * Displays:
 * - Featured hero section with the first trending content item
 * - Multiple content rows: Critics' Picks, Continue Watching,
 *   Trending, and Recommended
 *
 * Props:
 *   - allContent (array): All content from API
 *   - criticsPicks (array): Filtered critics_picks === true items
 *   - onCardClick (function): Called when a content card is clicked
 *   - watchlist (array): User's watchlist IDs
 */

import React from 'react';
import { Play, Info, Clapperboard } from 'lucide-react';
import CriticsMeter from '../components/CriticsMeter';
import ContentRow from '../components/ContentRow';

const HomePage = ({ allContent, criticsPicks, onCardClick, watchlist }) => {
  // Featured hero: first trending item from critics picks
  const featuredContent = criticsPicks.find((c) => c.trending) || criticsPicks[0];

  // Build content row segments
  const recommended = allContent.filter((c) => !c.critics_picks);
  const trending = allContent.filter((c) => c.trending);

  return (
    <main className="home-page">
      {/* ── Featured Hero Section ─────────────────────────────── */}
      {featuredContent && (
        <div
          className="hero"
          style={{
            backgroundImage: `url(https://placehold.co/1920x900/223F6E/FFFFFF?text=${encodeURIComponent(featuredContent.title)})`,
          }}
        >
          <div className="hero__gradient" />
          <div className="hero__content">
            <Clapperboard className="hero__icon" />
            <h1 className="hero__title">{featuredContent.title}</h1>
            <p className="hero__synopsis">{featuredContent.synopsis}</p>

            <CriticsMeter
              score={featuredContent.critics_score}
              userScore={featuredContent.user_score}
            />

            <div className="hero__actions">
              <button className="btn btn--primary" onClick={() => onCardClick(featuredContent._id)}>
                <Play style={{ width: 24, height: 24, fill: '#000' }} /> Play Now
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => onCardClick(featuredContent._id)}
              >
                <Info style={{ width: 24, height: 24 }} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content Rows ──────────────────────────────────────── */}
      <div className="home-page__rows">
        <ContentRow
          title="Critics' Picks (90%+ Score)"
          content={criticsPicks}
          onCardClick={onCardClick}
          watchlist={watchlist}
        />
        <ContentRow
          title="Trending Now"
          content={trending}
          onCardClick={onCardClick}
          watchlist={watchlist}
        />
        <ContentRow
          title="Recommended for You"
          content={recommended}
          onCardClick={onCardClick}
          watchlist={watchlist}
        />
        <ContentRow
          title="All Titles"
          content={allContent}
          onCardClick={onCardClick}
          watchlist={watchlist}
        />
      </div>
    </main>
  );
};

export default HomePage;
