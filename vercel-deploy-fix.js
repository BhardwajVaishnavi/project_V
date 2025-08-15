#!/usr/bin/env node

/**
 * Vercel Deployment Fix Script for Medical Patient Management System
 * This script resolves common deployment issues and prepares the project for Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🏥 Medical Patient Management System - Vercel Deployment Fix');
console.log('============================================================');

// Check if we're in the right directory
if (!fs.existsSync('DEPLOYMENT_GUIDE.md')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

console.log('📋 Checking and fixing deployment configuration...');

// Fix 1: Ensure backend package.json has correct scripts
const backendPackagePath = path.join('backend', 'package.json');
if (fs.existsSync(backendPackagePath)) {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  
  // Ensure correct scripts for Vercel
  backendPackage.scripts = {
    ...backendPackage.scripts,
    "start": "node server.js",
    "build": "npm install",
    "vercel-build": "npm install && npx prisma generate"
  };

  // Ensure engines are specified
  backendPackage.engines = {
    "node": ">=18.0.0"
  };

  fs.writeFileSync(backendPackagePath, JSON.stringify(backendPackage, null, 2));
  console.log('✅ Backend package.json updated');
} else {
  console.error('❌ Backend package.json not found');
}

// Fix 2: Ensure frontend package.json has correct scripts
const frontendPackagePath = path.join('frontend', 'package.json');
if (fs.existsSync(frontendPackagePath)) {
  const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
  
  // Ensure correct scripts for Vercel
  frontendPackage.scripts = {
    ...frontendPackage.scripts,
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  };

  // Ensure engines are specified
  frontendPackage.engines = {
    "node": ">=18.0.0"
  };

  fs.writeFileSync(frontendPackagePath, JSON.stringify(frontendPackage, null, 2));
  console.log('✅ Frontend package.json updated');
} else {
  console.error('❌ Frontend package.json not found');
}

// Fix 3: Create optimized backend vercel.json
const backendVercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/health",
      "dest": "/server.js"
    },
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
};

fs.writeFileSync(path.join('backend', 'vercel.json'), JSON.stringify(backendVercelConfig, null, 2));
console.log('✅ Backend vercel.json optimized');

// Fix 4: Create optimized frontend vercel.json
const frontendVercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
};

fs.writeFileSync(path.join('frontend', 'vercel.json'), JSON.stringify(frontendVercelConfig, null, 2));
console.log('✅ Frontend vercel.json optimized');

// Fix 5: Create .vercelignore files
const backendVercelIgnore = `
node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
uploads/*
!uploads/.gitkeep
`;

const frontendVercelIgnore = `
node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
build
`;

fs.writeFileSync(path.join('backend', '.vercelignore'), backendVercelIgnore.trim());
fs.writeFileSync(path.join('frontend', '.vercelignore'), frontendVercelIgnore.trim());
console.log('✅ .vercelignore files created');

// Fix 6: Update environment variable examples with correct format
const backendEnvExample = `# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_2024

# Environment
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Server Configuration
PORT=5000

# Optional: AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=medical-patient-files

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

const frontendEnvExample = `# API Configuration
REACT_APP_API_URL=https://your-backend-domain.vercel.app
REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app/api

# Environment
REACT_APP_NODE_ENV=production

# Application Configuration
REACT_APP_APP_NAME=Medical Patient Management System
REACT_APP_VERSION=1.0.0

# Optional: Analytics or other services
# REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
# REACT_APP_SENTRY_DSN=your-sentry-dsn
`;

fs.writeFileSync(path.join('backend', '.env.example'), backendEnvExample);
fs.writeFileSync(path.join('frontend', '.env.example'), frontendEnvExample);
console.log('✅ Environment variable examples updated');

console.log('');
console.log('🎉 Deployment configuration fixed successfully!');
console.log('');
console.log('📝 Next steps for Vercel deployment:');
console.log('');
console.log('1. BACKEND DEPLOYMENT:');
console.log('   - Go to https://vercel.com/dashboard');
console.log('   - Click "New Project"');
console.log('   - Import your GitHub repository');
console.log('   - Set Root Directory to "backend"');
console.log('   - Add environment variables from backend/.env.example');
console.log('   - Deploy!');
console.log('');
console.log('2. FRONTEND DEPLOYMENT:');
console.log('   - Create another Vercel project');
console.log('   - Import the same GitHub repository');
console.log('   - Set Root Directory to "frontend"');
console.log('   - Add environment variables from frontend/.env.example');
console.log('   - Update REACT_APP_API_URL with your backend URL');
console.log('   - Deploy!');
console.log('');
console.log('3. UPDATE CROSS-REFERENCES:');
console.log('   - Update backend FRONTEND_URL with actual frontend domain');
console.log('   - Update frontend REACT_APP_API_URL with actual backend domain');
console.log('   - Redeploy both if needed');
console.log('');
console.log('🔗 Test endpoints after deployment:');
console.log('   - Backend health: https://your-backend.vercel.app/health');
console.log('   - Frontend app: https://your-frontend.vercel.app');
console.log('   - Login: admin@medical.com / admin123');
console.log('');
console.log('✨ Your Medical Patient Management System is ready for deployment!');
