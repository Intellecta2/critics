/**
 * LoginPage.jsx — Firebase Authentication Page
 *
 * Provides two auth methods:
 * 1. Email/Password — with tabbed Sign In / Sign Up forms
 * 2. Google Social Login — via popup
 *
 * This replaces the anonymous sign-in from the prototypes with
 * structured permanent authentication methods. The permanent user.uid
 * is used to tie watchlist data directly to the user's Firestore document.
 *
 * Props:
 *   - onAuthSuccess (function): Called after successful authentication
 */

import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when switching tabs
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  // Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.jsx will pick up the auth state change
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.jsx will pick up the auth state change
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Google Social Login
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in App.jsx will pick up the auth state change
    } catch (err) {
      // Ignore popup-closed-by-user errors
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getFirebaseErrorMessage(err.code));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Map Firebase error codes to user-friendly messages
  const getFirebaseErrorMessage = (code) => {
    const messages = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
    };
    return messages[code] || 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp;

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-card__logo">Critics</div>
        <p className="login-card__subtitle">
          Sign in to access your curated streaming experience
        </p>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === 'signin' ? 'login-tab--active' : ''}`}
            onClick={() => handleTabSwitch('signin')}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${activeTab === 'signup' ? 'login-tab--active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && <div className="login-error">{error}</div>}

        {/* Email/Password form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            id="login-email"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            minLength={6}
            id="login-password"
            autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
          />
          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : activeTab === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">or continue with</div>

        {/* Google Sign In */}
        <button
          className="login-google-btn"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {/* Google "G" logo */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
