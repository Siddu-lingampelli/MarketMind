# Quick Start Commands

## Development

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm start
```

### Start Both (Alternative - requires concurrently)
```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

## Installation

### Install All Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### One-liner installation
```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

## Database

### Start MongoDB (Local)
```bash
mongod
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

## Environment Setup

### Backend .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketai-suite
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Get Groq API Key

1. Visit: https://console.groq.com/
2. Sign up or log in
3. Go to API Keys section
4. Create new key
5. Copy and paste into backend/.env

## Testing

### Test Backend API
```bash
curl http://localhost:5000/health
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running: `mongod`
- Verify connection string in .env

**Port Already in Use:**
- Change PORT in backend/.env
- Update REACT_APP_API_URL in frontend/.env

**Groq API Error:**
- Verify API key is correct
- Check API key has credits
- Visit https://console.groq.com/

**CORS Error:**
- Verify FRONTEND_URL in backend/.env
- Check backend is running

## Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel
```

### Render (Backend)
1. Connect GitHub repo
2. Add environment variables
3. Deploy

## Support

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- API Docs: See API_DOCS.md
- Setup Guide: See SETUP.md
