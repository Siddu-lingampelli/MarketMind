import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { loading } = useApiKey();

  if (loading) {
    return <div className="home-loading">Loading…</div>;
  }

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-logo">MarketMind</div>
        <button className="btn-pill btn-pill-sm" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </nav>

      <section className="tile hero-tile">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          <span>For revenue teams</span>
        </div>
        <h1>AI that decides<br />your next move.</h1>
        <p className="hero-subtitle">
          Campaigns, pitches, and lead decisions — generated in real time.
        </p>
        <div className="hero-actions">
          <button className="btn-pill" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
        </div>
        <p className="hero-fineprint">Free forever · No signup · No data stored</p>
      </section>

      <section className="tile tile-parchment workflow-tile">
        <div className="section-header">
          <p className="eyebrow">Workflow</p>
          <h2>Three steps to ship.</h2>
        </div>
        <div className="workflow-steps">
          <div className="step">
            <div className="step-number">01</div>
            <h4>Define</h4>
            <p>Describe your audience, goals, and tone in plain English.</p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <h4>Generate</h4>
            <p>Real-time AI produces strategies, pitches, and lead scores.</p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <h4>Ship</h4>
            <p>Export to PDF, copy to clipboard, or paste into your tools.</p>
          </div>
        </div>
      </section>

      <section className="tile tile-light pillars-tile">
        <div className="section-header">
          <p className="eyebrow">Why MarketMind</p>
          <h2>Built for speed.</h2>
        </div>
        <div className="pillars-grid">
          <div className="pillar">
            <h4>Real-time inference</h4>
            <p>Powered by Groq's fastest models. Most generations return in under a second.</p>
          </div>
          <div className="pillar">
            <h4>Private by design</h4>
            <p>Your API key stays server-side. Prompts and outputs are never stored.</p>
          </div>
          <div className="pillar">
            <h4>Free to use</h4>
            <p>No credit card. No usage caps. Runs on Vercel's free tier, 24/7.</p>
          </div>
        </div>
      </section>

      <section className="tile tile-dark cta-tile">
        <h2>Ready to grow?</h2>
        <p>Start generating in seconds.</p>
        <button className="btn-pill" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
      </section>

      <footer className="home-footer">
        <p className="footer-brand">MarketMind</p>
        <p className="footer-fineprint">© 2026 MarketMind. Powered by Groq AI.</p>
      </footer>
    </div>
  );
};

export default Home;
