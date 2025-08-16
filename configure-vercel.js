#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuring Medical Patient Management System on Vercel\n');

// Function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to generate JWT secret
function generateJWTSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to set Vercel environment variable
function setVercelEnv(key, value) {
  try {
    console.log(`📝 Setting ${key}...`);
    execSync(`vercel env add ${key} production`, {
      input: value + '\n',
      stdio: ['pipe', 'inherit', 'inherit']
    });
    console.log(`✅ ${key} set successfully`);
  } catch (error) {
    console.error(`❌ Failed to set ${key}:`, error.message);
    console.log(`💡 Manual setup required for ${key}`);
  }
}

async function configure() {
  console.log('🎯 Let\'s configure your environment variables!\n');
  
  // Get database URL
  console.log('📊 Database Configuration:');
  console.log('1. Go to https://neon.tech (or https://supabase.com)');
  console.log('2. Create account and new project');
  console.log('3. Copy the connection string\n');
  
  const databaseUrl = await askQuestion('📝 Enter your DATABASE_URL: ');
  
  if (!databaseUrl || !databaseUrl.includes('postgresql://')) {
    console.log('❌ Invalid database URL. Please make sure it starts with postgresql://');
    process.exit(1);
  }
  
  // Generate JWT secret
  const jwtSecret = generateJWTSecret();
  console.log(`🔐 Generated JWT_SECRET: ${jwtSecret.substring(0, 20)}...\n`);
  
  // Get Vercel URL
  const vercelUrl = await askQuestion('🌐 Enter your Vercel app URL (e.g., https://your-app.vercel.app): ');
  
  console.log('\n🚀 Setting up environment variables...\n');
  
  // Set environment variables
  const envVars = [
    { key: 'DATABASE_URL', value: databaseUrl },
    { key: 'JWT_SECRET', value: jwtSecret },
    { key: 'NODE_ENV', value: 'production' },
    { key: 'FRONTEND_URL', value: vercelUrl },
    { key: 'RATE_LIMIT_WINDOW_MS', value: '900000' },
    { key: 'RATE_LIMIT_MAX_REQUESTS', value: '100' }
  ];
  
  console.log('📋 Environment variables to set:');
  envVars.forEach(env => {
    console.log(`   ${env.key}: ${env.key === 'DATABASE_URL' ? env.value.substring(0, 30) + '...' : 
                                   env.key === 'JWT_SECRET' ? env.value.substring(0, 20) + '...' : 
                                   env.value}`);
  });
  
  const proceed = await askQuestion('\n❓ Proceed with setting these variables? (y/n): ');
  
  if (proceed.toLowerCase() === 'y' || proceed.toLowerCase() === 'yes') {
    console.log('\n🔧 Setting environment variables in Vercel...\n');
    
    for (const env of envVars) {
      setVercelEnv(env.key, env.value);
    }
    
    console.log('\n✅ Environment variables configured!');
    console.log('\n📋 Next steps:');
    console.log('1. Initialize database schema: npx prisma db push');
    console.log('2. Redeploy your app: vercel --prod');
    console.log('3. Test your application');
    
  } else {
    console.log('\n📝 Manual setup required:');
    console.log('Go to: https://vercel.com/dashboard');
    console.log('1. Select your project');
    console.log('2. Go to Settings → Environment Variables');
    console.log('3. Add each variable listed above');
  }
  
  rl.close();
}

// Run configuration
configure().catch(error => {
  console.error('❌ Configuration failed:', error);
  process.exit(1);
});
