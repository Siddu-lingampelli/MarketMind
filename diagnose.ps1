Write-Host "MarketAI Suite - Quick Diagnostic" -ForegroundColor Cyan
Write-Host ""

# 1. Check Groq API Key
Write-Host "1. Checking Groq API Key..." -ForegroundColor Yellow
$envContent = Get-Content "backend\.env" -Raw
if ($envContent -match "GROQ_API_KEY=your_groq_api_key_here") {
    Write-Host "   ERROR: Groq API key not configured!" -ForegroundColor Red
    Write-Host "   Fix: Edit backend\.env and add your Groq API key" -ForegroundColor Yellow
    Write-Host "   Get key: https://console.groq.com/" -ForegroundColor Blue
    $needsKey = $true
} else {
    Write-Host "   OK: Groq API key is configured" -ForegroundColor Green
    $needsKey = $false
}
Write-Host ""

# 2. Check Dependencies
Write-Host "2. Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "   OK: Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Backend dependencies missing" -ForegroundColor Red
    Write-Host "   Fix: cd backend && npm install" -ForegroundColor Yellow
}

if (Test-Path "frontend\node_modules") {
    Write-Host "   OK: Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Frontend dependencies missing" -ForegroundColor Red
    Write-Host "   Fix: cd frontend && npm install" -ForegroundColor Yellow
}
Write-Host ""

# 3. Show how to start
Write-Host "3. To Start the Application:" -ForegroundColor Yellow
if ($needsKey) {
    Write-Host "   Step 1: Add your Groq API key to backend\.env" -ForegroundColor Red
    Write-Host "   Step 2: .\start-backend.ps1" -ForegroundColor White
    Write-Host "   Step 3: .\start-frontend.ps1 (in new terminal)" -ForegroundColor White
} else {
    Write-Host "   Terminal 1: .\start-backend.ps1" -ForegroundColor White
    Write-Host "   Terminal 2: .\start-frontend.ps1" -ForegroundColor White
}
Write-Host ""
Write-Host "Note: MongoDB is optional for testing (will use connection error)" -ForegroundColor Gray
Write-Host ""
