const fs = require('fs');
const path = require('path');
const http = require('http');

const seedFilePath = path.join(__dirname, '../seed.js');

const newTitles = [
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: 'Oppenheimer', year: 2023 },
  { title: 'Spider-Man: Across the Spider-Verse', year: 2023 },
  { title: 'Dune', year: 2021 },
  { title: 'Dune: Part Two', year: 2024 },
  { title: 'The Wolf of Wall Street', year: 2013 },
  { title: 'Avengers: Infinity War', year: 2018 },
  { title: 'Everything Everywhere All at Once', year: 2022 },
  { title: 'The Truman Show', year: 1998 },
  { title: 'Ratatouille', year: 2007 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Your Name.', year: 2016 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Chernobyl', year: 2019 },
  { title: 'Breaking Bad', year: 2008 },
  { title: 'Game of Thrones', year: 2011 },
  { title: 'Stranger Things', year: 2016 },
  { title: 'The Last of Us', year: 2023 },
  { title: 'Avatar', year: 2009 }
];

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
  console.log(`Starting poster resolution for ${newTitles.length} new titles...`);
  let seedFileContent = fs.readFileSync(seedFilePath, 'utf8');

  for (const item of newTitles) {
    const title = item.title;
    const year = item.year;
    console.log(`Checking "${title}" (${year})...`);

    const data = await fetchOmdb(title, year);
    if (data && data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      const rawPoster = data.Poster;
      const cleanPoster = cleanPosterUrl(rawPoster);
      console.log(`  Found poster: ${rawPoster} -> Cleaned: ${cleanPoster}`);

      // Update in seed.js file so they match permanently
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
  process.exit(0);
}

run().catch(console.error);
