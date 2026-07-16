const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Content = require('../models/Content');

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      resolve(400);
      return;
    }
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(500));
    req.end();
  });
}

async function run() {
  console.log('Connecting to DB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const items = await Content.find({});
  console.log(`Found ${items.length} items to verify.`);

  let failCount = 0;

  for (const item of items) {
    const pStatus = await checkUrl(item.poster_url);
    const bStatus = await checkUrl(item.backdrop_url);

    if (pStatus !== 200 || bStatus !== 200) {
      console.log(`❌ Movie: "${item.title}" has issue!`);
      console.log(`   Poster:   ${item.poster_url} -> Status: ${pStatus}`);
      console.log(`   Backdrop: ${item.backdrop_url} -> Status: ${bStatus}`);
      failCount++;
    } else {
      console.log(`✅ Movie: "${item.title}" -> Status: 200 OK`);
    }
  }

  console.log('-------------------------------');
  console.log(`Verification Complete: ${items.length - failCount}/${items.length} movies/series are 100% OK!`);
  if (failCount > 0) {
    console.log(`⚠️ Warning: ${failCount} items had image resolution issues!`);
  } else {
    console.log('🎉 Superb! All 60 movies/series resolved with Status: 200 OK!');
  }

  mongoose.connection.close();
  process.exit(0);
}

run().catch(console.error);
