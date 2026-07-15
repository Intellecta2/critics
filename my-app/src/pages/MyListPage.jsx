/**
 * MyListPage.jsx — User's personal watchlist page
 *
 * Displays a grid of ContentCards for items the user has added
 * to their watchlist. Shows an empty state when the list is empty.
 *
 * Props:
 *   - onCardClick (function): Called when a card is clicked
 *   - watchlist (array): Array of content _id strings
 *   - allContent (array): All content from API (used to look up by _id)
 *   - userId (string): Current user's Firebase UID
 */

import React from 'react';
import { Bookmark } from 'lucide-react';
import ContentCard from '../components/ContentCard';

const MyListPage = ({ onCardClick, watchlist, allContent, userId }) => {
  // Map watchlist IDs to full content objects
  const watchlistContent = watchlist
    .map((id) => allContent.find((c) => c._id === id))
    .filter(Boolean);

  return (
    <main className="page-container">
      <h1 className="page-title">My Watch List</h1>
      <p className="page-subtitle">User ID: {userId || 'Loading...'}</p>

      {watchlistContent.length === 0 ? (
        <div className="empty-state">
          <Bookmark className="empty-state__icon" />
          <p className="empty-state__title">Your Watch List is empty.</p>
          <p className="empty-state__subtitle">
            Add content from the Home page to track what you want to watch!
          </p>
        </div>
      ) : (
        <div className="content-grid">
          {watchlistContent.map((item) => (
            <ContentCard
              key={item._id}
              content={item}
              onClick={onCardClick}
              isAdded={true}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyListPage;
