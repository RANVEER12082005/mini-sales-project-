const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const protect = require('./middleware/auth');

dotenv.config();
connectDB();

const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/shops', protect, shopRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/coupons', protect, couponRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sales App Backend Running!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});