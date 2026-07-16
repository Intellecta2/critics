const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Content = require('../models/Content');

async function checkTrailers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const contents = await Content.find({});
    let missingTrailers = 0;
    
    for (const content of contents) {
      if (!content.trailer_youtube_id && !content.youtube_url) {
        console.log(`Missing trailer for: ${content.title}`);
        missingTrailers++;
      }
    }
    
    console.log(`\nTotal items: ${contents.length}`);
    console.log(`Items missing trailers: ${missingTrailers}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkTrailers();
