import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Campaign from './pages/Campaign';
import SalesPitch from './pages/SalesPitch';
import LeadScoring from './pages/LeadScoring';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <Navbar />
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaign"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <Navbar />
                  <Campaign />
                </PrivateRoute>
              }
            />
            <Route
              path="/pitch"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <Navbar />
                  <SalesPitch />
                </PrivateRoute>
              }
            />
            <Route
              path="/lead-scoring"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <Navbar />
                  <LeadScoring />
                </PrivateRoute>
              }
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
