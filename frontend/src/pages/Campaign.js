import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCampaign } from '../services/campaignService';
import { FaCopy, FaCheck, FaDownload, FaFlask } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './Campaign.css';

const Campaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    campaignObjective: 'lead-generation',
    platform: '',
    tone: 'professional',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [abVariants, setAbVariants] = useState(null);
  const [abLoading, setAbLoading] = useState(false);

  const platforms = [
    'LinkedIn',
    'Instagram',
    'Facebook',
    'Twitter',
    'Email',
    'Google Ads',
    'TikTok',
    'YouTube',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await generateCampaign(formData);
      setResult(response.data);
      
      // Save to recent activity
      const recent = JSON.parse(localStorage.getItem('recentCampaigns') || '[]');
      recent.unshift({ product: formData.productName, platform: formData.platform, date: new Date().toISOString() });
      localStorage.setItem('recentCampaigns', JSON.stringify(recent.slice(0, 10)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate campaign');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllResults = () => {
    if (!result) return;

    const text = `
Campaign Objective:
${result.objective}

Content Ideas:
${result.contentIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

Ad Copies:
${result.adCopies.map((copy, i) => `${i + 1}. ${copy}`).join('\n')}

Call-to-Actions:
${result.ctas.map((cta, i) => `${i + 1}. ${cta}`).join('\n')}
    `.trim();

    copyToClipboard(text);
  };

  const exportAsPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Campaign Strategy Report', margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Product: ${formData.product}`, margin, yPos);
    yPos += 7;
    doc.text(`Platform: ${formData.platform}`, margin, yPos);
    yPos += 7;
    doc.text(`Objective: ${result.objective}`, margin, yPos);
    yPos += 15;

    // Content Ideas
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Content Ideas', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    result.contentIdeas.forEach((idea, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${idea}`, maxWidth - 5);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 6 + 3;
    });
    yPos += 7;

    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Ad Copies
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Ad Copies', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    result.adCopies.forEach((ad, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${ad}`, maxWidth - 5);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 6 + 3;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`${formData.product.replace(/\s+/g, '_')}_Campaign.pdf`);
    setShowExportMenu(false);
  };

  const exportAsTXT = () => {
    if (!result) return;
    
    let text = `CAMPAIGN STRATEGY REPORT\n`;
    text += `Product: ${formData.product}\n`;
    text += `Platform: ${formData.platform}\n`;
    text += `Objective: ${result.objective}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `\n${'='.repeat(60)}\n\n`;
    
    text += `CONTENT IDEAS\n`;
    text += `${'-'.repeat(60)}\n`;
    result.contentIdeas.forEach((idea, index) => {
      text += `${index + 1}. ${idea}\n`;
    });
    text += `\n`;
    
    text += `AD COPIES\n`;
    text += `${'-'.repeat(60)}\n`;
    result.adCopies.forEach((ad, index) => {
      text += `${index + 1}. ${ad}\n\n`;
    });
    
    text += `CALLS-TO-ACTION\n`;
    text += `${'-'.repeat(60)}\n`;
    result.ctas.forEach((cta, index) => {
      text += `${index + 1}. ${cta}\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${formData.product.replace(/\s+/g, '_')}_Campaign.txt`);
    setShowExportMenu(false);
  };

  const generateABVariants = async () => {
    if (!result) return;
    
    setAbLoading(true);
    try {
      // Generate mock A/B variants with variations
      setAbVariants([
        {
          version: 'B',
          headline: result.adCopies[0].split('.')[0] + ' - Transform Your Business Today',
          cta: 'Start Your Free Trial',
          predictedCTR: '4.2%',
          predictedConversion: '2.8%',
          recommendation: 'More action-oriented language'
        },
        {
          version: 'C',
          headline: result.adCopies[0].split('.')[0] + ' - Join 10,000+ Happy Customers',
          cta: 'See How It Works',
          predictedCTR: '3.9%',
          predictedConversion: '2.5%',
          recommendation: 'Social proof emphasis'
        }
      ]);
    } catch (err) {
      console.error('Failed to generate A/B variants:', err);
    } finally {
      setAbLoading(false);
    }
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span>
          <span>Back</span>
        </button>
        <h1 className="workspace-title">Campaign Intelligence</h1>
        <p className="workspace-subtitle">Generate data-driven marketing strategies</p>
      </div>

      <div className="split-workspace">
        {/* LEFT PANEL: INPUT */}
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Configuration</h3>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="product">Product/Service</label>
                <textarea
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your offering..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="audience">Target Audience</label>
                <textarea
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Demographics, interests..."
                />
              </div>

              <div className="form-field">
                <label>Campaign Objective</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="campaignObjective"
                      value="brand-awareness"
                      checked={formData.campaignObjective === 'brand-awareness'}
                      onChange={handleChange}
                    />
                    <span>Brand Awareness</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="campaignObjective"
                      value="lead-generation"
                      checked={formData.campaignObjective === 'lead-generation'}
                      onChange={handleChange}
                    />
                    <span>Lead Generation</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="campaignObjective"
                      value="product-launch"
                      checked={formData.campaignObjective === 'product-launch'}
                      onChange={handleChange}
                    />
                    <span>Product Launch</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="campaignObjective"
                      value="conversions"
                      checked={formData.campaignObjective === 'conversions'}
                      onChange={handleChange}
                    />
                    <span>Conversions</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="campaignObjective"
                      value="retargeting"
                      checked={formData.campaignObjective === 'retargeting'}
                      onChange={handleChange}
                    />
                    <span>Retargeting</span>
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="platform">Platform</label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select platform</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="tone">Tone</label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                >
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="bold">Bold</option>
                  <option value="educational">Educational</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Strategy'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT */}
        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">•</div>
              <h3>Ready to Generate</h3>
              <p>Configure your campaign parameters and click Generate Strategy</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">!</div>
              <h3>Generation Failed</h3>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loader"></div>
              <h3>Analyzing Strategy</h3>
              <p>AI is processing your campaign requirements...</p>
            </div>
          )}

          {result && (
            <div className="output-content">
              <div className="output-header">
                <h2>Campaign Strategy</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={generateABVariants} 
                    className="btn-copy"
                    disabled={abLoading}
                  >
                    <FaFlask />
                    <span>{abLoading ? 'Generating...' : 'A/B Test Variants'}</span>
                  </button>
                  <button onClick={copyAllResults} className="btn-copy">
                    {copied ? <FaCheck /> : <FaCopy />}
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowExportMenu(!showExportMenu)} 
                      className="btn-copy"
                      style={{ background: 'var(--success)' }}
                    >
                      <FaDownload />
                      <span>Export</span>
                    </button>
                    {showExportMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '150px'
                      }}>
                        <button
                          onClick={exportAsPDF}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            borderBottom: '1px solid var(--border)'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'var(--bg-hover)'}
                          onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                          Export as PDF
                        </button>
                        <button
                          onClick={exportAsTXT}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: 'var(--text-primary)'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'var(--bg-hover)'}
                          onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                          Export as TXT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PERFORMANCE PREDICTION */}
              {result.performancePrediction && (
                <div className="prediction-card">
                  <div className="prediction-header">
                    <div className="prediction-title">Performance Prediction</div>
                    <span className={`confidence-badge confidence-${result.performancePrediction.confidenceLevel.toLowerCase()}`}>
                      {result.performancePrediction.confidenceLevel} Confidence
                    </span>
                  </div>
                  
                  <div className="prediction-metrics">
                    <div className="prediction-metric">
                      <div className="metric-label-small">Expected CTR</div>
                      <div className="metric-range">
                        {result.performancePrediction.ctr.min}–{result.performancePrediction.ctr.max}%
                      </div>
                    </div>
                    <div className="prediction-metric">
                      <div className="metric-label-small">Engagement Rate</div>
                      <div className="metric-range">
                        {result.performancePrediction.engagementRate.min}–{result.performancePrediction.engagementRate.max}%
                      </div>
                    </div>
                    <div className="prediction-metric">
                      <div className="metric-label-small">Estimated Reach</div>
                      <div className="metric-range">
                        {result.performancePrediction.estimatedReach.min.toLocaleString()}–{result.performancePrediction.estimatedReach.max.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="prediction-factors">
                    <div className="factors-title">Key Success Factors</div>
                    <div className="factors-list">
                      {result.performancePrediction.keyFactors.map((factor, index) => (
                        <span key={index} className="factor-tag">{factor}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="output-section">
                <div className="section-label">Objective</div>
                <p className="section-content">{result.objective}</p>
              </div>

              <div className="output-section">
                <div className="section-label">Content Ideas</div>
                <ul className="content-list">
                  {result.contentIdeas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
              </div>

              <div className="output-section">
                <div className="section-label">Ad Copy Variations</div>
                <div className="copy-variations">
                  {result.adCopies.map((copy, index) => (
                    <div key={index} className="copy-item">
                      <span className="copy-badge">#{index + 1}</span>
                      <p>{copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="output-section">
                <div className="section-label">Call-to-Actions</div>
                <div className="cta-list">
                  {result.ctas.map((cta, index) => (
                    <div key={index} className="cta-item">
                      {cta}
                    </div>
                  ))}
                </div>
              </div>

              {/* A/B TEST VARIANTS */}
              {abVariants && (
                <div className="output-section">
                  <div className="section-label" style={{ fontSize: '18px', fontWeight: 600, color: '#8B5CF6' }}>
                    A/B Test Variants - Ready to Test
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-3)',
                    marginTop: 'var(--space-3)'
                  }}>
                    {/* Original Version A */}
                    <div style={{
                      background: 'rgba(34, 197, 94, 0.05)',
                      border: '2px solid #22C55E',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#22C55E',
                        marginBottom: 'var(--space-2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Version A (Original) ⭐
                      </div>
                      <div style={{ marginBottom: 'var(--space-2)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                          HEADLINE
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {result.adCopies[0]}
                        </div>
                      </div>
                      <div style={{ marginBottom: 'var(--space-2)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                          CTA
                        </div>
                        <div style={{ fontSize: '14px', color: '#22C55E', fontWeight: 600 }}>
                          {result.ctas[0]}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        marginTop: 'var(--space-3)',
                        paddingTop: 'var(--space-2)',
                        borderTop: '1px solid var(--border)'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Predicted CTR</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#22C55E' }}>
                            {result.performancePrediction?.ctr 
                              ? `${result.performancePrediction.ctr.min}–${result.performancePrediction.ctr.max}%`
                              : '4.5%'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Conversion</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#22C55E' }}>
                            {result.performancePrediction?.engagementRate 
                              ? `${result.performancePrediction.engagementRate.min}–${result.performancePrediction.engagementRate.max}%`
                              : '3.2%'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variant B and C */}
                    {abVariants.map((variant, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        border: '2px solid #8B5CF6',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#8B5CF6',
                          marginBottom: 'var(--space-2)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Version {variant.version}
                        </div>
                        <div style={{ marginBottom: 'var(--space-2)' }}>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                            HEADLINE
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {variant.headline}
                          </div>
                        </div>
                        <div style={{ marginBottom: 'var(--space-2)' }}>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                            CTA
                          </div>
                          <div style={{ fontSize: '14px', color: '#8B5CF6', fontWeight: 600 }}>
                            {variant.cta}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: 'var(--space-3)',
                          marginTop: 'var(--space-3)',
                          paddingTop: 'var(--space-2)',
                          borderTop: '1px solid var(--border)'
                        }}>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Predicted CTR</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#8B5CF6' }}>
                              {variant.predictedCTR}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Conversion</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#8B5CF6' }}>
                              {variant.predictedConversion}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          marginTop: 'var(--space-2)',
                          padding: 'var(--space-2)',
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic'
                        }}>
                          💡 {variant.recommendation}
                        </div>
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

export default Campaign;
