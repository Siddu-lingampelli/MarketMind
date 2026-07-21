import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';

const PrivateRoute = ({ children }) => {
  const { hasKey, loading } = useApiKey();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return hasKey ? children : <Navigate to="/" />;
};

export default PrivateRoute;
