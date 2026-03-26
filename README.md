# FounderTrace Pro

Apollo-powered founder search, lead tracker & AI email generator.

## Features
- ⚡ Direct Apollo API search (275M+ contacts)
- 📋 Lead tracker with outreach status
- ✉️ AI cold email generator (Claude-powered)
- 📊 Stats dashboard
- 🔐 Optional PIN lock
- 👥 Multi-profile support

## Deploy to Render (Free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects the config from `render.yaml`
5. Click **Deploy**

Your app will be live at `https://foundertrace-pro.onrender.com` (or similar).

## Setup After Deploy

1. Open the app URL
2. Go to **Settings → Apollo API Key**
3. Paste your Apollo API key (get it at [developer.apollo.io](https://developer.apollo.io))
4. Click **Save Key** — you're ready to search!

## Local Development

```bash
npm install
npm start
# Open http://localhost:3000
```

## Notes

- All data (leads, history, settings) is stored in the **browser's localStorage** — it stays on the user's device
- The Apollo API key is saved locally per-browser; share your key with teammates via Settings
- The app works offline after first load (PWA / service worker)
