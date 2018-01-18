import { Scraper } from './scraper'

// Only run if <startUrl> argument is present with 'npm start' command
if (process.argv[4]) {
  new Scraper().start(process.argv[4])
} else { console.log('Please provide start url') }
