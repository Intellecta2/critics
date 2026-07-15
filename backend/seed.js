/**
 * seed.js — Database seeder for CriticsApp
 *
 * Seeds MongoDB with all content items from the prototype designs.
 * Run with: node seed.js (or npm run seed)
 *
 * Uses a public Apple HLS test stream for the hls_stream_url field.
 * Replace with your own CloudFront/CDN URLs in production.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Public HLS test streams for development
const TEST_HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const TEST_HLS_URL_ALT = 'https://test-streams.mux.dev/pts_shift/master.m3u8';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/criticsapp?retryWrites=true&w=majority';

/**
 * Seed data — mapped from the pd.jsx prototype's CRITICS_PICKS,
 * RECOMMENDED, and ADDITIONAL_CONTENT arrays.
 * Each item is transformed to match the Mongoose Content schema.
 */
const seedData = [
  // ─── CRITICS' PICKS ───────────────────────────────────────────
  {
    title: 'The Chronos Paradox',
    synopsis: 'A physicist invents a device that allows him to witness moments from the past, only to uncover a temporal conspiracy that threatens the future.',
    year: 2024,
    critics_score: 96,
    user_score: 89,
    technical_specs: '4K Dolby Vision, Dolby Atmos',
    hls_stream_url: TEST_HLS_URL,
    critics_picks: true,
    genre: 'Sci-Fi Thriller',
    duration: '1h 55m',
    director: 'Elena Rostova',
    cast: ['J. Smith', 'L. Chen'],
    quote: 'A masterpiece of cerebral tension.',
    resolution: '4K Dolby Vision',
    audio: 'Dolby Atmos',
    trending: true,
    content_type: 'Movie',
  },
  {
    title: 'Echoes of Sylva',
    synopsis: 'The final stand of the Elven Kingdoms against the Shadow Army. Stunning visuals and emotional depth.',
    year: 2023,
    critics_score: 92,
    user_score: 94,
    technical_specs: '4K HDR10, 5.1 Surround',
    hls_stream_url: TEST_HLS_URL_ALT,
    critics_picks: true,
    genre: 'Fantasy Epic',
    duration: '2h 10m',
    director: 'Mark Denton',
    cast: ['A. Davies', 'R. Patel'],
    quote: 'Visually stunning and deeply moving.',
    resolution: '4K HDR10',
    audio: '5.1 Surround',
    trending: false,
    content_type: 'Series',
  },
  {
    title: 'Midnight Street',
    synopsis: 'A private investigator hunts for a missing jazz singer in a rain-soaked city that holds dark secrets.',
    year: 2022,
    critics_score: 89,
    user_score: 78,
    technical_specs: 'HD, Stereo',
    hls_stream_url: TEST_HLS_URL,
    critics_picks: false,
    genre: 'Neo-Noir',
    duration: '1h 38m',
    director: 'Chloe Lim',
    cast: ['S. Lee', 'T. Evans'],
    quote: 'A stylish, tense return to classic noir.',
    resolution: 'HD',
    audio: 'Stereo',
    trending: false,
    content_type: 'Movie',
  },
  {
    title: 'The Quantum Leap',
    synopsis: "When a detective wakes up in a parallel timeline, she must solve a crime that hasn't happened yet.",
    year: 2024,
    critics_score: 91,
    user_score: 90,
    technical_specs: '4K, Dolby Atmos',
    hls_stream_url: TEST_HLS_URL_ALT,
    critics_picks: true,
    genre: 'Mystery',
    duration: '1h 50m',
    director: 'D. Wilson',
    cast: ['M. Jones', 'J. Adams'],
    quote: 'Mind-bending and perfectly paced.',
    resolution: '4K',
    audio: 'Dolby Atmos',
    trending: true,
    content_type: 'Series',
  },
  {
    title: 'Galactic Drift',
    synopsis: 'A lone starship captain races against time to deliver a vital peace treaty across a war-torn galaxy.',
    year: 2023,
    critics_score: 88,
    user_score: 82,
    technical_specs: '4K HDR10, 7.1',
    hls_stream_url: TEST_HLS_URL,
    critics_picks: false,
    genre: 'Adventure',
    duration: '2h 05m',
    director: 'F. Khan',
    cast: ['K. Sato', 'B. Miller'],
    quote: 'Thrilling space opera with heart.',
    resolution: '4K HDR10',
    audio: '7.1',
    trending: true,
    content_type: 'Movie',
  },

  // ─── RECOMMENDED ───────────────────────────────────────────────
  {
    title: 'Ancient Ruins',
    synopsis: 'Explore the lost cities of the world and the mysteries that led to their demise.',
    year: 2021,
    critics_score: 75,
    user_score: 85,
    technical_specs: 'HD, Stereo',
    hls_stream_url: TEST_HLS_URL_ALT,
    critics_picks: false,
    genre: 'Documentary',
    duration: '55m',
    director: 'S. Ray',
    cast: ['Narrator: D. Atten'],
    quote: 'Fascinating look at human history.',
    resolution: 'HD',
    audio: 'Stereo',
    trending: false,
    content_type: 'Documentary',
  },
  {
    title: 'The Third Act',
    synopsis: 'A retired playwright finds inspiration in a chance encounter with a young, aspiring actress.',
    year: 2024,
    critics_score: 85,
    user_score: 70,
    technical_specs: '4K, 5.1 Surround',
    hls_stream_url: TEST_HLS_URL,
    critics_picks: false,
    genre: 'Drama',
    duration: '1h 40m',
    director: 'G. Harris',
    cast: ['P. Evans', 'H. Bell'],
    quote: 'A quiet, powerful character study.',
    resolution: '4K',
    audio: '5.1 Surround',
    trending: false,
    content_type: 'Movie',
  },

  // ─── ADDITIONAL CONTENT ────────────────────────────────────────
  {
    title: 'Cybernetic Dawn',
    synopsis: 'A rogue AI threatens global communication. A hacker must go offline to save humanity.',
    year: 2024,
    critics_score: 94,
    user_score: 88,
    technical_specs: '4K Dolby Vision, Dolby Atmos',
    hls_stream_url: TEST_HLS_URL_ALT,
    critics_picks: true,
    genre: 'Sci-Fi Action',
    duration: '1h 50m',
    director: 'K. Neo',
    cast: ['R. Lee', 'A. Stone'],
    quote: 'Pulsating action and futuristic grit.',
    resolution: '4K Dolby Vision',
    audio: 'Dolby Atmos',
    trending: false,
    content_type: 'Movie',
  },
  {
    title: 'The Last Diplomat',
    synopsis: 'A diplomat navigates treacherous international waters during a global energy crisis.',
    year: 2023,
    critics_score: 86,
    user_score: 91,
    technical_specs: 'HD, 5.1 Surround',
    hls_stream_url: TEST_HLS_URL,
    critics_picks: false,
    genre: 'Political Drama',
    duration: '1h 00m',
    director: 'M. Cohen',
    cast: ['E. Roth', 'P. Singh'],
    quote: 'Tense, smart, and highly relevant.',
    resolution: 'HD',
    audio: '5.1 Surround',
    trending: false,
    content_type: 'Series',
  },
  {
    title: 'Hidden Ocean',
    synopsis: 'A deep-sea exploration uncovers new species and reveals the impact of climate change.',
    year: 2022,
    critics_score: 98,
    user_score: 97,
    technical_specs: '4K HDR10, Dolby Atmos',
    hls_stream_url: TEST_HLS_URL_ALT,
    critics_picks: true,
    genre: 'Documentary',
    duration: '50m',
    director: 'J. Cameron',
    cast: ['Narrator: E. Watson'],
    quote: 'Essential viewing for nature lovers.',
    resolution: '4K HDR10',
    audio: 'Dolby Atmos',
    trending: false,
    content_type: 'Documentary',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing content
    await Content.deleteMany({});
    console.log('🗑️  Cleared existing content collection');

    // Insert seed data
    const inserted = await Content.insertMany(seedData);
    console.log(`🌱 Seeded ${inserted.length} content documents:`);
    inserted.forEach((item) => {
      console.log(`   • ${item.title} (${item._id})`);
    });

    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
