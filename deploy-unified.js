#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Unified Medical Patient Management Deployment...\n');

// Function to run commands with error handling
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Main deployment process
async function deploy() {
  console.log('🔍 Checking project structure...');
  
  // Check if required files exist
  const requiredFiles = [
    'package.json',
    'server.js',
    'client/package.json',
    'prisma/schema.prisma'
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Project structure verified\n');
  
  // Step 1: Install root dependencies
  runCommand('npm install', 'Installing root dependencies');
  
  // Step 2: Install client dependencies
  runCommand('cd client && npm install', 'Installing client dependencies');
  
  // Step 3: Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client');
  
  // Step 4: Build React app
  runCommand('npm run build', 'Building React application');
  
  // Step 5: Check if build was successful
  if (!fileExists('client/build/index.html')) {
    console.error('❌ React build failed - index.html not found');
    process.exit(1);
  }
  
  console.log('✅ React build successful\n');
  
  // Step 6: Create production environment file if it doesn't exist
  if (!fileExists('.env.production')) {
    console.log('📝 Creating production environment file...');
    const prodEnv = `# Production Environment Variables
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=your_production_frontend_url
`;
    fs.writeFileSync('.env.production', prodEnv);
    console.log('✅ .env.production created (please update with your values)\n');
  }
  
  console.log('🎉 Deployment preparation completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update .env.production with your production values');
  console.log('2. Set up your production database');
  console.log('3. Run: npm start (for production)');
  console.log('4. Or run: npm run dev (for development)');
  console.log('\n🌐 Your app will be available at: http://localhost:5000');
}

// Run deployment
deploy().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
