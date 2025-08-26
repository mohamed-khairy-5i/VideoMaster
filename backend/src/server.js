/**
 * VidGrab Pro - Advanced Video Downloader Backend
 * Main Server Entry Point
 * 
 * @author GenSpark AI Developer
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const downloadRoutes = require('./routes/download');
const infoRoutes = require('./routes/info');
const healthRoutes = require('./routes/health');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const security = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vidgrab-pro.netlify.app',
    /\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(logger);
app.use(security);

// API Routes
app.use('/api/download', downloadRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'VidGrab Pro API',
    version: '1.0.0',
    status: 'running',
    description: 'Advanced Video Downloader Backend',
    endpoints: {
      health: '/api/health',
      download: '/api/download',
      info: '/api/info'
    },
    documentation: 'https://github.com/genspark-ai/vidgrab-pro',
    author: 'GenSpark AI Developer'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist.`,
    availableEndpoints: ['/api/health', '/api/download', '/api/info']
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('💀 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('💀 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 VidGrab Pro Backend Server Started');
  console.log('=====================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🛡️  Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests per ${parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 60000 || 15} minutes`);
  console.log('=====================================');
});

module.exports = { app, server };