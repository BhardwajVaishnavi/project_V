#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the project is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Medical Patient Management System - Deployment Verification');
console.log('==============================================================');

let allChecks = true;

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: Found`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    allChecks = false;
    return false;
  }
}

function checkPackageJson(dir, type) {
  const packagePath = path.join(dir, 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log(`\n📦 ${type} Package.json Check:`);
    
    // Check scripts
    if (pkg.scripts) {
      if (type === 'Backend') {
        if (pkg.scripts.start) console.log('✅ Start script: Found');
        else { console.log('❌ Start script: Missing'); allChecks = false; }
        
        if (pkg.scripts['vercel-build']) console.log('✅ Vercel-build script: Found');
        else { console.log('❌ Vercel-build script: Missing'); allChecks = false; }
      } else {
        if (pkg.scripts.build) console.log('✅ Build script: Found');
        else { console.log('❌ Build script: Missing'); allChecks = false; }
      }
    }
    
    // Check engines
    if (pkg.engines && pkg.engines.node) {
      console.log('✅ Node version specified');
    } else {
      console.log('⚠️  Node version not specified (recommended)');
    }
    
    return true;
  } else {
    console.log(`❌ ${type} package.json: Missing`);
    allChecks = false;
    return false;
  }
}

console.log('\n🏗️  Project Structure Check:');
checkFile('backend', 'Backend directory');
checkFile('frontend', 'Frontend directory');
checkFile('backend/server.js', 'Backend server file');
checkFile('backend/vercel.json', 'Backend Vercel config');
checkFile('frontend/vercel.json', 'Frontend Vercel config');
checkFile('backend/.env.example', 'Backend environment example');
checkFile('frontend/.env.example', 'Frontend environment example');

console.log('\n📋 Configuration Files Check:');
checkFile('DEPLOYMENT_GUIDE.md', 'Deployment guide');
checkFile('VERCEL_DEPLOYMENT_SUMMARY.md', 'Deployment summary');
checkFile('VERCEL_TROUBLESHOOTING.md', 'Troubleshooting guide');

// Check package.json files
checkPackageJson('backend', 'Backend');
checkPackageJson('frontend', 'Frontend');

// Check Vercel configurations
console.log('\n⚙️  Vercel Configuration Check:');

// Backend vercel.json
if (fs.existsSync('backend/vercel.json')) {
  try {
    const backendVercel = JSON.parse(fs.readFileSync('backend/vercel.json', 'utf8'));
    if (backendVercel.builds && backendVercel.routes) {
      console.log('✅ Backend Vercel config: Valid');
    } else {
      console.log('❌ Backend Vercel config: Invalid structure');
      allChecks = false;
    }
  } catch (e) {
    console.log('❌ Backend Vercel config: Invalid JSON');
    allChecks = false;
  }
}

// Frontend vercel.json
if (fs.existsSync('frontend/vercel.json')) {
  try {
    const frontendVercel = JSON.parse(fs.readFileSync('frontend/vercel.json', 'utf8'));
    if (frontendVercel.builds && frontendVercel.routes) {
      console.log('✅ Frontend Vercel config: Valid');
    } else {
      console.log('❌ Frontend Vercel config: Invalid structure');
      allChecks = false;
    }
  } catch (e) {
    console.log('❌ Frontend Vercel config: Invalid JSON');
    allChecks = false;
  }
}

// Check for common issues
console.log('\n🔧 Common Issues Check:');

// Check for node_modules in git
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('node_modules')) {
    console.log('✅ node_modules ignored in git');
  } else {
    console.log('⚠️  node_modules should be in .gitignore');
  }
}

// Check for .env files
if (fs.existsSync('backend/.env')) {
  console.log('⚠️  Backend .env file found (should not be committed)');
}
if (fs.existsSync('frontend/.env')) {
  console.log('⚠️  Frontend .env file found (should not be committed)');
}

// Check database schema
if (fs.existsSync('backend/prisma/schema.prisma')) {
  console.log('✅ Prisma schema found');
} else {
  console.log('❌ Prisma schema missing');
  allChecks = false;
}

console.log('\n📊 Summary:');
if (allChecks) {
  console.log('🎉 ALL CHECKS PASSED! Your project is ready for Vercel deployment.');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Deploy backend to Vercel (root: backend)');
  console.log('3. Deploy frontend to Vercel (root: frontend)');
  console.log('4. Configure environment variables');
  console.log('5. Test your deployed application');
  console.log('');
  console.log('📖 See VERCEL_DEPLOYMENT_SUMMARY.md for detailed instructions');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.');
  console.log('');
  console.log('🔧 Quick fixes:');
  console.log('- Run: node vercel-deploy-fix.js');
  console.log('- Check VERCEL_TROUBLESHOOTING.md for solutions');
}

console.log('');
console.log('🏥 Medical Patient Management System Deployment Verification Complete');
