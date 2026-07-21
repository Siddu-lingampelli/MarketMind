import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { loading } = useApiKey();

  if (loading) return <div className="home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-nav-content">
          <div className="home-logo">MarketMind</div>
          <div className="home-nav-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-hero-glow"></div>
        <div className="home-hero-content">
          <h1>AI that decides your next revenue move</h1>
          <p className="home-hero-subtitle">Campaigns, pitches, and lead decisions — generated in real time.</p>
          <button className="btn-hero" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <div className="live-strip">
            <span className="live-indicator">●</span>
            <span className="live-text">Free · No backend · Your API key stays in your browser</span>
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

      <footer className="home-footer"><p>MarketMind · Powered by Groq AI</p></footer>
    </div>
  );
};

export default Home;
