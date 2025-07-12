import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { auth } = useAuth();

  if (!auth) return <p>Please login first.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {auth.username}</h2>
      <p>Role: <strong>{auth.role}</strong></p>

      {auth.role === 'Admin' && (
        <>
          <p>🛠 Admin tools enabled</p>
          <p>📦 Full access to orders and reports</p>
        </>
      )}

      {auth.role === 'Analyst' && (
        <>
          <p>📈 Limited access: View-only reports</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
