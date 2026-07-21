import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';

const Settings = () => {
  const { hasKey, setKey, clearKey } = useApiKey();
  const navigate = useNavigate();
  const [keyInput, setKeyInput] = useState('');
  const [persist, setPersist] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = () => {
    if (!keyInput.trim().startsWith('gsk_')) {
      setMsg('Key must start with "gsk_"');
      return;
    }
    setKey(keyInput.trim(), persist);
    setMsg('Saved!');
    setTimeout(() => navigate('/'), 1000);
  };

  const handleClear = () => {
    clearKey();
    setKeyInput('');
    setMsg('Key removed');
  };

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Groq API Key</h1>
      <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
        Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer">console.groq.com</a>
      </p>

      {hasKey && (
        <div style={{ padding: 12, background: '#10b98115', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#10b981' }}>
          ✓ API key is set
        </div>
      )}

      <input
        type="password"
        placeholder="gsk_..."
        value={keyInput}
        onChange={e => setKeyInput(e.target.value)}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888', marginBottom: 16 }}>
        <input type="checkbox" checked={persist} onChange={e => setPersist(e.target.checked)} />
        Remember across sessions (localStorage)
      </label>

      {msg && <div style={{ padding: 8, marginBottom: 12, fontSize: 13, color: msg.includes('Saved') ? '#10b981' : '#ef4444' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} style={{ flex: 1, padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          Save Key
        </button>
        {hasKey && (
          <button onClick={handleClear} style={{ padding: '10px 16px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, cursor: 'pointer' }}>
            Remove
          </button>
        )}
      </div>

      <button onClick={() => navigate(-1)} style={{ marginTop: 16, background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13 }}>
        ← Back
      </button>
    </div>
  );
};

export default Settings;
