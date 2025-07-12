const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const mfaRoutes = require('./routes/mfa'); // if implemented
const mockUser = require('./middleware/mockUser');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(mockUser); // Dev only, replace with real auth later

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api', reportRoutes);
app.use('/api', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('🚀 FinOpsCore Backend is running!');
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
