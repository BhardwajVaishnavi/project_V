// Simple test to check if camp routes work
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Test route
app.get('/test-camps', async (req, res) => {
  try {
    console.log('Testing camp database access...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test camp table access
    const camps = await prisma.camp.findMany({
      take: 5,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    console.log(`✅ Found ${camps.length} camps`);
    
    res.json({
      success: true,
      message: 'Camp API test successful',
      data: {
        campCount: camps.length,
        camps: camps
      }
    });
  } catch (error) {
    console.error('❌ Camp test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Camp test failed',
      error: error.message
    });
  }
});

// Test camp creation
app.post('/test-create-camp', async (req, res) => {
  try {
    console.log('Testing camp creation...');
    
    // Get a user for testing
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error('No user found for testing');
    }
    
    const testCamp = {
      name: 'Test Camp ' + Date.now(),
      venue: 'Test Venue',
      date: new Date('2025-09-01'),
      startTime: '07:00',
      endTime: '13:00',
      description: 'Test camp for debugging',
      maxCapacity: 50,
      createdById: user.id
    };
    
    const camp = await prisma.camp.create({
      data: testCamp,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    console.log('✅ Camp created successfully:', camp.name);
    
    res.json({
      success: true,
      message: 'Camp creation test successful',
      data: camp
    });
  } catch (error) {
    console.error('❌ Camp creation test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Camp creation test failed',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Camp test server running on port ${PORT}`);
  console.log(`📋 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/test-camps`);
  console.log(`   POST http://localhost:${PORT}/test-create-camp`);
});
