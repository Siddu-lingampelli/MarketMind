import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCampaign } from '../services/groqClient';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './Campaign.css';

const Campaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: '', audience: '', campaignObjective: 'lead-generation', platform: '', tone: 'professional',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'Twitter', 'Email', 'Google Ads', 'TikTok', 'YouTube'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);
    try {
      const data = await generateCampaign(
        formData.product, formData.audience, formData.platform,
        formData.campaignObjective, formData.tone
      );
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate campaign');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const copyAllResults = () => {
    if (!result) return;
    const text = `Campaign Objective:\n${result.objective}\n\nContent Ideas:\n${result.contentIdeas.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\nAd Copies:\n${result.adCopies.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}\n\nCall-to-Actions:\n${result.ctas.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}`;
    copyToClipboard(text.trim());
  };

  const exportAsPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const m = 20, w = doc.internal.pageSize.getWidth() - 40;
    let y = 20;
    doc.setFontSize(20); doc.setFont(undefined, 'bold'); doc.text('Campaign Strategy Report', m, y); y += 15;
    doc.setFontSize(12); doc.setFont(undefined, 'normal');
    doc.text(`Product: ${formData.product}`, m, y); y += 7;
    doc.text(`Platform: ${formData.platform}`, m, y); y += 15;
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Objective', m, y); y += 8;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    const ol = doc.splitTextToSize(result.objective, w); doc.text(ol, m, y); y += ol.length * 6 + 10;
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Content Ideas', m, y); y += 8;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    result.contentIdeas.forEach((idea, idx) => {
      const l = doc.splitTextToSize(`${idx + 1}. ${idea}`, w - 5); doc.text(l, m + 5, y); y += l.length * 6 + 3;
      if (y > 250) { doc.addPage(); y = 20; }
    });
    y += 7;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Ad Copies', m, y); y += 8;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    result.adCopies.forEach((ad, idx) => {
      const l = doc.splitTextToSize(`${idx + 1}. ${ad}`, w - 5); doc.text(l, m + 5, y); y += l.length * 6 + 3;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`${formData.product.replace(/\s+/g, '_')}_Campaign.pdf`);
    setShowExportMenu(false);
  };

  const exportAsTXT = () => {
    if (!result) return;
    let text = `CAMPAIGN STRATEGY REPORT\nProduct: ${formData.product}\nPlatform: ${formData.platform}\nObjective: ${result.objective}\n\n${'='.repeat(60)}\n\nCONTENT IDEAS\n${result.contentIdeas.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\nAD COPIES\n${result.adCopies.map((c, idx) => `${idx + 1}. ${c}\n`).join('')}\n\nCALLS-TO-ACTION\n${result.ctas.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}`;
    saveAs(new Blob([text], { type: 'text/plain;charset=utf-8' }), `${formData.product.replace(/\s+/g, '_')}_Campaign.txt`);
    setShowExportMenu(false);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <button className="back-button" onClick={() => navigate(-1)}><span>←</span><span>Back</span></button>
        <h1 className="workspace-title">Campaign Intelligence</h1>
        <p className="workspace-subtitle">Generate data-driven marketing strategies</p>
      </div>

      <div className="split-workspace">
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Configuration</h3>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="product">Product/Service</label>
                <textarea id="product" name="product" value={formData.product} onChange={handleChange} required rows="4" placeholder="Describe your offering..." />
              </div>
              <div className="form-field">
                <label htmlFor="audience">Target Audience</label>
                <textarea id="audience" name="audience" value={formData.audience} onChange={handleChange} required rows="3" placeholder="Demographics, interests..." />
              </div>
              <div className="form-field">
                <label>Campaign Objective</label>
                <div className="radio-group">
                  {['brand-awareness','lead-generation','product-launch','conversions','retargeting'].map(o => (
                    <label className="radio-label" key={o}>
                      <input type="radio" name="campaignObjective" value={o} checked={formData.campaignObjective === o} onChange={handleChange} />
                      <span>{o.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="platform">Platform</label>
                <select id="platform" name="platform" value={formData.platform} onChange={handleChange} required>
                  <option value="">Select platform</option>
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="tone">Tone</label>
                <select id="tone" name="tone" value={formData.tone} onChange={handleChange}>
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="bold">Bold</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Strategy'}</button>
            </form>
          </div>
        </div>

        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state"><div className="empty-icon">•</div><h3>Ready to Generate</h3><p>Configure your campaign parameters and click Generate Strategy</p></div>
          )}
          {error && <div className="error-state"><div className="error-icon">!</div><h3>Generation Failed</h3><p>{error}</p></div>}
          {loading && <div className="loading-state"><div className="loader"></div><h3>Analyzing Strategy</h3><p>AI is processing your campaign requirements...</p></div>}

          {result && (
            <div className="output-content">
              <div className="output-header">
                <h2>Campaign Strategy</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={copyAllResults} className="btn-copy">{copied ? <FaCheck /> : <FaCopy />}<span>{copied ? 'Copied' : 'Copy All'}</span></button>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowExportMenu(!showExportMenu)} className="btn-copy" style={{ background: 'var(--success)' }}><FaDownload /><span>Export</span></button>
                    {showExportMenu && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: 150 }}>
                        <button onClick={exportAsPDF} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }} onMouseOver={e => e.target.style.background = 'var(--bg-hover)'} onMouseOut={e => e.target.style.background = 'transparent'}>Export as PDF</button>
                        <button onClick={exportAsTXT} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: 'var(--text-primary)' }} onMouseOver={e => e.target.style.background = 'var(--bg-hover)'} onMouseOut={e => e.target.style.background = 'transparent'}>Export as TXT</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="output-section"><div className="section-label">Objective</div><p className="section-content">{result.objective}</p></div>

              <div className="output-section">
                <div className="section-label">Content Ideas</div>
                <ul className="content-list">{result.contentIdeas.map((idea, i) => <li key={i}>{idea}</li>)}</ul>
              </div>

              <div className="output-section">
                <div className="section-label">Ad Copy Variations</div>
                <div className="copy-variations">{result.adCopies.map((copy, i) => <div key={i} className="copy-item"><span className="copy-badge">#{i + 1}</span><p>{copy}</p></div>)}</div>
              </div>

              <div className="output-section">
                <div className="section-label">Call-to-Actions</div>
                <div className="cta-list">{result.ctas.map((cta, i) => <div key={i} className="cta-item">{cta}</div>)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
