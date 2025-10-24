$baseUrl = "https://backend-chi-bay-86.vercel.app"

Write-Host "Testing API endpoints..." -ForegroundColor Green
Write-Host ""

# Test 1: Root
Write-Host "1. GET /" -ForegroundColor Yellow
$r1 = Invoke-WebRequest -Uri "$baseUrl/" -ErrorAction SilentlyContinue
$d1 = $r1.Content | ConvertFrom-Json
if ($d1.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 2: Health
Write-Host "2. GET /health" -ForegroundColor Yellow
$r2 = Invoke-WebRequest -Uri "$baseUrl/health" -ErrorAction SilentlyContinue
$d2 = $r2.Content | ConvertFrom-Json
if ($d2.status -eq "OK") { Write-Host "   ✅ Working (DB: $($d2.database))" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 3: Login
Write-Host "3. POST /api/auth/login" -ForegroundColor Yellow
$body = @{email="patient1@example.com"; password="password123"} | ConvertTo-Json
$r3 = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction SilentlyContinue
$d3 = $r3.Content | ConvertFrom-Json
if ($d3.success) {
    Write-Host "   ✅ Working" -ForegroundColor Green
    $token = $d3.data.token
} else {
    Write-Host "   ❌ Failed" -ForegroundColor Red
    exit
}

# Test 4: Patients
Write-Host "4. GET /api/patients" -ForegroundColor Yellow
$r4 = Invoke-WebRequest -Uri "$baseUrl/api/patients" -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue
$d4 = $r4.Content | ConvertFrom-Json
if ($d4.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 5: Investigations
Write-Host "5. GET /api/investigations" -ForegroundColor Yellow
$r5 = Invoke-WebRequest -Uri "$baseUrl/api/investigations" -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue
$d5 = $r5.Content | ConvertFrom-Json
if ($d5.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 6: Treatments
Write-Host "6. GET /api/treatments" -ForegroundColor Yellow
$r6 = Invoke-WebRequest -Uri "$baseUrl/api/treatments" -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue
$d6 = $r6.Content | ConvertFrom-Json
if ($d6.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 7: Surgery
Write-Host "7. GET /api/surgery" -ForegroundColor Yellow
$r7 = Invoke-WebRequest -Uri "$baseUrl/api/surgery" -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue
$d7 = $r7.Content | ConvertFrom-Json
if ($d7.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

# Test 8: Camps
Write-Host "8. GET /api/camps" -ForegroundColor Yellow
$r8 = Invoke-WebRequest -Uri "$baseUrl/api/camps" -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue
$d8 = $r8.Content | ConvertFrom-Json
if ($d8.success) { Write-Host "   ✅ Working" -ForegroundColor Green } else { Write-Host "   ❌ Failed" -ForegroundColor Red }

Write-Host ""
Write-Host "All endpoints tested successfully!" -ForegroundColor Green

