import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiKeyProvider } from './context/ApiKeyContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Campaign from './pages/Campaign';
import SalesPitch from './pages/SalesPitch';
import LeadScoring from './pages/LeadScoring';
import './App.css';

const Layout = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <div className="layout-main">
      <Navbar />
      <div className="layout-content">{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/campaign" element={<PrivateRoute><Layout><Campaign /></Layout></PrivateRoute>} />
            <Route path="/pitch" element={<PrivateRoute><Layout><SalesPitch /></Layout></PrivateRoute>} />
            <Route path="/lead-scoring" element={<PrivateRoute><Layout><LeadScoring /></Layout></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ApiKeyProvider>
  );
}

export default App;
