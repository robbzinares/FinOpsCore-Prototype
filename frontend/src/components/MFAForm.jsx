import React, { useState, useEffect } from 'react';

const MFAForm = ({ username, onVerified }) => {
  const [code, setCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get QR code on mount
    fetch('http://localhost:5500/api/mfa/setup')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQrCodeUrl(data.data.qrCodeUrl);
        } else {
          setMessage('Failed to load QR code');
        }
      })
      .catch(() => setMessage('Connection error during MFA setup'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5500/api/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setMessage(data.message || 'Invalid code');
      }
    } catch (err) {
      setMessage('Failed to verify code');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', textAlign: 'center' }}>
      <h2>MFA Verification for {username}</h2>

      {qrCodeUrl ? (
        <>
          <img src={qrCodeUrl} alt="Scan QR Code" style={{ marginBottom: '1rem' }} />
          <p>Scan this QR code in Google Authenticator or Authy</p>
        </>
      ) : (
        <p>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Verify</button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default MFAForm;
