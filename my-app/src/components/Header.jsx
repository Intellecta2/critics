/**
 * Header.jsx — Sticky navigation header
 *
 * Features:
 * - Logo with cyan brand color
 * - Desktop nav links (Home, My List, Search) with active state
 * - Mobile search icon button
 * - User avatar with profile link
 * - Glassmorphism background with blur
 *
 * Props:
 *   - page (string): Current active page name
 *   - setPage (function): Navigate to a page
 *   - userId (string): Current user's Firebase UID
 *   - onSignOut (function): Sign out the user
 */

import React from 'react';
import { Search } from 'lucide-react';

const Header = ({ page, setPage, userId }) => {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'mylist', label: 'My List' },
    { key: 'search', label: 'Search' },
  ];

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
        {/* Brand logo */}
        <button className="header__logo" onClick={() => setPage('home')}>
          Critics
        </button>

        {/* Desktop navigation */}
        <nav className="header__nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`header__nav-link ${
                page === item.key ? 'header__nav-link--active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="header__actions">
        {/* User ID display (desktop only, via CSS) */}
        <span className="header__user-id">
          User: {userId}
        </span>

        {/* Mobile search button (hidden on desktop via CSS) */}
        <button
          className="header__search-mobile"
          onClick={() => setPage('search')}
          aria-label="Search"
        >
          <Search style={{ width: 28, height: 28 }} />
        </button>

        {/* User avatar / profile button */}
        <button
          onClick={() => setPage('profile')}
          className={`header__avatar ${page === 'profile' ? 'header__avatar--active' : ''}`}
        >
          U
        </button>
      </div>
    </header>
  );
};

export default Header;
