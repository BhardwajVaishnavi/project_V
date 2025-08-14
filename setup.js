#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 Medical Patient Management System - Setup Script');
console.log('==================================================\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

// Function to create environment files
function createEnvFiles() {
  console.log('📋 Creating environment files...');
  
  // Backend .env
  const backendEnv = `# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_minimum_32_characters
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=medical-patient-files

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  // Frontend .env
  const frontendEnv = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Medical Patient Management System
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
`;

  // Write backend .env
  if (!fs.existsSync('backend/.env')) {
    fs.writeFileSync('backend/.env', backendEnv);
    console.log('✅ Created backend/.env');
  } else {
    console.log('⚠️  backend/.env already exists, skipping...');
  }

  // Write frontend .env
  if (!fs.existsSync('frontend/.env')) {
    fs.writeFileSync('frontend/.env', frontendEnv);
    console.log('✅ Created frontend/.env');
  } else {
    console.log('⚠️  frontend/.env already exists, skipping...');
  }

  console.log('✅ Environment files created\n');
}

// Function to install dependencies
function installDependencies() {
  console.log('📋 Installing dependencies...\n');
  
  // Install root dependencies
  runCommand('npm install', 'Installing root dependencies');
  
  // Install backend dependencies
  process.chdir('backend');
  runCommand('npm install', 'Installing backend dependencies');
  
  // Install frontend dependencies
  process.chdir('../frontend');
  runCommand('npm install', 'Installing frontend dependencies');
  
  // Go back to root
  process.chdir('..');
}

// Function to setup database
function setupDatabase() {
  console.log('📋 Setting up database...\n');
  
  process.chdir('backend');
  
  // Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client');
  
  // Push database schema
  runCommand('npx prisma db push', 'Pushing database schema');
  
  process.chdir('..');
}

// Function to create demo user
function createDemoUser() {
  console.log('📋 Creating demo user...');
  
  const createUserScript = `
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'doctor@medical.com' },
      update: {},
      create: {
        email: 'doctor@medical.com',
        password: hashedPassword,
        firstName: 'Dr. John',
        lastName: 'Doe',
        role: 'DOCTOR',
      },
    });
    
    console.log('✅ Demo user created:', user.email);
  } catch (error) {
    console.log('⚠️  Demo user might already exist or error occurred:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
`;

  fs.writeFileSync('backend/create-demo-user.js', createUserScript);
  
  process.chdir('backend');
  runCommand('node create-demo-user.js', 'Creating demo user');
  
  // Clean up
  fs.unlinkSync('create-demo-user.js');
  
  process.chdir('..');
  
  console.log('✅ Demo user setup completed\n');
}

// Main setup function
async function main() {
  try {
    console.log('🚀 Starting setup process...\n');
    
    // Check if we're in the right directory
    if (!fs.existsSync('package.json') || !fs.existsSync('backend') || !fs.existsSync('frontend')) {
      console.error('❌ Please run this script from the project root directory');
      process.exit(1);
    }
    
    // Create environment files
    createEnvFiles();
    
    // Install dependencies
    installDependencies();
    
    // Setup database
    setupDatabase();
    
    // Create demo user
    createDemoUser();
    
    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Update backend/.env with your actual database URL and AWS credentials');
    console.log('2. Run "npm run dev" to start both frontend and backend');
    console.log('3. Open http://localhost:3000 in your browser');
    console.log('4. Login with: doctor@medical.com / password123\n');
    console.log('📚 For more information, see SETUP.md and API_DOCUMENTATION.md');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
main();
