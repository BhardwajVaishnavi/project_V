#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Medical Patient Management to Vercel...\n');

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
async function deployToVercel() {
  console.log('🔍 Checking deployment requirements...');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI found\n');
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    runCommand('npm install -g vercel', 'Installing Vercel CLI globally');
  }
  
  // Check if required files exist
  const requiredFiles = [
    'package.json',
    'server.js',
    'vercel.json',
    'client/package.json'
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
  }
  
  console.log('✅ All required files present\n');
  
  // Step 1: Install dependencies
  runCommand('npm install', 'Installing root dependencies');
  
  // Step 2: Install client dependencies with legacy peer deps
  runCommand('cd client && npm install --legacy-peer-deps', 'Installing client dependencies');
  
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
  
  // Step 6: Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  console.log('📋 You will need to:');
  console.log('   1. Login to Vercel (if not already logged in)');
  console.log('   2. Set up environment variables in Vercel dashboard');
  console.log('   3. Configure your database URL\n');
  
  runCommand('vercel --prod', 'Deploying to Vercel');
  
  console.log('🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to Vercel dashboard: https://vercel.com/dashboard');
  console.log('2. Find your deployed project');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add the following environment variables:');
  console.log('   - DATABASE_URL (your PostgreSQL connection string)');
  console.log('   - JWT_SECRET (a secure random string)');
  console.log('   - NODE_ENV=production');
  console.log('5. Redeploy if needed');
  console.log('\n🌐 Your app should be live at: https://your-project-name.vercel.app');
}

// Run deployment
deployToVercel().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
