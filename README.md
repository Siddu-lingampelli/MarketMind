# MarketMind

AI-powered marketing toolkit — campaign generation, sales pitches, and lead scoring. Zero backend, zero database. Runs entirely in the browser.

## Features

- **Campaign Intelligence** — Generate multi-channel marketing campaigns with target audience, channels, budget, and KPIs.
- **Sales Pitch Engine** — Craft personalized sales pitches for any product or service.
- **Lead Intelligence** — Score and qualify leads based on fit and intent.

## How it Works

1. Get a free API key from [Groq Console](https://console.groq.com)
2. Set the key in `frontend/.env`:
   ```
   REACT_APP_GROQ_API_KEY=gsk_your_key_here
   ```
3. Open the app — the key loads automatically. All AI calls go directly from your browser to Groq's API. No data leaves through a backend.

The API key is baked into the production build. To change it, update `.env` and rebuild.

## Quick Start

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`.

## Production Build

```bash
cd frontend
npm run build
```

Deploy the `build/` folder to any static host (Vercel, Netlify, GitHub Pages).

## Tech Stack

- React (Create React App)
- Groq API (llama-3.3-70b-versatile)
- No backend, no database, no auth

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/     # Navbar, Sidebar, PrivateRoute
│   ├── context/        # ApiKeyContext
│   ├── pages/          # Home, Dashboard, Campaign, SalesPitch, LeadScoring
│   └── services/       # groqClient (single API client)
├── .env                # API key (gitignored in production)
└── package.json
```
