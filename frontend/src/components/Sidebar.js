import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartLine, FaBullhorn, FaRocket, FaTachometerAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { id: 'campaign', label: 'Campaign Intelligence', icon: <FaBullhorn />, path: '/campaign' },
    { id: 'pitch', label: 'Sales Pitch Engine', icon: <FaRocket />, path: '/pitch' },
    { id: 'lead', label: 'Lead Intelligence', icon: <FaChartLine />, path: '/lead-scoring' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">MarketMind</div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="status-dot"></div>
          <span>Operational</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
