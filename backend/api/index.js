// Vercel Serverless Function Handler
// This file handles all API requests in the Vercel serverless environment

process.env.NODE_ENV = 'production';

try {
  const app = require('../server');
  module.exports = app;
} catch (error) {
  console.error('Failed to load server:', error);
  // Fallback to minimal server if main server fails
  const express = require('express');
  const fallbackApp = express();
  fallbackApp.get('/', (_req, res) => {
    res.status(500).json({
      error: 'Server initialization failed',
      message: error.message
    });
  });
  module.exports = fallbackApp;
}

