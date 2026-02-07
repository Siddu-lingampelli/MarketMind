#!/bin/bash

echo "🚀 Setting up MarketAI Suite..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm -v)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your Groq API key"
fi

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add your Groq API key to backend/.env"
echo "2. Start MongoDB (if using local): mongod"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "📚 Check SETUP.md for detailed instructions"
