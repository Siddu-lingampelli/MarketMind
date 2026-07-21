import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaBullhorn, FaChartLine, FaArrowRight } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div>
          <h1 className="workspace-title">Dashboard</h1>
          <p className="workspace-subtitle">Intelligence tools — no backend, no database</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Campaigns</div>
          <div className="metric-value">∞</div>
          <div className="metric-change">Generate unlimited strategies</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Sales Pitches</div>
          <div className="metric-value">∞</div>
          <div className="metric-change">Create unlimited pitches</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Leads</div>
          <div className="metric-value">∞</div>
          <div className="metric-change">Score unlimited leads</div>
        </div>
        <div className="metric-card metric-card-hot">
          <div className="metric-label">Cost</div>
          <div className="metric-value metric-value-hot">$0</div>
          <div className="metric-change">Free to run forever</div>
        </div>
      </div>

      <div className="workspace-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-button action-primary" onClick={() => navigate('/campaign')}>
            <div className="action-icon"><FaBullhorn /></div>
            <div className="action-content">
              <div className="action-title">Generate Campaign</div>
              <div className="action-desc">Create marketing campaign strategy</div>
            </div>
            <FaArrowRight className="action-arrow" />
          </button>
          <button className="action-button" onClick={() => navigate('/pitch')}>
            <div className="action-icon"><FaRocket /></div>
            <div className="action-content">
              <div className="action-title">Generate Pitch</div>
              <div className="action-desc">Create personalized sales pitch</div>
            </div>
            <FaArrowRight className="action-arrow" />
          </button>
          <button className="action-button" onClick={() => navigate('/lead-scoring')}>
            <div className="action-icon"><FaChartLine /></div>
            <div className="action-content">
              <div className="action-title">Score Lead</div>
              <div className="action-desc">Analyze and qualify new lead</div>
            </div>
            <FaArrowRight className="action-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
