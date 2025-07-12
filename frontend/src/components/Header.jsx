import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={{
      background: '#222', color: 'white', padding: '1rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <h1 style={{ margin: 0 }}>FinOpsCore</h1>
      {auth && (
        <nav>
          <Link to="/dashboard" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
          <Link to="/orders" style={{ color: 'white', marginRight: '15px' }}>Orders</Link>

          {auth.role === 'admin' && (
            <>
              <Link to="/reports" style={{ color: 'white', marginRight: '15px' }}>Reports</Link>
              <Link to="/admin" style={{ color: 'white', marginRight: '15px' }}>Admin Panel</Link>
            </>
          )}

          <span style={{ marginRight: '15px' }}>
            👤 {auth.username} ({auth.role})
          </span>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
