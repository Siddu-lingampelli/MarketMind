Write-Host ""
Write-Host "MarketAI Suite - Status Check" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "BACKEND:" -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "  Dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "  Dependencies: MISSING" -ForegroundColor Red
}

if (Test-Path "backend\.env") {
    Write-Host "  Config: PRESENT" -ForegroundColor Green
} else {
    Write-Host "  Config: MISSING" -ForegroundColor Red
}

$backendPort = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "  Status: RUNNING on port 5000" -ForegroundColor Green
} else {
    Write-Host "  Status: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""

# Check Frontend
Write-Host "FRONTEND:" -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  Dependencies: INSTALLED" -ForegroundColor Green
} else {
    Write-Host "  Dependencies: MISSING" -ForegroundColor Red
}

$frontendPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "  Status: RUNNING on port 3000" -ForegroundColor Green
} else {
    Write-Host "  Status: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""

# File Check
Write-Host "FILES:" -ForegroundColor Yellow
$coreFiles = @(
    "backend\server.js",
    "backend\services\groqService.js",
    "frontend\src\App.js",
    "frontend\src\pages\Campaign.js",
    "frontend\src\pages\SalesPitch.js",
    "frontend\src\pages\LeadScoring.js"
)

$allPresent = $true
foreach ($file in $coreFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "  Missing: $file" -ForegroundColor Red
        $allPresent = $false
    }
}

if ($allPresent) {
    Write-Host "  All core files: PRESENT" -ForegroundColor Green
}

Write-Host ""
Write-Host "ACCESS:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
