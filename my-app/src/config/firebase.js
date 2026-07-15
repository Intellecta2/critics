/**
 * firebase.js — Firebase Configuration & Initialization
 *
 * Centralizes Firebase setup so all modules import from one place.
 * Exports the initialized app, auth, and Firestore instances.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (or use an existing one)
 * 3. Add a Web App in Project Settings
 * 4. Copy your firebaseConfig object here
 * 5. Enable Authentication > Email/Password and Google providers
 * 6. Enable Cloud Firestore in the Firebase console
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAcDbncFNicF_QnxyPTht_sXnsxqJD5thE',
  authDomain: 'critics-da3a0.firebaseapp.com',
  projectId: 'critics-da3a0',
  storageBucket: 'critics-da3a0.firebasestorage.app',
  messagingSenderId: '1002249190267',
  appId: '1:1002249190267:web:75e2c3a14953e2587b1bde',
  measurementId: 'G-SJ9G2XCQT9'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with the default persistence
const auth = getAuth(app);

// Google Auth Provider — used for social login popup
const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore — used for persisting watchlists
const db = getFirestore(app);

export { app, auth, googleProvider, db };
