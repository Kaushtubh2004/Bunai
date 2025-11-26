import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './route/ProtectedRoute';
import './App.css';
import UserPortfolio from './pages/UserPortfolio';
import NotFound from './pages/NotFound';
import AuthSuccess from './route/AuthSuccess';

const App = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Spinning ring */}
          <div className="w-14 h-14 border-4 border-[#20d78d] border-t-transparent rounded-full animate-spin mb-4"></div>

          {/* Glow animation text */}
          <p className="text-lg font-semibold text-[#20d78d] animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }


  return (
    <Routes>
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <HomePage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/portfolio/:username" element={<UserPortfolio/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;