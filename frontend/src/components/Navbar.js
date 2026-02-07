import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'minimal' : 'default');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-breadcrumb">MarketMind</div>
      
      <div className="navbar-user">
        {user && (
          <>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle" 
              title={`Switch to ${theme === 'default' ? 'light' : 'dark'} theme`}
              aria-label="Toggle theme"
            />
            <div className="navbar-user-info">
              <div className="navbar-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="navbar-username">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="navbar-signout">
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
