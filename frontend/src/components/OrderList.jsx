import React, { useEffect, useState } from 'react';

const statusColors = {
  Pending: 'orange',
  Delivered: 'green',
  Delayed: 'red',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');

  const fetchOrders = () => {
    fetch('http://localhost:5500/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const res = await fetch(`http://localhost:5500/api/orders/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Order deleted successfully.');
        fetchOrders();
      } else {
        setMessage('Failed to delete order.');
      }
    } catch (err) {
      setMessage('Error deleting order.');
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h3>Orders</h3>
      <label>Status Filter: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: '1rem' }}>
        <option>All</option>
        <option>Pending</option>
        <option>Delivered</option>
        <option>Delayed</option>
      </select>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Client</th>
            <th>Location</th>
            <th>Status</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.tracking_id}</td>
              <td>{order.client}</td>
              <td>{order.location}</td>
              <td style={{ color: statusColors[order.status] }}>{order.status}</td>
              <td>{order.temperature !== null ? `${order.temperature}°C` : '—'}</td>
              <td>{order.humidity !== null ? `${order.humidity}%` : '—'}</td>
              <td>${Number(order.amount).toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
