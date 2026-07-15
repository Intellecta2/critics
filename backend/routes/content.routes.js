/**
 * content.routes.js — RESTful API routes for CriticsApp content.
 *
 * These routes are mounted at `/api/content` in server.js.
 * The Vite frontend (running on port 5173) calls these endpoints
 * via axios. CORS is configured in server.js to allow this
 * cross-origin communication between the two development servers.
 *
 * Routes:
 *   GET    /api/content      → Fetch all content documents
 *   GET    /api/content/:id  → Fetch a single document by MongoDB ObjectId
 *   POST   /api/content      → Insert a new content document (admin ingest)
 */

const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

/**
 * GET /api/content
 * Returns all content documents from the database.
 * The frontend uses this on mount to populate content rows.
 */
router.get('/', async (req, res) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/content/:id
 * Returns a single content document by its 24-character hex MongoDB ObjectId.
 * Handles Mongoose CastError (invalid ObjectId format) gracefully with a 404.
 * This endpoint is called when a user clicks on a content card to view details
 * and retrieve the hls_stream_url for video playback.
 */
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    // Mongoose throws a CastError when the id string isn't a valid ObjectId.
    // We catch it here and return a clean 404 instead of a 500.
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Content not found — invalid ID format' });
    }
    console.error('Error fetching content by ID:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/content
 * Creates a new content document. Used for admin content ingestion.
 * Expects a JSON body matching the Content schema.
 */
router.post('/', async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    // Mongoose validation errors (e.g., missing required fields)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating content:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
