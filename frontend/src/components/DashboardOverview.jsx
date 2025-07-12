import React, { useEffect, useState } from 'react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    averageAmount: 0,
    topLocations: [],
    statusBreakdown: [],
  });

  useEffect(() => {
    fetch('http://localhost:5500/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data);
      });
  }, []);

  return (
    <div>
      <h3>Dashboard Overview</h3>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Average Amount: ${stats.averageAmount ? Number(stats.averageAmount).toFixed(2) : '0.00'}</p>
      <h4>Top Locations:</h4>
      <ul>
        {stats.topLocations.map(loc => (
          <li key={loc.location}>{loc.location} ({loc.count})</li>
        ))}
      </ul>
      <h4>Status Breakdown:</h4>
      <ul>
        {stats.statusBreakdown.map(status => (
          <li key={status.status}>{status.status}: {status.count}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardOverview;
