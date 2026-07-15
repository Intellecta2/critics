/**
 * FooterNav.jsx — Mobile bottom navigation bar
 *
 * Fixed to the bottom of the viewport on small screens.
 * Hidden on screens >= 640px via CSS media query.
 *
 * Props:
 *   - page (string): Current active page
 *   - setPage (function): Navigate to a page
 */

import React from 'react';
import { Bookmark, Search, Settings } from 'lucide-react';

const FooterNav = ({ page, setPage }) => {
  const navItems = [
    {
      key: 'home',
      label: 'Home',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 24, height: 24 }}
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: 'mylist',
      label: 'My List',
      icon: <Bookmark style={{ width: 24, height: 24 }} />,
    },
    {
      key: 'search',
      label: 'Search',
      icon: <Search style={{ width: 24, height: 24 }} />,
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <Settings style={{ width: 24, height: 24 }} />,
    },
  ];

  return (
    <nav className="footer-nav">
      <div className="footer-nav__items">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={`footer-nav__link ${
              page === item.key ? 'footer-nav__link--active' : ''
            }`}
          >
            {item.icon}
            <span className="footer-nav__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default FooterNav;
