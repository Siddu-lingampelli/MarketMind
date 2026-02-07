import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-nav-content">
          <div className="home-logo">MarketMind</div>
          <div className="home-nav-actions">
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-hero-glow"></div>
        <div className="home-hero-content">
          <h1>AI that decides your next revenue move</h1>
          <p className="home-hero-subtitle">
            Campaigns, pitches, and lead decisions — generated in real time.
          </p>
          <button className="btn-hero" onClick={() => navigate('/register')}>
            Generate intelligence
          </button>
          <div className="live-strip">
            <span className="live-indicator">●</span>
            <span className="live-text">New lead analyzed → Score 92 → Action: Schedule demo</span>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="home-features-content">
          <div className="home-feature home-feature-primary">
            <h3>Lead Intelligence</h3>
            <p>AI-qualified leads with explainable probability scoring</p>
          </div>
          <div className="home-feature-secondary-grid">
            <div className="home-feature">
              <h3>Campaign Intelligence</h3>
              <p>Revenue strategies with messaging frameworks</p>
            </div>
            <div className="home-feature">
              <h3>Pitch Engine</h3>
              <p>Executive presentations from customer context</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>MarketMind · Enterprise AI</p>
      </footer>
    </div>
  );
};

export default Home;
