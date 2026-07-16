const fs = require('fs');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Content = require('../models/Content');

const seedFilePath = path.join(__dirname, '../seed.js');

function fetchOmdb(title, year) {
  const queryUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=thewdb`;
  return new Promise((resolve) => {
    http.get(queryUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function cleanPosterUrl(url) {
  if (!url || url === 'N/A' || !url.includes('m.media-amazon.com/images/M/')) return url;
  
  // Extract the MV5... part.
  const match = url.match(/\/images\/M\/([A-Za-z0-9]+)/);
  if (!match) return url;
  const mvId = match[1];
  
  if (url.includes('@@')) {
    return `https://m.media-amazon.com/images/M/${mvId}@@._V1.jpg`;
  } else if (url.includes('@')) {
    return `https://m.media-amazon.com/images/M/${mvId}@._V1.jpg`;
  } else {
    return `https://m.media-amazon.com/images/M/${mvId}._V1.jpg`;
  }
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const items = await Content.find({});
  console.log(`Found ${items.length} items to check.`);

  let seedFileContent = fs.readFileSync(seedFilePath, 'utf8');

  for (const item of items) {
    const title = item.title;
    const year = item.year;
    console.log(`Checking "${title}" (${year})...`);

    const data = await fetchOmdb(title, year);
    if (data && data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      const rawPoster = data.Poster;
      const cleanPoster = cleanPosterUrl(rawPoster);
      console.log(`  Found poster: ${rawPoster} -> Cleaned: ${cleanPoster}`);

      // Update in DB
      item.poster_url = cleanPoster;
      item.backdrop_url = cleanPoster;
      await item.save();

      // Update in seed.js file so they match permanently
      // Find the object matching the title in seed.js
      // We will replace the poster_url and backdrop_url within the object block for this movie.
      const escapeTitle = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const movieRegex = new RegExp(`(title:\\s*['"]${escapeTitle}['"][\\s\\S]*?poster_url:\\s*['"])([^'"]+)(['"][\\s\\S]*?backdrop_url:\\s*['"])([^'"]+)(['"])`);
      seedFileContent = seedFileContent.replace(movieRegex, (match, p1, p2, p3, p4, p5) => {
        return `${p1}${cleanPoster}${p3}${cleanPoster}${p5}`;
      });
    } else {
      console.log(`  ⚠️ OMDb lookup failed or poster N/A for "${title}"`);
    }
  }

  // Write updated seed file back
  fs.writeFileSync(seedFilePath, seedFileContent, 'utf8');
  console.log('seed.js file successfully updated!');

  mongoose.connection.close();
  console.log('Finished!');
  process.exit(0);
}

run().catch(console.error);
