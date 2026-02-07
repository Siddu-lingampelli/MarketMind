Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  MarketAI Suite - System Check" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  Node.js: NOT INSTALLED" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm -v
    Write-Host "  npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "  npm: NOT INSTALLED" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
if (Get-Command mongod -ErrorAction SilentlyContinue) {
    Write-Host "  MongoDB: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "  MongoDB: NOT INSTALLED (optional for local dev)" -ForegroundColor Yellow
}

# Check backend dependencies
Write-Host "Checking Backend..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "  Dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "  Dependencies: NOT INSTALLED" -ForegroundColor Red
}

if (Test-Path "backend\.env") {
    Write-Host "  .env file: EXISTS" -ForegroundColor Green
    
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "GROQ_API_KEY=your_groq_api_key_here") {
        Write-Host "  GROQ_API_KEY: NOT SET (needs configuration)" -ForegroundColor Red
    } else {
        Write-Host "  GROQ_API_KEY: CONFIGURED" -ForegroundColor Green
    }
} else {
    Write-Host "  .env file: MISSING" -ForegroundColor Red
}

# Check frontend dependencies
Write-Host "Checking Frontend..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  Dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "  Dependencies: NOT INSTALLED" -ForegroundColor Red
}

if (Test-Path "frontend\.env") {
    Write-Host "  .env file: EXISTS" -ForegroundColor Green
} else {
    Write-Host "  .env file: MISSING" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Testing Backend Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  Backend Status: RUNNING" -ForegroundColor Green
    Write-Host "  Response: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  Backend Status: NOT RUNNING" -ForegroundColor Red
    Write-Host "  Run: .\start-backend.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "Quick Fixes:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Set GROQ API Key:" -ForegroundColor White
Write-Host "   - Edit: backend\.env" -ForegroundColor Gray
Write-Host "   - Replace 'your_groq_api_key_here' with your actual key" -ForegroundColor Gray
Write-Host "   - Get key from: https://console.groq.com/" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Start Backend:" -ForegroundColor White
Write-Host "   .\start-backend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Frontend (new terminal):" -ForegroundColor White
Write-Host "   .\start-frontend.ps1" -ForegroundColor Gray
Write-Host ""
