import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, getUser, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
