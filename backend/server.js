/**
 * server.js — CriticsApp Express API Server
 *
 * This is the main entry point for the backend. It initializes Express,
 * connects to MongoDB Atlas via Mongoose, and mounts the content API routes.
 *
 * ARCHITECTURE NOTE — CORS & State Boundaries:
 * ─────────────────────────────────────────────
 * In development, the frontend (Vite) runs on port 5173 and the backend
 * (Express) runs on port 3001. These are two separate origins:
 *   - Frontend: http://localhost:5173
 *   - Backend:  http://localhost:3001
 *
 * Browsers enforce the Same-Origin Policy, which blocks cross-origin
 * requests by default. The `cors()` middleware tells the browser:
 * "Requests from http://localhost:5173 are allowed to access this API."
 *
 * Without CORS, every axios.get() call from the React app would fail
 * with a CORS policy error in the browser console.
 *
 * In production, both frontend and API would typically share the same
 * domain (or use a CDN + API gateway), making CORS less of a concern.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route modules
const contentRoutes = require('./routes/content.routes');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

/**
 * CORS Configuration
 * Allows the Vite development server (port 5173) to make API requests
 * to this Express server (port 3001). This is the bridge that lets the
 * decoupled frontend communicate with the backend across origin boundaries.
 */
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Body Parser
 * Parses incoming JSON request bodies so they're available as req.body
 * in route handlers. Essential for the POST /api/content endpoint.
 */
app.use(bodyParser.json());

// ─── DATABASE CONNECTION ─────────────────────────────────────────────────────

/**
 * MongoDB Atlas Connection
 * Replace the placeholder URI with your actual MongoDB Atlas connection string.
 * Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
 *
 * The connection string can be set via:
 *   1. Environment variable MONGODB_URI (recommended for production)
 *   2. A .env file in the backend directory (recommended for development)
 */
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/criticsapp?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas — CriticsApp database');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Make sure your MONGODB_URI is set correctly in .env');
    process.exit(1);
  });

// ─── ROUTES ──────────────────────────────────────────────────────────────────

/**
 * Mount content routes at /api/content
 * All routes defined in content.routes.js are prefixed with this path:
 *   GET  /api/content       → Fetch all content
 *   GET  /api/content/:id   → Fetch single content
 *   POST /api/content       → Create new content
 */
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CriticsApp API', port: PORT });
});

// ─── START SERVER ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🎬 CriticsApp API Server running on http://localhost:${PORT}`);
  console.log(`   Frontend expected at: http://localhost:5173`);
  console.log(`   API base: http://localhost:${PORT}/api/content\n`);
});
