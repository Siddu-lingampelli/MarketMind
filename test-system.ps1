Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MarketAI Suite - System Test Report" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Backend Health
Write-Host "Test 1: Backend Health Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  PASSED - Backend is running" -ForegroundColor Green
        Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  FAILED - Backend is not responding" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 2: Frontend Accessibility
Write-Host "Test 2: Frontend Accessibility" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  PASSED - Frontend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "  FAILED - Frontend is not accessible" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 3: File Structure
Write-Host "Test 3: File Structure" -ForegroundColor Yellow
$requiredFiles = @(
    "backend\server.js",
    "backend\package.json",
    "backend\.env",
    "backend\config\database.js",
    "backend\models\User.js",
    "backend\models\Campaign.js",
    "backend\models\Pitch.js",
    "backend\models\Lead.js",
    "backend\controllers\authController.js",
    "backend\controllers\campaignController.js",
    "backend\controllers\pitchController.js",
    "backend\controllers\leadController.js",
    "backend\services\groqService.js",
    "frontend\src\App.js",
    "frontend\src\index.js",
    "frontend\package.json",
    "frontend\src\pages\Login.js",
    "frontend\src\pages\Register.js",
    "frontend\src\pages\Dashboard.js",
    "frontend\src\pages\Campaign.js",
    "frontend\src\pages\SalesPitch.js",
    "frontend\src\pages\LeadScoring.js",
    "frontend\src\components\Navbar.js",
    "frontend\src\components\PrivateRoute.js",
    "frontend\src\services\api.js",
    "frontend\src\services\authService.js",
    "frontend\src\services\campaignService.js",
    "frontend\src\services\pitchService.js",
    "frontend\src\services\leadService.js",
    "frontend\src\context\AuthContext.js",
    "frontend\src\utils\constants.js",
    "frontend\src\utils\helpers.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  PASSED - All required files present ($($requiredFiles.Count) files)" -ForegroundColor Green
} else {
    Write-Host "  FAILED - Missing files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "    - $file" -ForegroundColor Red
    }
    $allPassed = $false
}
Write-Host ""

# Test 4: Dependencies
Write-Host "Test 4: Dependencies" -ForegroundColor Yellow
$backendModules = Test-Path "backend\node_modules"
$frontendModules = Test-Path "frontend\node_modules"

if ($backendModules -and $frontendModules) {
    Write-Host "  PASSED - All dependencies installed" -ForegroundColor Green
} else {
    if (-not $backendModules) {
        Write-Host "  FAILED - Backend dependencies missing" -ForegroundColor Red
        $allPassed = $false
    }
    if (-not $frontendModules) {
        Write-Host "  FAILED - Frontend dependencies missing" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# Test 5: Environment Configuration
Write-Host "Test 5: Environment Configuration" -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env" -Raw
    $hasMongoUri = $envContent -match "MONGODB_URI="
    $hasJwtSecret = $envContent -match "JWT_SECRET="
    $hasGroqKey = $envContent -match "GROQ_API_KEY="
    $groqConfigured = $envContent -notmatch "GROQ_API_KEY=your_groq_api_key_here"
    
    if ($hasMongoUri -and $hasJwtSecret -and $hasGroqKey) {
        if ($groqConfigured) {
            Write-Host "  PASSED - Environment configured" -ForegroundColor Green
        } else {
            Write-Host "  WARNING - Groq API key needs to be set" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  FAILED - Missing environment variables" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  FAILED - .env file missing" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 6: Port Availability
Write-Host "Test 6: Ports Status" -ForegroundColor Yellow
try {
    $port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($port5000) {
        Write-Host "  INFO - Port 5000 (Backend) is IN USE" -ForegroundColor Green
    } else {
        Write-Host "  WARNING - Port 5000 (Backend) is FREE (backend may not be running)" -ForegroundColor Yellow
    }
    
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Host "  INFO - Port 3000 (Frontend) is IN USE" -ForegroundColor Green
    } else {
        Write-Host "  WARNING - Port 3000 (Frontend) is FREE (frontend may not be running)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  INFO - Could not check port status" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  OVERALL: ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Your MarketAI Suite is ready!" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
} else {
    Write-Host "  OVERALL: SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Check the errors above and fix them" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
