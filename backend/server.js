const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/.wf_graphql/csrf', (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  res.cookie('wf-csrf', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: req.secure,
  });
  res.status(204).send();
});

app.post(['/.wf_graphql/apollo', '/.wf_graphql/usys/apollo'], (req, res) => {
  res.json({
    data: {
      database: {
        id: 'local',
        commerceOrder: {
          comment: null,
          extraItems: [],
          id: 'local-cart',
          startedOn: null,
          statusFlags: {
            hasDownloads: false,
            hasSubscription: false,
            isFreeOrder: false,
            requiresShipping: false,
          },
          subtotal: { decimalValue: '0', string: '$0.00', unit: 'USD', value: 0 },
          total: { decimalValue: '0', string: '$0.00', unit: 'USD', value: 0 },
          updatedOn: null,
          userItems: [],
          userItemsCount: 0,
        },
      },
      site: {
        commerce: {
          id: 'local-commerce',
          businessAddress: { country: 'US' },
          defaultCountry: 'US',
          defaultCurrency: 'USD',
          quickCheckoutEnabled: false,
        },
      },
    },
  });
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mom\'s Web API' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
