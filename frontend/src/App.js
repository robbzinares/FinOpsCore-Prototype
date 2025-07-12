import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MFAForm from './components/MFAForm';
import Header from './components/Header';

import Dashboard from './components/Dashboard';
import DashboardOverview from './components/DashboardOverview';
import CreateOrderForm from './components/CreateOrderForm';
import OrderList from './components/OrderList';
import ReportView from './components/ReportView';

import AdminPanel from './components/AdminPanel';

const App = () => {
  const { auth } = useAuth();
  const [mfaVerified, setMfaVerified] = useState(false);

  return (
    <Router>
      <Header />

      <Routes>
        {/* Public routes */}
        {!auth && (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* MFA step */}
        {auth && !mfaVerified && (
          <Route path="*" element={<MFAForm username={auth.username} onVerified={() => setMfaVerified(true)} />} />
        )}

        {/* Authenticated routes */}
        {auth && mfaVerified && (
          <>
            <Route path="/dashboard" element={
              <div style={{ padding: '2rem' }}>
                <Dashboard />
                <DashboardOverview />
              </div>
            } />

            <Route path="/orders" element={
              <div style={{ padding: '2rem' }}>
                <CreateOrderForm />
                <OrderList />
              </div>
            } />

            {auth.role === 'admin' && (
              <Route path="/reports" element={
                <div style={{ padding: '2rem' }}>
                  <ReportView />
                </div>
              } />
            )}
            
            {auth.role === 'admin' && (
              <Route path="/admin" element={<AdminPanel />} />
            )}

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
