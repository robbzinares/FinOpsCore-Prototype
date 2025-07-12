const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalOrdersRes = await db.query('SELECT COUNT(*) FROM orders');
    const averageAmountRes = await db.query('SELECT AVG(amount) FROM orders');
    const topLocationsRes = await db.query(`
      SELECT location, COUNT(*) AS count
      FROM orders
      GROUP BY location
      ORDER BY count DESC
      LIMIT 3
    `);
    const statusBreakdownRes = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    res.json({
      success: true,
      data: {
        totalOrders: parseInt(totalOrdersRes.rows[0].count, 10),
        averageAmount: averageAmountRes.rows[0].avg,
        topLocations: topLocationsRes.rows,
        statusBreakdown: statusBreakdownRes.rows
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
  }
});

module.exports = router;
