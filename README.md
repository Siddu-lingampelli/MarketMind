# MarketMind

**AI sales & marketing intelligence for revenue teams.**

MarketMind turns a short product brief into usable go-to-market output — campaign strategy, sales pitches, and lead qualification scores — generated in real time by a large language model. It is a single-page web app with a thin serverless API layer. Nothing is stored: no accounts, no database, no retained prompts or outputs.

---

## Why this exists

Most marketing and sales teams spend the first hour of every task reinventing the same draft: a campaign outline, a cold pitch, a lead-rating call. MarketMind compresses that first hour to a few seconds. You describe what you're selling and to whom; the model returns structured, copy-ready output you can edit, export, and ship.

It is a **drafting engine**, not an analytics platform. The scores and copy are starting points informed by your inputs, not measured outcomes.

---

## What it does

Three tools, one interface.

### 1. Campaign Intelligence
Generate a full campaign plan from a product description, target audience, platform, objective, and tone.

**Output**
- Campaign objective
- 5 content ideas
- 3 ad-copy variations
- 3 calls-to-action

**Export:** PDF report, plain-text file, or clipboard copy.

### 2. Sales Pitch Engine
Generate a tailored pitch from product, customer persona, industry, company size, and budget.

**Modes:** Elevator (30s) · Email · LinkedIn message · Executive

**Output**
- Elevator pitch
- Value proposition
- 3 key differentiators
- Call-to-action

**Export:** PDF report, plain-text file, or clipboard copy.

### 3. Lead Intelligence
Score and qualify a lead from structured fields or a pasted email conversation.

**Inputs (either/or):** company name, budget, business need, urgency, decision authority — *or* a raw email thread.

**Output**
- Lead score (0–100)
- Priority category (Hot / Warm / Lukewarm / Cold)
- Estimated conversion probability
- Plain-language reasoning
- Recommended next actions with priority and timeline

---

## Architecture

```
Browser (React)
   │  POST /api/groq
   ▼
Serverless function (frontend/api/groq.js)
   │  Bearer GROQ_API_KEY
   ▼
Groq API  →  llama-3.3-70b-versatile
```

- **Frontend:** React 18 (Create React App), React Router for navigation, React Icons for UI.
- **AI client:** `frontend/src/services/groqClient.js` — one fetch wrapper, three exported generators. All responses are parsed as JSON and fall back to sensible defaults if the model returns malformed output.
- **API proxy:** `frontend/api/groq.js` — a serverless function that holds the Groq key server-side and forwards chat-completion requests. The key never reaches the browser.
- **State:** API key context is stubbed (`hasKey` defaults to `true`) because the app runs keyless behind the proxy in production.
- **No persistence layer.** Every result lives only in the current browser session. Refreshing clears it.

---

## Local development

Requirements: Node.js 18+ and a Groq API key ([console.groq.com](https://console.groq.com)).

```bash
cd frontend
npm install
echo "GROQ_API_KEY=your_key_here" > .env
npm start
```

The app runs at `http://localhost:3000`. The `/api/groq` route is served locally via the CRA proxy / a compatible dev server.

---

## Deployment

Two parts must be deployed together:

1. **Static build** — `cd frontend && npm run build` produces `build/`. Host it on Vercel, Netlify, GitHub Pages, or any static CDN.
2. **API function** — `frontend/api/groq.js` must run on a serverless runtime (Vercel Functions or Netlify Functions). Set `GROQ_API_KEY` as an environment variable in the hosting dashboard.

> If you deploy only the static `build/` folder without the serverless function, the AI calls will fail. The proxy is required.

---

## Model

`llama-3.3-70b-versatile`, served through Groq. Groq's infrastructure returns completions in well under a second for typical prompts, which is what makes the "real-time" feel possible.

Output quality tracks input quality. A vague brief yields a vague draft; a specific one (named platform, defined audience, concrete budget) yields something close to usable. Treat all output as a first pass to review and edit, not a final deliverable.

---

## Project structure

```
MarketMind/
├── design.md                 # Apple-inspired design system spec
└── frontend/
    ├── api/
    │   └── groq.js           # Serverless proxy (holds GROQ_API_KEY)
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── App.js            # Routes + layout
        ├── context/
        │   └── ApiKeyContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Sidebar.js
        │   └── PrivateRoute.js
        ├── pages/
        │   ├── Home.js
        │   ├── Dashboard.js
        │   ├── Campaign.js
        │   ├── SalesPitch.js
        │   └── LeadScoring.js
        └── services/
            └── groqClient.js  # Single AI client, 3 generators
```

---

## Known limitations

- **No history.** Results are session-only by design. There is no way to recall a past generation after refresh.
- **No collaboration.** Single-user, single-session. No shared workspaces or team accounts.
- **Model variance.** Same inputs can produce different output across runs (temperature > 0).
- **No evaluation.** Scores are model estimates, not validated against your pipeline data.

---

## License

MIT — free to use, modify, and redistribute.
