import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaBullhorn, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    { id: 'campaign', label: 'Campaign Intelligence', desc: 'Generate marketing strategy', icon: <FaBullhorn />, path: '/campaign' },
    { id: 'pitch', label: 'Sales Pitch Engine', desc: 'Create personalized pitch', icon: <FaRocket />, path: '/pitch' },
    { id: 'lead', label: 'Lead Intelligence', desc: 'Score and qualify leads', icon: <FaChartLine />, path: '/lead-scoring' },
  ];

  return (
    <div className="page">
      <div style={{ marginBottom: 48 }}>
        <h2>Dashboard</h2>
        <p className="tile-lead" style={{ marginBottom: 0 }}>Intelligence tools — no backend, no database</p>
      </div>

      <div className="metrics-strip">
        <div className="metric-item">
          <div className="metric-label">Campaigns</div>
          <div className="metric-value">∞</div>
          <div className="metric-desc">Unlimited</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Pitches</div>
          <div className="metric-value">∞</div>
          <div className="metric-desc">Unlimited</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Leads</div>
          <div className="metric-value">∞</div>
          <div className="metric-desc">Unlimited</div>
        </div>
        <div className="metric-item metric-item-accent">
          <div className="metric-label">Cost</div>
          <div className="metric-value">$0</div>
          <div className="metric-desc">Free forever</div>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h4 style={{ marginBottom: 17 }}>Quick Actions</h4>
        <div className="action-grid">
          {actions.map(a => (
            <button key={a.id} className="card action-card" onClick={() => navigate(a.path)}>
              <div className="action-card-icon">{a.icon}</div>
              <div className="action-card-label">{a.label}</div>
              <div className="action-card-desc">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
