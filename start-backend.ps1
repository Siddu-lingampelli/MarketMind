Write-Host "Starting MarketAI Suite Backend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend running on: http://localhost:5000" -ForegroundColor Green
Write-Host "API Health check: http://localhost:5000/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure to:" -ForegroundColor Yellow
Write-Host "1. MongoDB is running (mongod)" -ForegroundColor White
Write-Host "2. GROQ_API_KEY is set in backend\.env" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

Set-Location backend
npm run dev
