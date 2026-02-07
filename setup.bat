@echo off
echo 🚀 Setting up MarketAI Suite...

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node -v

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed
npm -v

:: Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

:: Check if .env exists
if not exist .env (
    echo ⚠️  .env file already exists. Please make sure to add your Groq API key
)

cd ..

:: Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

:: Check if .env exists
if not exist .env (
    echo ⚠️  .env file already exists
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Add your Groq API key to backend\.env
echo 2. Start MongoDB (if using local): mongod
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 📚 Check SETUP.md for detailed instructions
echo.
pause
