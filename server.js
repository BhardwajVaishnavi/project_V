const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import routes
const authRoutes = require('./src/routes/auth');
const patientRoutes = require('./src/routes/patients');
const investigationRoutes = require('./src/routes/investigations');
const treatmentRoutes = require('./src/routes/treatments');
const surgeryRoutes = require('./src/routes/surgery');
const liverTransplantRoutes = require('./src/routes/liverTransplant');
const fileRoutes = require('./src/routes/files');
const followUpRoutes = require('./src/routes/followUp');

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
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL || 'https://medical-patient-management.vercel.app',
      'https://*.vercel.app',
      'https://medical-patient-management-*.vercel.app'
    ]
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Serve static files from React build (for production)
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'Connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
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

// Serve static files from React build (if available)
const buildPath = path.join(__dirname, 'client/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Only serve React app for non-API routes
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/health')) {
    const indexPath = path.join(__dirname, 'client/build', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // Fallback HTML if React build doesn't exist
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Medical Patient Management System</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                .container { text-align: center; }
                .status { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .api-test { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
                button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
                button:hover { background: #0056b3; }
                .result { margin: 10px 0; padding: 10px; border-radius: 4px; }
                .success { background: #d4edda; color: #155724; }
                .error { background: #f8d7da; color: #721c24; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏥 Medical Patient Management System</h1>
                <div class="status">
                    <h2>✅ Backend Server is Running!</h2>
                    <p>Your medical management system backend is successfully deployed on Vercel.</p>
                </div>

                <div class="api-test">
                    <h3>🔧 API Testing</h3>
                    <button onclick="testHealth()">Test Health Check</button>
                    <button onclick="testLogin()">Test Login API</button>
                    <button onclick="testPatients()">Test Patients API</button>
                    <div id="results"></div>
                </div>

                <div class="status">
                    <h3>📋 Available API Endpoints:</h3>
                    <ul style="text-align: left;">
                        <li><strong>Health Check:</strong> <a href="/health">/health</a></li>
                        <li><strong>Authentication:</strong> /api/auth/login, /api/auth/register</li>
                        <li><strong>Patients:</strong> /api/patients (GET, POST, PUT, DELETE)</li>
                        <li><strong>Investigations:</strong> /api/investigations</li>
                        <li><strong>Treatments:</strong> /api/treatments</li>
                        <li><strong>Surgeries:</strong> /api/surgeries</li>
                        <li><strong>Follow-ups:</strong> /api/followups</li>
                    </ul>
                </div>

                <div class="status">
                    <h3>🔐 Default Admin Credentials:</h3>
                    <p><strong>Email:</strong> admin@medical.com</p>
                    <p><strong>Password:</strong> admin123</p>
                </div>
            </div>

            <script>
                function addResult(message, type) {
                    const results = document.getElementById('results');
                    const div = document.createElement('div');
                    div.className = 'result ' + type;
                    div.textContent = message;
                    results.appendChild(div);
                }

                async function testHealth() {
                    try {
                        const response = await fetch('/health');
                        const data = await response.json();
                        addResult('✅ Health Check: ' + JSON.stringify(data), 'success');
                    } catch (error) {
                        addResult('❌ Health Check Error: ' + error.message, 'error');
                    }
                }

                async function testLogin() {
                    try {
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: 'admin@medical.com', password: 'admin123' })
                        });
                        const data = await response.json();
                        if (data.success) {
                            addResult('✅ Login successful: ' + data.data.user.email, 'success');
                        } else {
                            addResult('❌ Login failed: ' + data.message, 'error');
                        }
                    } catch (error) {
                        addResult('❌ Login Error: ' + error.message, 'error');
                    }
                }

                async function testPatients() {
                    try {
                        const response = await fetch('/api/patients');
                        const data = await response.json();
                        addResult('✅ Patients API: Found ' + (data.data?.patients?.length || 0) + ' patients', 'success');
                    } catch (error) {
                        addResult('❌ Patients API Error: ' + error.message, 'error');
                    }
                }
            </script>
        </body>
        </html>
      `);
    }
  } else {
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`💊 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
