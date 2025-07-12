import React, { useState } from 'react';
import validateInput from '../utils/validateInput';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateInput(username, password);
    if (error) {
      setMessage(error);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5500/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        setAuth(data.user);
        navigate('/dashboard');
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto', padding: '2rem' }}>
      <h2>Login</h2>
      <input
        type="text" placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </form>
  );
};

export default LoginForm;
