/**
 * ContentRow.jsx — Horizontal scrolling content row
 *
 * Renders a titled row of ContentCards with horizontal scroll,
 * scroll-snap, and left/right scroll buttons on hover.
 *
 * Props:
 *   - title (string): Row heading text
 *   - content (array): Array of content objects to display
 *   - onCardClick (function): Passed through to ContentCard onClick
 *   - watchlist (array): Array of content _id strings in user's watchlist
 */

import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';

const ContentRow = ({ title, content, onCardClick, watchlist }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Don't render an empty row
  if (!content || content.length === 0) return null;

  return (
    <div className="content-row">
      <h2 className="content-row__title">{title}</h2>

      {/* Scroll buttons — visible on hover via CSS */}
      <button
        className="content-row__scroll-btn content-row__scroll-btn--left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronRight style={{ width: 28, height: 28, transform: 'rotate(180deg)' }} />
      </button>
      <button
        className="content-row__scroll-btn content-row__scroll-btn--right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRight style={{ width: 28, height: 28 }} />
      </button>

      {/* Scrollable track */}
      <div ref={scrollRef} className="content-row__track no-scrollbar">
        {content.map((item) => (
          <div key={item._id} className="content-row__item">
            <ContentCard
              content={item}
              onClick={onCardClick}
              isAdded={watchlist.includes(item._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;
