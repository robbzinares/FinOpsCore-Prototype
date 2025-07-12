// backend/routes/mfa.js
const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();

// Temp in-memory store
const mfaSecrets = {}; // userId: secretBase32

// GET /api/mfa/setup
router.get('/setup', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const secret = speakeasy.generateSecret({
    name: `FinOpsCore (${req.user.username})`
  });

  // Save to in-memory store (simulate database)
  mfaSecrets[req.user.id] = secret.base32;

  qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'QR code generation failed' });
    }

    res.json({
      success: true,
      data: {
        qrCodeUrl: dataUrl,
        secret: secret.base32 // optional
      }
    });
  });
});

// POST /api/mfa/verify
router.post('/verify', (req, res) => {
  const { code } = req.body;

  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const secret = mfaSecrets[req.user.id];
  if (!secret) {
    return res.status(400).json({ success: false, message: 'MFA not initialized' });
  }

  const isVerified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 1 // allow ±30s window
  });

  if (isVerified) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid MFA code' });
  }
});

module.exports = router;
