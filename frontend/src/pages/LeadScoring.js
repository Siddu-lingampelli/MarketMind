import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scoreLead } from '../services/groqClient';
import './LeadScoring.css';

const LeadScoring = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', budget: '', need: '', urgency: '', authority: '', emailContext: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const urgencyLevels = ['Immediate (within 1 month)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Long-term (6+ months)', 'Exploring options'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.emailContext && (!formData.budget || !formData.need || !formData.urgency)) {
      setError('Please fill in lead details OR paste an email conversation');
      return;
    }
    setLoading(true); setResult(null);
    try {
      const data = await scoreLead(
        formData.name, formData.budget, formData.need, formData.urgency,
        formData.authority, formData.emailContext
      );
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to score lead');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#EF4444';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#3B82F6';
    return '#6B7280';
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <button className="back-button" onClick={() => navigate(-1)}><span>←</span><span>Back</span></button>
        <h1 className="workspace-title">Lead Intelligence</h1>
        <p className="workspace-subtitle">AI-powered lead scoring and qualification</p>
      </div>

      <div className="split-workspace">
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Lead Details</h3>
            <div style={{ padding: 12, background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, marginBottom: 20, fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              💡 <strong>Two ways to score:</strong><br/>1. Fill in manual fields below, OR<br/>2. Just paste an email conversation
            </div>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="name">Lead Name / Company <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: 12, marginLeft: 8 }}>(or paste email below)</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Acme Corp" />
              </div>
              <div className="form-field">
                <label htmlFor="budget">Budget (Optional)</label>
                <textarea id="budget" name="budget" value={formData.budget} onChange={handleChange} rows="3" placeholder="Budget information..." />
              </div>
              <div className="form-field">
                <label htmlFor="need">Business Need (Optional)</label>
                <textarea id="need" name="need" value={formData.need} onChange={handleChange} rows="3" placeholder="Problem or need..." />
              </div>
              <div className="form-field">
                <label htmlFor="urgency">Urgency Level (Optional)</label>
                <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange}>
                  <option value="">Select urgency</option>
                  {urgencyLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="authority">Decision Authority</label>
                <textarea id="authority" name="authority" value={formData.authority} onChange={handleChange} rows="2" placeholder="Role and decision power..." />
              </div>
              <div className="form-field">
                <label htmlFor="emailContext">Email Conversation (Optional)</label>
                <textarea id="emailContext" name="emailContext" value={formData.emailContext} onChange={handleChange} rows="4" placeholder="Paste recent email conversation with the lead (optional)..." />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Scoring...' : 'Score Lead'}</button>
            </form>
          </div>
        </div>

        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state"><div className="empty-icon">●</div><h3>Ready to Score</h3><p>Enter lead information or paste an email conversation to get started</p></div>
          )}
          {error && <div className="error-state"><div className="error-icon">!</div><h3>Scoring Failed</h3><p>{error}</p></div>}
          {loading && <div className="loading-state"><div className="loader"></div><h3>Analyzing Lead</h3><p>AI is evaluating qualification criteria...</p></div>}

          {result && (
            <div className="output-content">
              <div className="score-section">
                <div className="score-display">
                  <div className="score-main">
                    <div className="score-number" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                    <div className="score-label">Lead Score</div>
                  </div>
                  <div className="score-bar"><div className="score-fill" style={{ width: `${result.score}%`, backgroundColor: getScoreColor(result.score) }}></div></div>
                </div>
                <div className="score-metrics">
                  <div className="score-metric">
                    <div className="metric-label">Category</div>
                    <div className="metric-badge" style={{ color: getScoreColor(result.score), backgroundColor: `${getScoreColor(result.score)}15` }}>{result.category}</div>
                  </div>
                  <div className="score-metric">
                    <div className="metric-label">Conversion Probability</div>
                    <div className="metric-value">{result.conversionProbability}%</div>
                  </div>
                </div>
              </div>

              {result.nextActions && result.nextActions.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, var(--bg-surface) 100%)', border: '2px solid var(--accent)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Recommended Next Action</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>{result.nextActions[0].action}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ padding: '4px 10px', background: 'var(--accent)', color: 'white', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>⏱️ {result.nextActions[0].timeline}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Priority: <strong>{result.nextActions[0].priority}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="output-section"><div className="section-label">AI Scoring Analysis</div><p className="section-content">{result.explanation}</p></div>

              {result.nextActions && result.nextActions.length > 0 && (
                <div className="output-section">
                  <div className="section-label">All Recommended Actions</div>
                  <div className="next-actions-list">
                    {result.nextActions.map((action, i) => (
                      <div key={i} className="action-item">
                        <div className="action-header">
                          <span className="action-number">{i + 1}</span>
                          <span className={`action-priority priority-${(action.priority || '').toLowerCase()}`}>{action.priority}</span>
                          <span className="action-timeline">{action.timeline}</span>
                        </div>
                        <div className="action-text">{action.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;
