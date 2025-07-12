const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/reports/summary', async (req, res) => {
  try {
    const totalOrders = await db.query('SELECT COUNT(*) FROM orders');
    const averageAmount = await db.query('SELECT AVG(amount) FROM orders');
    const topLocations = await db.query(`
      SELECT location, COUNT(*) AS count
      FROM orders
      GROUP BY location
      ORDER BY count DESC
      LIMIT 5
    `);
    const statusBreakdown = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    res.json({
      success: true,
      data: {
        totalOrders: parseInt(totalOrders.rows[0].count, 10),
        averageAmount: parseFloat(averageAmount.rows[0].avg),
        topLocations: topLocations.rows,
        statusBreakdown: statusBreakdown.rows,
      },
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

module.exports = router;
