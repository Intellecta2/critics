/**
 * App.jsx — Main Application Orchestrator for CriticsApp
 *
 * This is the root component that manages:
 * 1. Firebase Authentication state (Email/Password + Google Social Login)
 * 2. API data fetching from the Express backend (port 3001)
 * 3. Application-level state (pages, selected content, video playback)
 * 4. Firestore watchlist persistence tied to permanent user.uid
 * 5. Conditional rendering: Login → Loading → VideoPlayer / Main UI
 *
 * ARCHITECTURE — CORS & State Boundaries:
 * ────────────────────────────────────────
 * The Vite dev server (port 5173) and Express API (port 3001) are two
 * separate origins. React state lives entirely in the browser. When the
 * user interacts with the UI, axios makes cross-origin HTTP requests to
 * the Express API, which queries MongoDB and returns JSON. The Express
 * server has cors({ origin: 'http://localhost:5173' }) configured to
 * allow these requests. This decoupled architecture means:
 *
 *   Browser (React State) ←→ axios HTTP ←→ Express API ←→ MongoDB
 *   Browser (React State) ←→ Firebase SDK ←→ Firestore (watchlists)
 *
 * Content data flows from MongoDB through Express, while user-specific
 * data (watchlists) flows through Firebase/Firestore directly from the
 * client SDK. This avoids routing user data through our API server.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './config/firebase';

// Components
import Header from './components/Header';
import FooterNav from './components/FooterNav';
import ContentDetailModal from './components/ContentDetailModal';
import VideoPlayer from './components/VideoPlayer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import MyListPage from './pages/MyListPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

/**
 * API Base URL
 * Points to the Express backend running on port 3001.
 * In production, this would be your deployed API domain.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/content';

const App = () => {
  // ─── Content State ─────────────────────────────────────────────
  const [allContent, setAllContent] = useState([]);        // All content from API
  const [criticsPicks, setCriticsPicks] = useState([]);    // Filtered critics_picks === true
  const [selectedContent, setSelectedContent] = useState(null); // Current detail view
  const [isPlaying, setIsPlaying] = useState(false);       // Video player visibility

  // ─── Navigation State ──────────────────────────────────────────
  const [page, setPage] = useState('home'); // 'home', 'mylist', 'search', 'profile'

  // ─── Firebase Auth State ───────────────────────────────────────
  const [user, setUser] = useState(null);           // Firebase user object
  const [isAuthReady, setIsAuthReady] = useState(false); // Auth initialization complete

  // ─── Watchlist State (Firestore) ───────────────────────────────
  const [watchlist, setWatchlist] = useState([]); // Array of content _id strings

  // ═══════════════════════════════════════════════════════════════
  // 1. FIREBASE AUTH LISTENER
  // Listens for auth state changes. When a user signs in (via
  // LoginPage's Email/Password or Google popup), this fires and
  // sets the user state with their permanent uid.
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in — store the permanent user object.
        // The user.uid is used to tie Firestore watchlist data
        // directly to this user's document.
        setUser(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // 2. FETCH ALL CONTENT FROM API ON MOUNT
  // Performs an axios GET to the Express backend to load all
  // content documents from MongoDB. Filters critics_picks items
  // into a separate state array for the Home page rows.
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user) return;

    const fetchAllContent = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        const data = response.data;

        setAllContent(data);

        // Filter items where critics_picks === true for the featured row
        const picks = data.filter((item) => item.critics_picks === true);
        setCriticsPicks(picks);
      } catch (error) {
        console.error('Error fetching content from API:', error.message);
        // Content will remain as empty arrays, showing empty states
      }
    };

    fetchAllContent();
  }, [user]);

  // ═══════════════════════════════════════════════════════════════
  // 3. FIRESTORE WATCHLIST REAL-TIME LISTENER
  // Listens to the user's watchlist document in Firestore.
  // Any changes (from this device or another) are reflected
  // in real-time via onSnapshot.
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!user) return;

    const watchlistRef = doc(db, 'users', user.uid, 'watchlist', 'items');

    const unsubscribe = onSnapshot(
      watchlistRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWatchlist(data.contentIds || []);
        } else {
          // Initialize empty watchlist document for new users
          setWatchlist([]);
          setDoc(watchlistRef, { contentIds: [] }).catch(console.error);
        }
      },
      (error) => {
        console.error('Error listening to watchlist:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ═══════════════════════════════════════════════════════════════
  // 4. FETCH SINGLE CONTENT BY ID
  // Triggered when a user clicks a content card. Makes a GET
  // request to /api/content/:id to retrieve full details including
  // the hls_stream_url needed for video playback.
  // ═══════════════════════════════════════════════════════════════
  const fetchData = async (id) => {
    try {
      setSelectedContent(null); // Clear previous to show loading
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setSelectedContent(response.data);
    } catch (error) {
      console.error('Error fetching content details:', error.message);
      setSelectedContent(null);
    }
  };

  // ─── Event Handlers ────────────────────────────────────────────

  const handleCardClick = (id) => {
    fetchData(id);
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStopPlaying = () => {
    setIsPlaying(false);
  };

  const handleToggleWatchlist = async () => {
    if (!user || !selectedContent) return;

    const contentId = selectedContent._id;
    let newWatchlist;

    if (watchlist.includes(contentId)) {
      newWatchlist = watchlist.filter((id) => id !== contentId);
    } else {
      newWatchlist = [...watchlist, contentId];
    }

    // Optimistic update — update local state immediately
    setWatchlist(newWatchlist);

    // Persist to Firestore
    try {
      const watchlistRef = doc(db, 'users', user.uid, 'watchlist', 'items');
      await setDoc(watchlistRef, { contentIds: newWatchlist });
    } catch (error) {
      console.error('Error updating watchlist:', error);
      // Revert on failure
      setWatchlist(watchlist);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setPage('home');
      setWatchlist([]);
      setAllContent([]);
      setCriticsPicks([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 5. CONDITIONAL RENDERING
  // ═══════════════════════════════════════════════════════════════

  // Auth not yet initialized — show loading
  if (!isAuthReady) {
    return (
      <div className="loading-screen">
        <LoadingSpinner />
        <p className="loading-screen__text">Initializing CriticsApp...</p>
      </div>
    );
  }

  // No user signed in — show login page
  if (!user) {
    return <LoginPage />;
  }

  // Video is playing — show fullscreen video player
  // This takes over the entire UI when isPlaying is true
  // and selectedContent has a valid stream URL.
  const streamUrl = selectedContent?.youtube_url || selectedContent?.hls_stream_url;
  
  if (isPlaying && streamUrl) {
    return (
      <VideoPlayer
        streamUrl={streamUrl}
        onEnd={handleStopPlaying}
      />
    );
  }

  // ─── Standard Application Layout ──────────────────────────────

  /**
   * Page Router
   * Renders the appropriate page component based on the `page` state.
   * This is a simple client-side routing without react-router, matching
   * the navigation pattern established in the prototype designs.
   */
  const renderPage = () => {
    switch (page) {
      case 'mylist':
        return (
          <MyListPage
            onCardClick={handleCardClick}
            watchlist={watchlist}
            allContent={allContent}
            userId={user.uid}
          />
        );
      case 'search':
        return (
          <SearchPage
            onCardClick={handleCardClick}
            watchlist={watchlist}
            allContent={allContent}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userId={user.uid}
            onSignOut={handleSignOut}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            allContent={allContent}
            criticsPicks={criticsPicks}
            onCardClick={handleCardClick}
            watchlist={watchlist}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Header page={page} setPage={setPage} userId={user.uid} />

      {renderPage()}

      {/* Content Detail Modal — rendered as an overlay above all pages */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={handleCloseModal}
          isAddedToWatchlist={watchlist.includes(selectedContent._id)}
          onToggleWatchlist={handleToggleWatchlist}
          onPlay={handlePlay}
        />
      )}

      <FooterNav page={page} setPage={setPage} />
    </div>
  );
};

export default App;
