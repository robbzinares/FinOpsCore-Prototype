const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// POST a new order
router.post('/orders', async (req, res) => {
  const { tracking_id, location, status, temperature, humidity, amount } = req.body;
  if (!tracking_id || !status) {
    return res.status(400).json({ success: false, message: 'Tracking ID and Status are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO orders (tracking_id, location, status, temperature, humidity, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tracking_id, location, status, temperature, humidity, amount]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

module.exports = router;
