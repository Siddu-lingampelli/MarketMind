import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scoreLead } from '../services/leadService';
import './LeadScoring.css';

const LeadScoring = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    need: '',
    urgency: '',
    authority: '',
    emailContext: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const urgencyLevels = [
    'Immediate (within 1 month)',
    'Short-term (1-3 months)',
    'Medium-term (3-6 months)',
    'Long-term (6+ months)',
    'Exploring options',
  ];
  const getActionIcon = (action) => {
    const text = action.toLowerCase();
    if (text.includes('call') || text.includes('phone')) return '▸';
    if (text.includes('email') || text.includes('send')) return '▸';
    if (text.includes('demo') || text.includes('meeting')) return '▸';
    if (text.includes('wait') || text.includes('follow up')) return '▸';
    if (text.includes('proposal') || text.includes('quote')) return '▸';
    return '▸';
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate: Either manual fields OR email context required
    if (!formData.emailContext && (!formData.budget || !formData.need || !formData.urgency)) {
      setError('Please fill in lead details OR paste an email conversation');
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const response = await scoreLead(formData);
      setResult(response.data);
      
      // Save to recent activity
      const recent = JSON.parse(localStorage.getItem('recentLeads') || '[]');
      recent.unshift({ name: formData.name, score: response.data.score, category: response.data.category, date: new Date().toISOString() });
      localStorage.setItem('recentLeads', JSON.stringify(recent.slice(0, 10)));
    } catch (err) {
      console.error('Lead scoring error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to score lead';
      setError(errorMsg);
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
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span>
          <span>Back</span>
        </button>
        <h1 className="workspace-title">Lead Intelligence</h1>
        <p className="workspace-subtitle">AI-powered lead scoring and qualification</p>
      </div>

      <div className="split-workspace">
        {/* LEFT PANEL: INPUT */}
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Lead Details</h3>
            <div style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.08)',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '13px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)'
            }}>
              💡 <strong>Two ways to score:</strong><br/>
              1. Fill in manual fields below, OR<br/>
              2. Just paste an email conversation
            </div>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="name">
                  Lead Name / Company
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '8px' }}>
                    (or paste email below)
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div className="form-field">
                <label htmlFor="budget">Budget (Optional)</label>
                <textarea
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Budget information..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="need">Business Need (Optional)</label>
                <textarea
                  id="need"
                  name="need"
                  value={formData.need}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Problem or need..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="urgency">Urgency Level (Optional)</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="">Select urgency</option>
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="authority">Decision Authority</label>
                <textarea
                  id="authority"
                  name="authority"
                  value={formData.authority}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Role and decision power..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="emailContext">
                  Email Conversation (Optional)
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '8px' }}>
                    AI analyzes tone & urgency
                  </span>
                </label>
                <textarea
                  id="emailContext"
                  name="emailContext"
                  value={formData.emailContext}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Paste recent email conversation with the lead (optional)..."
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Scoring...' : 'Score Lead'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT */}
        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">●</div>
              <h3>Ready to Score</h3>
              <p>Enter lead information or paste an email conversation to get started</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">!</div>
              <h3>Scoring Failed</h3>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loader"></div>
              <h3>Analyzing Lead</h3>
              <p>AI is evaluating qualification criteria...</p>
            </div>
          )}

          {result && (
            <div className="output-content">
              {/* SECTION 1: SCORE & PROBABILITY */}
              <div className="score-section">
                {formData.emailContext && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>●</span>
                    <span style={{ fontWeight: 600 }}>Email influence detected</span>
                    <span style={{ color: 'var(--text-secondary)' }}>— AI analyzed conversation context</span>
                  </div>
                )}
                <div className="score-display">
                  <div className="score-main">
                    <div className="score-number" style={{ color: getScoreColor(result.score) }}>
                      {result.score}
                    </div>
                    <div className="score-label">Lead Score</div>
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${result.score}%`,
                        backgroundColor: getScoreColor(result.score)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="score-metrics">
                  <div className="score-metric">
                    <div className="metric-label">Category</div>
                    <div 
                      className="metric-badge"
                      style={{
                        color: getScoreColor(result.score),
                        backgroundColor: `${getScoreColor(result.score)}15`
                      }}
                    >
                      {result.category}
                    </div>
                  </div>
                  <div className="score-metric">
                    <div className="metric-label">Conversion Probability</div>
                    <div className="metric-value">{result.conversionProbability}%</div>
                  </div>
                </div>
              </div>

              {/* BEST NEXT ACTION - PROMINENT */}
              {result.nextActions && result.nextActions.length > 0 && result.nextActions[0] && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, var(--bg-surface) 100%)',
                  border: '2px solid var(--accent)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}>
                    Recommended Next Action
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      fontSize: '40px',
                      lineHeight: 1,
                      flexShrink: 0
                    }}>
                      {getActionIcon(result.nextActions[0].action)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.3
                      }}>
                        {result.nextActions[0].action}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        marginBottom: '10px',
                        lineHeight: 1.5
                      }}>
                        {result.explanation?.split('.')[0] || 'Based on lead score and urgency analysis'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          background: 'var(--accent)',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          ⏱️ {result.nextActions[0].timeline}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                          Priority: <strong>{result.nextActions[0].priority}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: REASONING */}
              <div className="output-section">
                <div className="section-label">AI Scoring Analysis</div>
                <p className="section-content">{result.explanation}</p>
              </div>

              {/* DETAILED BREAKDOWN */}
              {result.explanationBreakdown && (
                <div className="output-section">
                  <div className="section-label">Detailed Assessment Breakdown</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{
                      padding: '16px',
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#10B981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Budget Analysis
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6
                      }}>
                        {result.explanationBreakdown.budget_analysis}
                      </div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#3B82F6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Need Analysis
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6
                      }}>
                        {result.explanationBreakdown.need_analysis}
                      </div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#F59E0B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Urgency Analysis
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6
                      }}>
                        {result.explanationBreakdown.urgency_analysis}
                      </div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#8B5CF6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Authority Analysis
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6
                      }}>
                        {result.explanationBreakdown.authority_analysis}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: NEXT ACTIONS */}
              {result.nextActions && result.nextActions.length > 0 && (
                <div className="output-section">
                  <div className="section-label">All Recommended Actions</div>
                  <div className="next-actions-list">
                    {result.nextActions.map((action, index) => (
                      <div key={index} className="action-item">
                        <div className="action-header">
                          <span className="action-number">{index + 1}</span>
                          <span 
                            className={`action-priority priority-${action.priority.toLowerCase()}`}
                          >
                            {action.priority}
                          </span>
                          <span className="action-timeline">{action.timeline}</span>
                        </div>
                        <div className="action-text">{action.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FALLBACK: SINGLE ACTION */}
              {(!result.nextActions || result.nextActions.length === 0) && result.nextAction && (
                <div className="output-section">
                  <div className="section-label">Recommended Action</div>
                  <div className="action-box">
                    {result.nextAction}
                  </div>
                </div>
              )}

              {/* AI CONFIDENCE SCORE */}
              {result.confidenceScore && (
                <div className="output-section">
                  <div className="section-label">AI Confidence Score</div>
                  <div style={{
                    background: result.confidenceScore >= 80 ? 'rgba(16, 185, 129, 0.08)' : result.confidenceScore >= 60 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${result.confidenceScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : result.confidenceScore >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{
                      fontSize: '36px',
                      fontWeight: 700,
                      color: result.confidenceScore >= 80 ? '#10B981' : result.confidenceScore >= 60 ? '#F59E0B' : '#EF4444',
                      marginBottom: '8px',
                      letterSpacing: '-1px'
                    }}>
                      {result.confidenceScore}%
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}>
                      {result.confidenceReasoning || 'Based on clarity of budget, urgency, and email signals'}
                    </div>
                  </div>
                </div>
              )}

              {/* RISK ALERTS */}
              {result.risks && result.risks.length > 0 && (
                <div className="output-section">
                  <div className="section-label">Potential Risks</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.risks.map((risk, index) => (
                      <div key={index} style={{
                        padding: '12px 16px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderLeft: '3px solid #F59E0B',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>!</span>
                        <span>{risk}</span>
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
