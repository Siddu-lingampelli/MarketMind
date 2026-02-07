import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePitch } from '../services/pitchService';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './Campaign.css';

const SalesPitch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    persona: '',
    industry: '',
    companySize: '',
    budgetRange: '',
    pitchMode: 'elevator',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [followUp, setFollowUp] = useState(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const budgetRanges = ['< $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K+'];

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
    setFollowUp(null);

    try {
      const response = await generatePitch(formData);
      setResult(response.data);
      
      // Save to recent activity
      const recent = JSON.parse(localStorage.getItem('recentPitches') || '[]');
      recent.unshift({ product: formData.productName, industry: formData.industry, date: new Date().toISOString() });
      localStorage.setItem('recentPitches', JSON.stringify(recent.slice(0, 10)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate pitch');
    } finally {
      setLoading(false);
    }
  };

  const generateFollowUp = async () => {
    if (!result || !result.coldEmail) return;
    
    setFollowUpLoading(true);
    
    try {
      const followUpData = {
        ...formData,
        pitchMode: 'follow_up',
        originalEmail: result.coldEmail
      };
      
      const response = await generatePitch(followUpData);
      setFollowUp(response.data.coldEmail);
    } catch (err) {
      console.error('Failed to generate follow-up:', err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllResults = () => {
    if (!result) return;

    let text = `
Elevator Pitch:
${result.elevatorPitch}

Value Proposition:
${result.valueProposition}

Key Differentiators:
${result.differentiators.map((diff, i) => `${i + 1}. ${diff}`).join('\n')}

Call-to-Action:
${result.callToAction}
`;

    // Add cold email format if present
    if (result.coldEmail) {
      text += `
=== COLD EMAIL OUTREACH ===
Subject: ${result.coldEmail.subject}

${result.coldEmail.body}

${result.coldEmail.cta}

Personalization Tips:
${result.coldEmail.personalizationTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
`;
    } else {
      // Add multi-format outputs
      text += `
=== EMAIL FORMAT ===
Subject: ${result.formats?.email?.subject || ''}
${result.formats?.email?.body || ''}

=== LINKEDIN DM ===
${result.formats?.linkedin?.message || ''}

=== WHATSAPP ===
${result.formats?.whatsapp?.message || ''}
`;
    }

    copyToClipboard(text.trim());
  };

  const exportAsPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Sales Pitch Report', margin, yPos);
    yPos += 15;

    // Product name
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Product: ${formData.productName}`, margin, yPos);
    yPos += 10;

    // Elevator Pitch
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Elevator Pitch (30 seconds)', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const elevatorLines = doc.splitTextToSize(result.elevatorPitch, maxWidth);
    doc.text(elevatorLines, margin, yPos);
    yPos += elevatorLines.length * 6 + 10;

    // Value Proposition
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Value Proposition', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const valueLines = doc.splitTextToSize(result.valueProposition, maxWidth);
    doc.text(valueLines, margin, yPos);
    yPos += valueLines.length * 6 + 10;

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Key Differentiators
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Key Differentiators', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    result.differentiators.forEach((diff, index) => {
      const diffLines = doc.splitTextToSize(`${index + 1}. ${diff}`, maxWidth - 5);
      doc.text(diffLines, margin + 5, yPos);
      yPos += diffLines.length * 6 + 3;
    });
    yPos += 7;

    // Call-to-Action
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Call-to-Action', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const ctaLines = doc.splitTextToSize(result.callToAction, maxWidth);
    doc.text(ctaLines, margin, yPos);

    // Save PDF
    doc.save(`${formData.productName.replace(/\s+/g, '_')}_Pitch.pdf`);
    setShowExportMenu(false);
  };

  const exportAsTXT = () => {
    if (!result) return;
    
    let text = `SALES PITCH REPORT\n`;
    text += `Product: ${formData.productName}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `\n${'='.repeat(60)}\n\n`;
    
    text += `ELEVATOR PITCH (30 seconds)\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `${result.elevatorPitch}\n\n`;
    
    text += `VALUE PROPOSITION\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `${result.valueProposition}\n\n`;
    
    text += `KEY DIFFERENTIATORS\n`;
    text += `${'-'.repeat(60)}\n`;
    result.differentiators.forEach((diff, index) => {
      text += `${index + 1}. ${diff}\n`;
    });
    text += `\n`;
    
    text += `CALL-TO-ACTION\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `${result.callToAction}\n\n`;

    if (result.coldEmail) {
      text += `COLD EMAIL OUTREACH\n`;
      text += `${'-'.repeat(60)}\n`;
      text += `Subject: ${result.coldEmail.subject}\n\n`;
      text += `${result.coldEmail.body}\n\n`;
      text += `${result.coldEmail.cta}\n\n`;
      text += `Personalization Tips:\n`;
      result.coldEmail.personalizationTips.forEach((tip, i) => {
        text += `${i + 1}. ${tip}\n`;
      });
    }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${formData.productName.replace(/\s+/g, '_')}_Pitch.txt`);
    setShowExportMenu(false);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span>
          <span>Back</span>
        </button>
        <h1 className="workspace-title">Sales Pitch Engine</h1>
        <p className="workspace-subtitle">Generate executive-ready sales presentations</p>
      </div>

      <div className="split-workspace">
        {/* LEFT PANEL: INPUT */}
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Configuration</h3>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="productName">Product/Service</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., CloudSync Pro"
                />
              </div>

              <div className="form-field">
                <label htmlFor="persona">Customer Persona</label>
                <textarea
                  id="persona"
                  name="persona"
                  value={formData.persona}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Role, pain points, goals..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  placeholder="e.g., SaaS, Healthcare"
                />
              </div>

              <div className="form-field">
                <label htmlFor="companySize">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="budgetRange">Budget Range</label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                >
                  <option value="">Select range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Pitch Mode</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pitchMode"
                      value="elevator"
                      checked={formData.pitchMode === 'elevator'}
                      onChange={handleChange}
                    />
                    <span>Elevator Pitch (30 sec)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pitchMode"
                      value="email"
                      checked={formData.pitchMode === 'email'}
                      onChange={handleChange}
                    />
                    <span>Email Pitch</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pitchMode"
                      value="linkedin"
                      checked={formData.pitchMode === 'linkedin'}
                      onChange={handleChange}
                    />
                    <span>LinkedIn Message</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pitchMode"
                      value="executive"
                      checked={formData.pitchMode === 'executive'}
                      onChange={handleChange}
                    />
                    <span>Executive Pitch</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pitchMode"
                      value="cold_email"
                      checked={formData.pitchMode === 'cold_email'}
                      onChange={handleChange}
                    />
                    <span>Cold Email Outreach</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Pitch'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT */}
        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">●</div>
              <h3>Ready to Generate</h3>
              <p>Configure your pitch parameters and click Generate Pitch</p>
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
              <h3>Crafting Pitch</h3>
              <p>AI is generating your personalized sales pitch...</p>
            </div>
          )}

          {result && (
            <div className="output-content">
              <div className="output-header">
                <h2>Sales Pitch</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
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

              <div className="output-section">
                <div className="section-label">Elevator Pitch (30 seconds)</div>
                <p className="section-content">{result.elevatorPitch}</p>
              </div>

              <div className="output-section">
                <div className="section-label">Value Proposition</div>
                <p className="section-content">{result.valueProposition}</p>
              </div>

              <div className="output-section">
                <div className="section-label">Key Differentiators</div>
                <ul className="content-list">
                  {result.differentiators.map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
                </ul>
              </div>

              <div className="output-section">
                <div className="section-label">Call-to-Action</div>
                <div className="cta-list">
                  <div className="cta-item">{result.callToAction}</div>
                </div>
              </div>

              {/* COLD EMAIL OUTREACH - SPECIAL DISPLAY */}
              {result.coldEmail && (
                <div className="output-section">
                  <div className="section-label" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent)' }}>
                    Cold Email Outreach - Ready to Send
                  </div>
                  
                  <div className="format-card" style={{ 
                    background: 'rgba(59, 130, 246, 0.05)', 
                    border: '2px solid var(--accent)',
                    padding: 'var(--space-4)'
                  }}>
                    {/* Subject Line */}
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: 'var(--text-secondary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 'var(--space-1)'
                      }}>
                        Subject Line
                      </div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)',
                        padding: 'var(--space-2)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}>
                        {result.coldEmail.subject}
                      </div>
                    </div>

                    {/* Email Body */}
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: 'var(--text-secondary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 'var(--space-1)'
                      }}>
                        Email Body
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.6',
                        color: 'var(--text-primary)',
                        padding: 'var(--space-3)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {result.coldEmail.body}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: 'var(--text-secondary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 'var(--space-1)'
                      }}>
                        Call-to-Action
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 500,
                        color: 'var(--accent)',
                        padding: 'var(--space-2)',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}>
                        {result.coldEmail.cta}
                      </div>
                    </div>

                    {/* Personalization Tips */}
                    <div style={{ marginBottom: 'var(--space-2)' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: 'var(--text-secondary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 'var(--space-1)'
                      }}>
                        Personalization Tips
                      </div>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: 'var(--space-3)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                      }}>
                        {result.coldEmail.personalizationTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Copy Button */}
                    <button 
                      className="btn-copy-small" 
                      style={{ marginTop: 'var(--space-2)' }}
                      onClick={() => copyToClipboard(`Subject: ${result.coldEmail.subject}\n\n${result.coldEmail.body}\n\n${result.coldEmail.cta}`)}
                    >
                      {copied ? <FaCheck /> : <FaCopy />} Copy Complete Email
                    </button>

                    {/* Generate Follow-Up Button */}
                    <button 
                      className="btn-primary" 
                      style={{ 
                        marginTop: 'var(--space-2)', 
                        width: '100%',
                        background: followUp ? 'var(--success)' : 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-1)'
                      }}
                      onClick={generateFollowUp}
                      disabled={followUpLoading || followUp}
                    >
                      {followUpLoading ? 'Generating...' : followUp ? '✓ Follow-Up Generated' : '+ Generate Follow-Up Email (4 days later)'}
                    </button>
                  </div>

                  {/* Follow-Up Email Display */}
                  {followUp && (
                    <div className="format-card" style={{ 
                      background: 'rgba(16, 185, 129, 0.05)', 
                      border: '2px solid var(--success)',
                      padding: 'var(--space-4)',
                      marginTop: 'var(--space-3)'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 700, 
                        color: 'var(--success)', 
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Follow-Up Email (Send 3-5 days after no reply)
                      </div>

                      {/* Subject Line */}
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: 'var(--text-secondary)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 'var(--space-1)'
                        }}>
                          Subject Line
                        </div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)',
                          padding: 'var(--space-2)',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)'
                        }}>
                          {followUp.subject}
                        </div>
                      </div>

                      {/* Email Body */}
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: 'var(--text-secondary)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 'var(--space-1)'
                        }}>
                          Email Body
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.6',
                          color: 'var(--text-primary)',
                          padding: 'var(--space-3)',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {followUp.body}
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ marginBottom: 'var(--space-2)' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: 'var(--text-secondary)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 'var(--space-1)'
                        }}>
                          Call-to-Action
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 500,
                          color: 'var(--success)',
                          padding: 'var(--space-2)',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)'
                        }}>
                          {followUp.cta}
                        </div>
                      </div>

                      {/* Copy Follow-Up Button */}
                      <button 
                        className="btn-copy-small" 
                        style={{ marginTop: 'var(--space-2)' }}
                        onClick={() => copyToClipboard(`Subject: ${followUp.subject}\n\n${followUp.body}\n\n${followUp.cta}`)}
                      >
                        {copied ? <FaCheck /> : <FaCopy />} Copy Follow-Up Email
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MULTI-FORMAT OUTPUTS */}
              {result.formats && (
                <>
                  <div className="output-section">
                    <div className="section-label">📧 Email Format</div>
                    <div className="format-card">
                      <div className="format-subject">
                        <span className="format-label">Subject:</span> {result.formats.email.subject}
                      </div>
                      <div className="format-body">{result.formats.email.body}</div>
                      <button 
                        className="btn-copy-small" 
                        onClick={() => copyToClipboard(`Subject: ${result.formats.email.subject}\n\n${result.formats.email.body}`)}
                      >
                        {copied ? <FaCheck /> : <FaCopy />} Copy
                      </button>
                    </div>
                  </div>

                  <div className="output-section">
                    <div className="section-label">💼 LinkedIn DM</div>
                    <div className="format-card format-linkedin">
                      <div className="format-body">{result.formats.linkedin.message}</div>
                      <button 
                        className="btn-copy-small" 
                        onClick={() => copyToClipboard(result.formats.linkedin.message)}
                      >
                        {copied ? <FaCheck /> : <FaCopy />} Copy
                      </button>
                    </div>
                  </div>

                  <div className="output-section">
                    <div className="section-label">💬 WhatsApp Message</div>
                    <div className="format-card format-whatsapp">
                      <div className="format-body">{result.formats.whatsapp.message}</div>
                      <button 
                        className="btn-copy-small" 
                        onClick={() => copyToClipboard(result.formats.whatsapp.message)}
                      >
                        {copied ? <FaCheck /> : <FaCopy />} Copy
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPitch;
