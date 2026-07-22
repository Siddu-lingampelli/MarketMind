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
        <div className="home-logo">MarketMind</div>
        <button className="btn-pill" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </nav>

      <section className="tile-light">
        <div className="tile-content">
          <h1>AI that decides your next revenue move</h1>
          <p className="tile-lead">Campaigns, pitches, and lead decisions — generated in real time.</p>
          <div className="tile-actions">
            <button className="btn-pill" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
          </div>
        </div>
      </section>

      <section className="tile-dark">
        <div className="tile-content">
          <h2>Lead Intelligence</h2>
          <p className="tile-lead">AI-qualified leads with explainable probability scoring.</p>
          <div className="tile-actions">
            <button className="btn-pill" onClick={() => navigate('/lead-scoring')}>Score Leads</button>
          </div>
        </div>
      </section>

      <section className="tile-parchment">
        <div className="tile-content">
          <h2>Campaign Intelligence</h2>
          <p className="tile-lead">Revenue strategies with messaging frameworks tailored to your audience.</p>
          <div className="tile-actions">
            <button className="btn-pill" onClick={() => navigate('/campaign')}>Generate Campaign</button>
          </div>
        </div>
      </section>

      <section className="tile-dark">
        <div className="tile-content">
          <h2>Pitch Engine</h2>
          <p className="tile-lead">Executive presentations built from customer context in seconds.</p>
          <div className="tile-actions">
            <button className="btn-pill" onClick={() => navigate('/pitch')}>Create Pitch</button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>MarketMind · Powered by Groq AI</p>
      </footer>
    </div>
  );
};

export default Home;
