// scripts/indexnow.js
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const KEY = process.env.VITE_INDEXNOW_KEY
const SITE = process.env.VITE_SITE_URL

console.log('Environment Check:')
console.log('- VITE_INDEXNOW_KEY:', KEY ? '✓ Found' : '❌ Missing')
console.log('- VITE_SITE_URL:', SITE ? '✓ Found' : '❌ Missing')

if (!KEY || !SITE) {
  console.error('❌ Missing required environment variables')
  console.error('Please ensure you have a .env file in the project root with:')
  console.error('VITE_INDEXNOW_KEY=your-key')
  console.error('VITE_SITE_URL=your-site-url')
  process.exit(1)
}

// Read your dist/sitemap.xml
const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml')
console.log('\nChecking sitemap:')
console.log('- Looking for:', sitemapPath)

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap.xml not found in dist/')
  console.error('Please ensure you have built your site first (npm run build)')
  process.exit(1)
}

console.log('- Sitemap found ✓')

const xml = fs.readFileSync(sitemapPath, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

if (!urls.length) {
  console.error('❌ No <loc> entries found in sitemap.xml')
  process.exit(1)
}

console.log(`- Found ${urls.length} URLs in sitemap ✓`)

console.log('\nSubmitting to IndexNow:')
axios.post('https://api.indexnow.org/indexnow', urls, {
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': KEY
  },
  params: {
    host: SITE.replace(/^https?:\/\//, ''),  // e.g. kontanibo.com
    key: KEY
  }
})
.then(res => {
  console.log('✅ IndexNow ping successful!', res.data)
})
.catch(err => {
  console.error('❌ IndexNow ping failed:', err.response?.data || err.message)
  process.exit(1)
}) 