import React, { useState } from 'react';

const CreateOrderForm = () => {
  const [trackingId, setTrackingId] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Pending');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0 || parsedAmount > 1000000) {
      setMessage('Amount must be a number between 0 and 1,000,000.');
      return;
    }

    const order = {
      tracking_id: trackingId,
      client,
      location,
      status,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      amount: parsedAmount,
    };

    try {
      const res = await fetch('http://localhost:5500/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Order created successfully');
        setTrackingId('');
        setClient('');
        setLocation('');
        setStatus('Pending');
        setTemperature('');
        setHumidity('');
        setAmount('');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to create order');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Create Order</h3>
      <input placeholder="Tracking ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} required />
      <input placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} required />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Pending</option>
        <option>Delivered</option>
        <option>Delayed</option>
      </select>
      <input type="number" placeholder="Temperature (°C)" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
      <input type="number" placeholder="Humidity (%)" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        min={0}
        max={1000000}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Create Order</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateOrderForm;
