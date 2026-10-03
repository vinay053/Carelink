const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/referrals', require('./routes/referral.routes'));
app.use('/api/diagnostics', require('./routes/diagnostic.routes'));
app.use('/api/medications', require('./routes/medication.routes'));
app.use('/api/hospitals', require('./routes/hospital.routes'));
app.use('/api/alerts', require('./routes/alert.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/carebot', require('./routes/carebot.routes'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'carelink-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;

