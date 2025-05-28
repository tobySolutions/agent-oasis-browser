
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Marketplace } from '@/components/Marketplace';
import { Login } from '@/components/Login';
import { AgentOnboarding } from '@/components/AgentOnboarding';
import { AgentDetail } from '@/components/AgentDetail';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Routes>
        <Route 
          path="/" 
          element={<Marketplace currentUser={currentUser} onLogout={handleLogout} />} 
        />
        <Route 
          path="/onboard" 
          element={<AgentOnboarding currentUser={currentUser} onLogout={handleLogout} />} 
        />
        <Route 
          path="/agent/:id" 
          element={<AgentDetail currentUser={currentUser} onLogout={handleLogout} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Index;
