# Write-Host "🚀 Setting up MarketAI Suite..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Node.js is installed: $(node -v)" -ForegroundColor Green

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ npm is installed: $(npm -v)" -ForegroundColor Green

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file already created. Please add your Groq API key" -ForegroundColor Yellow
}

Set-Location ..

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file already created" -ForegroundColor Yellow
}

Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your Groq API key to backend\.env"
Write-Host "2. Start MongoDB (if using local): mongod"
Write-Host "3. Start backend: cd backend; npm run dev"
Write-Host "4. Start frontend (new terminal): cd frontend; npm start"
Write-Host "`nFrontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nCheck SETUP.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
pause
