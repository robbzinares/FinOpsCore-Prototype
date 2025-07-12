import React, { useEffect, useState } from 'react';

const ReportView = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5500/api/reports/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success) setReport(data.data);
        else setError('Error loading report');
      })
      .catch(() => setError('Error connecting to report service'));
  }, []);

  if (error) return <p>{error}</p>;

  if (!report) return <p>Loading report...</p>;

  return (
    <div>
      <h3>Reports & Trends Summary</h3>
      <p>Total Orders: {report.totalOrders}</p>
      <p>Average Order Amount: ${report.averageAmount ? report.averageAmount.toFixed(2) : '0.00'}</p>
      <h4>Top Locations:</h4>
      <ul>
        {report.topLocations.map(loc => (
          <li key={loc.location}>{loc.location} ({loc.count})</li>
        ))}
      </ul>
      <h4>Status Breakdown:</h4>
      <ul>
        {report.statusBreakdown.map(s => (
          <li key={s.status}>{s.status}: {s.count}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportView;
