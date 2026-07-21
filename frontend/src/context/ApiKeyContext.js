import React, { createContext, useContext } from 'react';

const ApiKeyContext = createContext();

export const useApiKey = () => {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider');
  return ctx;
};

export const ApiKeyProvider = ({ children }) => {
  return (
    <ApiKeyContext.Provider value={{ hasKey: true, setKey: () => {}, clearKey: () => {}, loading: false }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
