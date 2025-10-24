# PowerShell API Test Script

Write-Host "🧪 Testing Camp API..." -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1️⃣ Testing server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Server is healthy" -ForegroundColor Green
    Write-Host "📊 Uptime: $($health.uptime) seconds" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n2️⃣ Testing login..." -ForegroundColor Yellow
$loginBody = @{
    email = "doctor@medical.com"
    password = "doctor123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "✅ Login successful" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "🔑 Token received: $($token.Substring(0, 20))..." -ForegroundColor Cyan
        
        # Test 3: Get Camps
        Write-Host "`n3️⃣ Testing get camps..." -ForegroundColor Yellow
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $campsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/camps" -Method GET -Headers $headers
            
            if ($campsResponse.success) {
                Write-Host "✅ Get camps successful" -ForegroundColor Green
                Write-Host "📊 Found $($campsResponse.data.camps.Count) camps" -ForegroundColor Cyan
                
                if ($campsResponse.data.camps.Count -gt 0) {
                    $firstCamp = $campsResponse.data.camps[0]
                    Write-Host "📋 First camp: $($firstCamp.name)" -ForegroundColor Cyan
                }
            } else {
                Write-Host "❌ Get camps failed: $($campsResponse.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Get camps error: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Test 4: Create Camp
        Write-Host "`n4️⃣ Testing create camp..." -ForegroundColor Yellow
        $campData = @{
            name = "PowerShell Test Camp"
            venue = "Test Venue PowerShell"
            date = "2025-08-17T07:00:00.000Z"
            startTime = "07:00"
            endTime = "13:00"
            description = "Test camp created via PowerShell"
            maxCapacity = 75
        } | ConvertTo-Json
        
        try {
            $createResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/camps" -Method POST -Body $campData -Headers $headers
            
            if ($createResponse.success) {
                Write-Host "✅ Create camp successful" -ForegroundColor Green
                Write-Host "📋 Created camp: $($createResponse.data.name)" -ForegroundColor Cyan
                Write-Host "🆔 Camp ID: $($createResponse.data.id)" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Create camp failed: $($createResponse.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Create camp error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "📋 Response: $($_.Exception.Response)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login failed: $($loginResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🏁 API tests completed!" -ForegroundColor Green
