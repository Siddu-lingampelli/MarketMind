import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { setApiKey as saveKey, clearApiKey as removeKey } from '../services/groqClient';

const ApiKeyContext = createContext();

export const useApiKey = () => {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider');
  return ctx;
};

export const ApiKeyProvider = ({ children }) => {
  const [hasKey, setHasKey] = useState(() => {
    const k = sessionStorage.getItem('groqApiKey') || localStorage.getItem('groqApiKey');
    if (k) return true;
    try {
      if (process.env.REACT_APP_GROQ_API_KEY) return true;
    } catch (_) {}
    return false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem('groqApiKey') && !localStorage.getItem('groqApiKey')) {
      try {
        if (process.env.REACT_APP_GROQ_API_KEY) {
          sessionStorage.setItem('groqApiKey', process.env.REACT_APP_GROQ_API_KEY);
          setHasKey(true);
          setLoading(false);
          return;
        }
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  const setKey = useCallback((key, persist) => {
    saveKey(key, persist);
    setHasKey(true);
  }, []);

  const clearKey = useCallback(() => {
    removeKey();
    setHasKey(false);
  }, []);

  return (
    <ApiKeyContext.Provider value={{ hasKey, setKey, clearKey, loading }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
