import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePitch } from '../services/groqClient';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './Campaign.css';

const SalesPitch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '', persona: '', industry: '', companySize: '', budgetRange: '', pitchMode: 'elevator',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const budgetRanges = ['< $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K+'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);
    try {
      const data = await generatePitch(
        formData.productName, formData.persona, formData.industry,
        formData.companySize, formData.budgetRange, formData.pitchMode
      );
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate pitch');
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
    const text = `Elevator Pitch:\n${result.elevatorPitch}\n\nValue Proposition:\n${result.valueProposition}\n\nKey Differentiators:\n${result.differentiators.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nCall-to-Action:\n${result.callToAction}`;
    copyToClipboard(text);
  };

  const exportAsPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const m = 20, w = doc.internal.pageSize.getWidth() - 40;
    let y = 20;
    doc.setFontSize(20); doc.setFont(undefined, 'bold'); doc.text('Sales Pitch Report', m, y); y += 15;
    doc.setFontSize(12); doc.setFont(undefined, 'normal');
    doc.text(`Product: ${formData.productName}`, m, y); y += 10;
    ['Elevator Pitch (30 seconds)', 'Value Proposition'].forEach(section => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text(section, m, y); y += 8;
      doc.setFontSize(11); doc.setFont(undefined, 'normal');
      const text = section === 'Elevator Pitch (30 seconds)' ? result.elevatorPitch : result.valueProposition;
      const lines = doc.splitTextToSize(text, w); doc.text(lines, m, y); y += lines.length * 6 + 10;
    });
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Key Differentiators', m, y); y += 8;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    result.differentiators.forEach((diff, i) => {
      const l = doc.splitTextToSize(`${i + 1}. ${diff}`, w - 5); doc.text(l, m + 5, y); y += l.length * 6 + 3;
    });
    y += 7;
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Call-to-Action', m, y); y += 8;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    doc.text(doc.splitTextToSize(result.callToAction, w), m, y);
    doc.save(`${formData.productName.replace(/\s+/g, '_')}_Pitch.pdf`);
    setShowExportMenu(false);
  };

  const exportAsTXT = () => {
    if (!result) return;
    let text = `SALES PITCH REPORT\nProduct: ${formData.productName}\n\n${'='.repeat(60)}\n\nELEVATOR PITCH\n${result.elevatorPitch}\n\nVALUE PROPOSITION\n${result.valueProposition}\n\nKEY DIFFERENTIATORS\n${result.differentiators.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nCALL-TO-ACTION\n${result.callToAction}`;
    saveAs(new Blob([text], { type: 'text/plain;charset=utf-8' }), `${formData.productName.replace(/\s+/g, '_')}_Pitch.txt`);
    setShowExportMenu(false);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <button className="back-button" onClick={() => navigate(-1)}><span>←</span><span>Back</span></button>
        <h1 className="workspace-title">Sales Pitch Engine</h1>
        <p className="workspace-subtitle">Generate personalized sales pitches</p>
      </div>

      <div className="split-workspace">
        <div className="input-panel">
          <div className="panel-section">
            <h3 className="panel-title">Configuration</h3>
            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-field">
                <label htmlFor="productName">Product/Service</label>
                <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} required placeholder="e.g., CloudSync Pro" />
              </div>
              <div className="form-field">
                <label htmlFor="persona">Customer Persona</label>
                <textarea id="persona" name="persona" value={formData.persona} onChange={handleChange} required rows="4" placeholder="Role, pain points, goals..." />
              </div>
              <div className="form-field">
                <label htmlFor="industry">Industry</label>
                <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleChange} required placeholder="e.g., SaaS, Healthcare" />
              </div>
              <div className="form-field">
                <label htmlFor="companySize">Company Size</label>
                <select id="companySize" name="companySize" value={formData.companySize} onChange={handleChange}>
                  <option value="">Select size</option>
                  {companySizes.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="budgetRange">Budget Range</label>
                <select id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange}>
                  <option value="">Select range</option>
                  {budgetRanges.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Pitch Mode</label>
                <div className="radio-group">
                  {[
                    { value: 'elevator', label: 'Elevator Pitch (30 sec)' },
                    { value: 'email', label: 'Email Pitch' },
                    { value: 'linkedin', label: 'LinkedIn Message' },
                    { value: 'executive', label: 'Executive Pitch' },
                  ].map(m => (
                    <label className="radio-label" key={m.value}>
                      <input type="radio" name="pitchMode" value={m.value} checked={formData.pitchMode === m.value} onChange={handleChange} />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Pitch'}</button>
            </form>
          </div>
        </div>

        <div className="output-panel">
          {!result && !loading && !error && (
            <div className="empty-state"><div className="empty-icon">●</div><h3>Ready to Generate</h3><p>Configure your pitch parameters and click Generate Pitch</p></div>
          )}
          {error && <div className="error-state"><div className="error-icon">!</div><h3>Generation Failed</h3><p>{error}</p></div>}
          {loading && <div className="loading-state"><div className="loader"></div><h3>Crafting Pitch</h3><p>AI is generating your personalized sales pitch...</p></div>}

          {result && (
            <div className="output-content">
              <div className="output-header">
                <h2>Sales Pitch</h2>
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

              <div className="output-section"><div className="section-label">Elevator Pitch (30 seconds)</div><p className="section-content">{result.elevatorPitch}</p></div>
              <div className="output-section"><div className="section-label">Value Proposition</div><p className="section-content">{result.valueProposition}</p></div>
              <div className="output-section">
                <div className="section-label">Key Differentiators</div>
                <ul className="content-list">{result.differentiators.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
              <div className="output-section">
                <div className="section-label">Call-to-Action</div>
                <div className="cta-list"><div className="cta-item">{result.callToAction}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPitch;
