// Test endpoint to verify Vercel is working
module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Vercel is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
};

