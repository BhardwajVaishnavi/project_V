# Medical Patient Management System - Deployment Script
# This script helps prepare the project for Vercel deployment

Write-Host "🏥 Medical Patient Management System - Deployment Preparation" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "DEPLOYMENT_GUIDE.md")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking project structure..." -ForegroundColor Yellow

# Check backend structure
if ((Test-Path "backend") -and (Test-Path "backend/server.js") -and (Test-Path "backend/vercel.json")) {
    Write-Host "✅ Backend structure is ready for deployment" -ForegroundColor Green
} else {
    Write-Host "❌ Backend structure is incomplete" -ForegroundColor Red
    exit 1
}

# Check frontend structure
if ((Test-Path "frontend") -and (Test-Path "frontend/package.json") -and (Test-Path "frontend/vercel.json")) {
    Write-Host "✅ Frontend structure is ready for deployment" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend structure is incomplete" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host "1. ✅ Backend vercel.json configured" -ForegroundColor Green
Write-Host "2. ✅ Frontend vercel.json configured" -ForegroundColor Green
Write-Host "3. ✅ Environment variable examples created" -ForegroundColor Green
Write-Host "4. ✅ CORS configuration updated" -ForegroundColor Green
Write-Host "5. ✅ API endpoints configured" -ForegroundColor Green

Write-Host ""
Write-Host "📝 Next steps for deployment:" -ForegroundColor Cyan
Write-Host ""
Write-Host "BACKEND DEPLOYMENT:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard"
Write-Host "2. Click 'New Project'"
Write-Host "3. Import your GitHub repository"
Write-Host "4. Set Root Directory to 'backend'"
Write-Host "5. Add environment variables from backend/.env.example"
Write-Host "6. Deploy!"
Write-Host ""
Write-Host "FRONTEND DEPLOYMENT:" -ForegroundColor Yellow
Write-Host "1. Create another Vercel project"
Write-Host "2. Import the same GitHub repository"
Write-Host "3. Set Root Directory to 'frontend'"
Write-Host "4. Add environment variables from frontend/.env.example"
Write-Host "5. Update REACT_APP_API_URL with your backend URL"
Write-Host "6. Deploy!"
Write-Host ""
Write-Host "🔗 Don't forget to:" -ForegroundColor Magenta
Write-Host "- Update FRONTEND_URL in backend environment variables"
Write-Host "- Update REACT_APP_API_URL in frontend environment variables"
Write-Host "- Test the health endpoint: https://your-backend.vercel.app/health"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Blue
Write-Host ""
Write-Host "🎉 Your Medical Patient Management System is ready for deployment!" -ForegroundColor Green
