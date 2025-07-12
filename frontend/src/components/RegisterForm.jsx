import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }

    if (role === 'admin' && (!auth || auth.role !== 'admin')) {
      setMessage('Only admins can create admin accounts');
      return;
    }

    setLoading(true);
    try {
            const res = await fetch('http://localhost:5500/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Registration successful! Please login.');
        setUsername('');
        setPassword('');
        setRole('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Register</h2>
      <input
        type="text" placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />

      {/* Show role selector only if logged in as admin */}
      {auth && auth.role === 'admin' && (
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p style={{ marginTop: '10px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>
    </form>
  );
};

export default RegisterForm;

