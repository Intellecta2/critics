/**
 * ProfilePage.jsx — User profile with stats and settings
 *
 * Displays:
 * - Viewing summary stats (content watched, list items, avg score, profiles)
 * - Preferences & settings list
 * - Sign out button
 *
 * Props:
 *   - userId (string): Current user's Firebase UID
 *   - onSignOut (function): Sign out handler
 */

import React from 'react';
import { Clapperboard, Bookmark, Star, Users, ChevronRight } from 'lucide-react';

const ProfilePage = ({ userId, onSignOut }) => {
  const userStats = [
    { label: 'Content Watched', value: 145, unit: 'Hours', icon: Clapperboard },
    { label: 'Items on My List', value: 12, unit: 'Titles', icon: Bookmark },
    { label: 'Avg. Critic Score', value: 91, unit: '%', icon: Star },
    { label: 'Profiles Active', value: 1, unit: '/ 4', icon: Users },
  ];

  const settings = [
    { id: 1, name: 'Playback Quality', value: '4K HDR' },
    { id: 2, name: 'Subtitle Appearance', value: 'White, Large' },
    { id: 3, name: 'Language Preference', value: 'English (Primary)' },
    { id: 4, name: 'Notification Settings', value: 'On (New Critics Picks)' },
  ];

  return (
    <main className="page-container" style={{ color: 'var(--color-text-primary)' }}>
      <h1 className="page-title" style={{ marginBottom: 'var(--space-3)' }}>My Profile</h1>
      <p className="page-subtitle" style={{ marginTop: 0 }}>User ID: {userId}</p>

      {/* Viewing Summary Stats */}
      <div className="profile-card">
        <h2 className="profile-card__title">Viewing Summary</h2>
        <div className="profile-stats">
          {userStats.map((stat) => (
            <div key={stat.label} className="profile-stat">
              <stat.icon className="profile-stat__icon" />
              <p className="profile-stat__value">{stat.value}</p>
              <p className="profile-stat__unit">{stat.unit}</p>
              <p className="profile-stat__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="profile-card">
        <h2 className="profile-card__title">Preferences & Settings</h2>
        <div className="settings-list">
          {settings.map((setting) => (
            <div key={setting.id} className="settings-item">
              <span className="settings-item__name">{setting.name}</span>
              <div className="settings-item__value-group">
                <span className="settings-item__value">{setting.value}</span>
                <ChevronRight style={{ width: 24, height: 24, color: 'var(--color-text-dim)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button className="btn btn--danger" onClick={onSignOut}>
        Sign Out
      </button>
    </main>
  );
};

export default ProfilePage;
