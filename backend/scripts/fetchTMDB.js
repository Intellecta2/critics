require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const Content = require('../models/Content');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; // For 4K backdrops and HD posters

if (!TMDB_API_KEY) {
  console.error('❌ Error: TMDB_API_KEY is not set in backend/.env');
  console.log('To get an API key:');
  console.log('1. Create an account at https://www.themoviedb.org/');
  console.log('2. Go to Settings -> API -> Generate a new API Key (v3 auth)');
  console.log('3. Add TMDB_API_KEY=your_key_here to backend/.env');
  process.exit(1);
}

// Map TMDB genre IDs to strings
const TMDB_GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

async function fetchTMDBData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch popular movies
    console.log('🎬 Fetching popular movies from TMDB...');
    
    // We'll fetch 2 pages to get ~40 premium movies
    let allMovies = [];
    for (let page = 1; page <= 2; page++) {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', page }
      });
      allMovies = allMovies.concat(response.data.results);
    }

    console.log(`✅ Fetched ${allMovies.length} movies. Fetching trailers and cast details...`);

    const formattedContent = [];
    
    for (const movie of allMovies) {
      // 1. Fetch exact movie details (for cast and videos)
      const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;
      
      let details;
      try {
        const detailRes = await axios.get(detailsUrl);
        details = detailRes.data;
      } catch (err) {
        console.log(`⚠️ Skipping ${movie.title} - Error fetching details`);
        continue;
      }

      // 2. Find the Official YouTube Trailer
      let trailerKey = '';
      if (details.videos && details.videos.results.length > 0) {
        // Try to find a YouTube trailer
        const trailer = details.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        if (trailer) {
          trailerKey = trailer.key;
        } else {
          // Fallback to any youtube video
          const anyYoutube = details.videos.results.find(v => v.site === 'YouTube');
          if (anyYoutube) trailerKey = anyYoutube.key;
        }
      }

      // 3. Extract Cast & Director
      const cast = details.credits?.cast?.slice(0, 4).map(c => c.name) || [];
      const directorObj = details.credits?.crew?.find(c => c.job === 'Director');
      const director = directorObj ? directorObj.name : 'Unknown';

      // 4. Map Genres
      const genres = movie.genre_ids.map(id => TMDB_GENRES[id]).filter(Boolean).join(', ');

      formattedContent.push({
        title: movie.title,
        synopsis: movie.overview,
        year: parseInt(movie.release_date?.substring(0, 4)) || new Date().getFullYear(),
        poster_url: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
        backdrop_url: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : '',
        imdb_rating: movie.vote_average,
        user_score: Math.round(movie.vote_average * 10),
        critics_score: Math.round(movie.vote_average * 10) + Math.floor(Math.random() * 10 - 5), // Fake critics score variance
        trailer_youtube_id: trailerKey,
        youtube_url: trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : '',
        hls_stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Fallback stream
        genre: genres,
        director: director,
        cast: cast,
        no_of_votes: movie.vote_count,
        trending: true,
        critics_picks: movie.vote_average > 7.5,
        content_type: 'Movie'
      });
      
      process.stdout.write('.'); // progress indicator
    }

    console.log('\n🗑️  Clearing existing content collection...');
    await Content.deleteMany({});

    console.log(`🌱 Seeding ${formattedContent.length} movies to DB...`);
    const inserted = await Content.insertMany(formattedContent);
    
    console.log('✅ Seeding complete!');
    console.log(`Example seeded: ${inserted[0].title}`);
    console.log(`Poster: ${inserted[0].poster_url}`);
    console.log(`Trailer: ${inserted[0].youtube_url}`);

  } catch (error) {
    console.error('❌ Error fetching TMDB data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fetchTMDBData();
