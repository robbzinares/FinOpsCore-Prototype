const db = require('../db');

const mockUser = async (req, res, next) => {
  const fakeUserId = 1; // simulate user ID

  try {
    const result = await db.query('SELECT id, username, role FROM users WHERE id = $1', [fakeUserId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Mock user not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Error mocking user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = mockUser;
