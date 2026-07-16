require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/Content');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const items = await Content.find({});
  console.log(`Found ${items.length} items in DB.`);
  
  let missingCount = 0;
  for (const item of items) {
    const missing = [];
    if (!item.poster_url) missing.push('poster_url');
    if (!item.backdrop_url) missing.push('backdrop_url');
    if (!item.youtube_url && !item.trailer_youtube_id) missing.push('youtube_url');
    if (!item.synopsis) missing.push('synopsis');
    if (!item.genre) missing.push('genre');
    if (!item.director) missing.push('director');
    if (item.cast.length === 0) missing.push('cast');
    
    if (missing.length > 0) {
      console.log(`❌ Movie "${item.title}" is missing fields: ${missing.join(', ')}`);
      missingCount++;
    }
  }
  
  if (missingCount === 0) {
    console.log('✅ All movies in DB have complete data (posters, backdrops, trailers, synopsis, cast, director, genre)!');
  } else {
    console.log(`⚠️ Found ${missingCount} movies with missing data.`);
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
