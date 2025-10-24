const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Use shared Prisma instance
const prisma = require('./src/lib/prisma');

// Import routes
const authRoutes = require('./src/routes/auth');
const patientRoutes = require('./src/routes/patients');
const investigationRoutes = require('./src/routes/investigations');
const treatmentRoutes = require('./src/routes/treatments');
const surgeryRoutes = require('./src/routes/surgery');
const liverTransplantRoutes = require('./src/routes/liverTransplant');
const fileRoutes = require('./src/routes/files');
const followUpRoutes = require('./src/routes/followUp');
const campRoutes = require('./src/routes/camps');
const campRegistrationRoutes = require('./src/routes/campRegistrations');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');
const { authMiddleware } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // In production, check against allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://medical-patient-management.vercel.app'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Medical Patient Management System API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      patients: '/api/patients',
      investigations: '/api/investigations',
      treatments: '/api/treatments',
      surgery: '/api/surgery',
      liverTransplant: '/api/liver-transplant',
      files: '/api/files',
      followUp: '/api/follow-up'
    },
    documentation: 'Visit /health for system status'
  });
});

// Simple ping endpoint (no database required)
app.get('/ping', (_req, res) => {
  res.status(200).json({
    status: 'pong',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return res.status(503).json({
        status: 'Error',
        timestamp: new Date().toISOString(),
        database: 'Disconnected',
        error: dbError.message,
        environment: process.env.NODE_ENV
      });
    }

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'Connected',
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: process.env.NODE_ENV
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', authMiddleware, patientRoutes);
app.use('/api/investigations', authMiddleware, investigationRoutes);
app.use('/api/treatments', authMiddleware, treatmentRoutes);
app.use('/api/surgery', authMiddleware, surgeryRoutes);
app.use('/api/liver-transplant', authMiddleware, liverTransplantRoutes);
app.use('/api/files', authMiddleware, fileRoutes);
app.use('/api/follow-up', authMiddleware, followUpRoutes);
app.use('/api/camps', authMiddleware, campRoutes);
app.use('/api/camp-registrations', campRegistrationRoutes); // Public for registrations

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server - Handle both local and Vercel environments
if (process.env.NODE_ENV !== 'production') {
  // Local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`💊 Health Check: http://localhost:${PORT}/health`);
  });
}

// Always export the app for Vercel serverless functions
module.exports = app;
