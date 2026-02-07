Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  MarketAI Suite - Installation Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installation Summary:" -ForegroundColor Yellow
Write-Host "  Backend dependencies installed" -ForegroundColor Green
Write-Host "  Frontend dependencies installed" -ForegroundColor Green
Write-Host "  Environment files created" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add your Groq API key:" -ForegroundColor White
Write-Host "   Edit: backend\.env" -ForegroundColor Gray
Write-Host "   Set: GROQ_API_KEY=your_api_key_here" -ForegroundColor Gray
Write-Host "   Get key from: https://console.groq.com/" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Start MongoDB:" -ForegroundColor White
Write-Host "   mongod" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Backend (in this terminal):" -ForegroundColor White
Write-Host "   .\start-backend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start Frontend (in new terminal):" -ForegroundColor White
Write-Host "   .\start-frontend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Blue
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  Quick Start: QUICKSTART.md" -ForegroundColor White
Write-Host "  Setup Guide: SETUP.md" -ForegroundColor White
Write-Host "  API Docs:    API_DOCS.md" -ForegroundColor White
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
