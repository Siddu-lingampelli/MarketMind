import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaBullhorn, FaChartLine, FaArrowRight } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState({
    campaigns: [],
    pitches: [],
    leads: []
  });

  useEffect(() => {
    const campaigns = JSON.parse(localStorage.getItem('recentCampaigns') || '[]');
    const pitches = JSON.parse(localStorage.getItem('recentPitches') || '[]');
    const leads = JSON.parse(localStorage.getItem('recentLeads') || '[]');
    
    setRecentActivity({
      campaigns: campaigns.slice(0, 5),
      pitches: pitches.slice(0, 5),
      leads: leads.slice(0, 5)
    });
  }, []);

  const allActivity = [
    ...recentActivity.campaigns.map(c => ({ type: 'Campaign', name: c.product || 'Campaign', detail: c.platform, date: c.date })),
    ...recentActivity.pitches.map(p => ({ type: 'Pitch', name: p.product || 'Pitch', detail: p.industry, date: p.date })),
    ...recentActivity.leads.map(l => ({ type: 'Lead', name: l.name || 'Lead', detail: `Score: ${l.score}`, date: l.date, category: l.category }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  const metrics = {
    campaigns: recentActivity.campaigns.length,
    pitches: recentActivity.pitches.length,
    leads: recentActivity.leads.length,
    hotLeads: recentActivity.leads.filter(l => l.category === 'Hot').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div>
          <h1 className="workspace-title">Dashboard</h1>
          <p className="workspace-subtitle">Intelligence overview and quick actions</p>
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Campaigns</div>
          <div className="metric-value">{metrics.campaigns}</div>
          <div className="metric-change">Generated this week</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Sales Pitches</div>
          <div className="metric-value">{metrics.pitches}</div>
          <div className="metric-change">Created this week</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Leads Scored</div>
          <div className="metric-value">{metrics.leads}</div>
          <div className="metric-change">Analyzed this week</div>
        </div>
        <div className="metric-card metric-card-hot">
          <div className="metric-label">Hot Leads</div>
          <div className="metric-value metric-value-hot">{metrics.hotLeads}</div>
          <div className="metric-change">Requires immediate action</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="workspace-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-button action-primary" onClick={() => navigate('/campaign')}>
            <div className="action-icon"><FaBullhorn /></div>
            <div className="action-content">
              <div className="action-title">Generate Campaign</div>
              <div className="action-desc">Create multi-channel marketing campaign</div>
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

      {/* Recent Activity */}
      {allActivity.length > 0 && (
        <div className="workspace-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {allActivity.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`activity-type activity-type-${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="activity-name">{item.name}</td>
                    <td className="activity-detail">
                      {item.category && (
                        <span className={`lead-badge lead-badge-${item.category.toLowerCase()}`}>
                          {item.category}
                        </span>
                      )}
                      {item.detail}
                    </td>
                    <td className="activity-time">{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
