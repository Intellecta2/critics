/**
 * Content.js — Mongoose Schema for CriticsApp streaming content.
 *
 * This schema defines the shape of every content document stored in MongoDB.
 * It maps directly to the API response contract consumed by the React frontend.
 *
 * Key design decisions:
 * - `hls_stream_url` is required because video playback is the app's core feature.
 * - `critics_picks` is a boolean flag the frontend uses to filter the "Critics' Picks" row.
 * - `poster_url` stores the IMDB poster image URL for thumbnail display.
 * - `imdb_rating` stores the original IMDB decimal rating (e.g. 9.3).
 * - `meta_score` stores the Metacritic score (0-100).
 * - Extended fields (genre, director, cast, etc.) carry over the rich metadata from the
 *   prototype designs so the detail modal and search filters work out of the box.
 * - Mongoose timestamps add `createdAt` and `updatedAt` automatically.
 */

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    // --- Core fields ---
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    synopsis: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
    },
    critics_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    technical_specs: {
      type: String,
      default: '',
    },
    hls_stream_url: {
      type: String,
      required: [true, 'HLS stream URL is required'],
    },
    youtube_url: {
      type: String,
      default: '',
    },
    critics_picks: {
      type: Boolean,
      default: false,
    },

    // --- IMDB fields ---
    poster_url: {
      type: String,
      default: '',
    },
    imdb_rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    meta_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    certificate: {
      type: String,
      default: '',
    },
    no_of_votes: {
      type: Number,
      default: 0,
    },
    gross: {
      type: String,
      default: '',
    },

    // --- Extended fields ---
    genre: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    quote: {
      type: String,
      default: '',
    },
    resolution: {
      type: String,
      default: '',
    },
    audio: {
      type: String,
      default: '',
    },
    user_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    content_type: {
      type: String,
      enum: ['Movie', 'Series', 'Documentary'],
      default: 'Movie',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Content', contentSchema);
