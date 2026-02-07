Write-Host "Starting MarketAI Suite Frontend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend running on: http://localhost:3000" -ForegroundColor Green
Write-Host "Make sure backend is running on: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

Set-Location frontend
npm start
