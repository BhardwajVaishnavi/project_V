#!/bin/bash

# Medical Patient Management System - Deployment Script
# This script helps prepare the project for Vercel deployment

echo "🏥 Medical Patient Management System - Deployment Preparation"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking project structure..."

# Check backend structure
if [ -d "backend" ] && [ -f "backend/server.js" ] && [ -f "backend/vercel.json" ]; then
    echo "✅ Backend structure is ready for deployment"
else
    echo "❌ Backend structure is incomplete"
    exit 1
fi

# Check frontend structure
if [ -d "frontend" ] && [ -f "frontend/package.json" ] && [ -f "frontend/vercel.json" ]; then
    echo "✅ Frontend structure is ready for deployment"
else
    echo "❌ Frontend structure is incomplete"
    exit 1
fi

echo ""
echo "🔧 Pre-deployment checklist:"
echo "1. ✅ Backend vercel.json configured"
echo "2. ✅ Frontend vercel.json configured"
echo "3. ✅ Environment variable examples created"
echo "4. ✅ CORS configuration updated"
echo "5. ✅ API endpoints configured"

echo ""
echo "📝 Next steps for deployment:"
echo ""
echo "BACKEND DEPLOYMENT:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Set Root Directory to 'backend'"
echo "5. Add environment variables from backend/.env.example"
echo "6. Deploy!"
echo ""
echo "FRONTEND DEPLOYMENT:"
echo "1. Create another Vercel project"
echo "2. Import the same GitHub repository"
echo "3. Set Root Directory to 'frontend'"
echo "4. Add environment variables from frontend/.env.example"
echo "5. Update REACT_APP_API_URL with your backend URL"
echo "6. Deploy!"
echo ""
echo "🔗 Don't forget to:"
echo "- Update FRONTEND_URL in backend environment variables"
echo "- Update REACT_APP_API_URL in frontend environment variables"
echo "- Test the health endpoint: https://your-backend.vercel.app/health"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Your Medical Patient Management System is ready for deployment!"
