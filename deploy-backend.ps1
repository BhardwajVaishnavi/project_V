# 🚀 KIMS LIVER TRANSPLANT - BACKEND DEPLOYMENT SCRIPT
# This script deploys the backend to Vercel and updates the mobile app

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  KIMS LIVER TRANSPLANT - BACKEND DEPLOYMENT SCRIPT        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Vercel CLI is installed
Write-Host "📋 Step 1: Checking Vercel CLI..." -ForegroundColor Yellow
$vercelCheck = npm list -g vercel 2>$null
if ($vercelCheck -like "*vercel*") {
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}
Write-Host ""

# Step 2: Check backend folder
Write-Host "📋 Step 2: Checking backend folder..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Write-Host "✅ Backend folder found" -ForegroundColor Green
} else {
    Write-Host "❌ Backend folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Check .env file
Write-Host "📋 Step 3: Checking environment variables..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "📋 Step 4: Deploying backend to Vercel..." -ForegroundColor Yellow
Write-Host "This will open your browser for authentication if needed." -ForegroundColor Cyan
Write-Host ""

cd backend
Write-Host "Running: vercel deploy --prod" -ForegroundColor Cyan
vercel deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    cd ..
    exit 1
}

cd ..
Write-Host ""

# Step 5: Get deployment URL
Write-Host "📋 Step 5: Getting deployment URL..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your backend is now deployed to Vercel!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Copy your backend URL from the output above" -ForegroundColor Yellow
Write-Host "   Format: https://your-project-name.vercel.app" -ForegroundColor Yellow
Write-Host ""

# Step 6: Prompt for backend URL
Write-Host "📋 Step 6: Update mobile app with backend URL..." -ForegroundColor Yellow
$backendUrl = Read-Host "Enter your backend URL (e.g., https://kims-liver-transplant.vercel.app)"

if ($backendUrl -eq "") {
    Write-Host "❌ Backend URL is required!" -ForegroundColor Red
    exit 1
}

# Add /api to the URL if not present
if (-not $backendUrl.EndsWith("/api")) {
    $backendUrl = "$backendUrl/api"
}

Write-Host "✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Step 7: Update API service
Write-Host "📋 Step 7: Updating API service..." -ForegroundColor Yellow
$apiServicePath = "dr_satya_portal\lib\services\api_service.dart"

if (Test-Path $apiServicePath) {
    $content = Get-Content $apiServicePath -Raw
    $oldUrl = "static const String baseUrl = 'http://localhost:5000/api';"
    $newUrl = "static const String baseUrl = '$backendUrl';"
    
    $content = $content -replace [regex]::Escape($oldUrl), $newUrl
    Set-Content $apiServicePath $content
    
    Write-Host "✅ API service updated" -ForegroundColor Green
} else {
    Write-Host "❌ API service file not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 8: Rebuild APK
Write-Host "📋 Step 8: Rebuilding APK..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes..." -ForegroundColor Cyan
Write-Host ""

cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ APK build failed!" -ForegroundColor Red
    cd ..
    exit 1
}

cd ..
Write-Host ""

# Step 9: Verify APK
Write-Host "📋 Step 9: Verifying APK..." -ForegroundColor Yellow
$apkPath = "dr_satya_portal\build\app\outputs\flutter-apk\app-release.apk"

if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "✅ APK ready: $apkSize MB" -ForegroundColor Green
} else {
    Write-Host "❌ APK not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 10: Summary
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT COMPLETE!                                  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "  ✅ Backend deployed to Vercel" -ForegroundColor Green
Write-Host "  ✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "  ✅ Mobile app updated" -ForegroundColor Green
Write-Host "  ✅ APK rebuilt: $apkSize MB" -ForegroundColor Green
Write-Host ""
Write-Host "📱 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Install APK: adb install -r $apkPath" -ForegroundColor Yellow
Write-Host "  2. Open app on device" -ForegroundColor Yellow
Write-Host "  3. Login: patient1@example.com / password123" -ForegroundColor Yellow
Write-Host "  4. Verify all features work" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Your app is production-ready!" -ForegroundColor Green

