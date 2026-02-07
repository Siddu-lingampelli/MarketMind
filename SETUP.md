# MarketAI Suite - Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/marketai-suite
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔑 Getting API Keys

### Groq API Key
1. Visit https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and add to backend `.env` file

### MongoDB Setup (Optional - for production)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Replace MONGODB_URI in backend `.env`

## 📦 Project Structure

```
MarketMind/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Groq AI service
│   ├── .env             # Environment variables
│   ├── package.json     # Dependencies
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.js       # Main app component
    │   └── index.js     # Entry point
    ├── .env             # Environment variables
    └── package.json     # Dependencies
```

## 🧪 Testing the Application

1. **Register a new account**
   - Go to http://localhost:3000/register
   - Create an account with email and password

2. **Login**
   - Use your credentials to log in
   - You'll be redirected to the dashboard

3. **Test Campaign Generator**
   - Click "Campaign Generator"
   - Fill in product, audience, and platform
   - Click "Generate Campaign"

4. **Test Sales Pitch Generator**
   - Click "Sales Pitch Generator"
   - Fill in product and persona details
   - Click "Generate Sales Pitch"

5. **Test Lead Scoring**
   - Click "Lead Scoring"
   - Enter lead information
   - Click "Score Lead"

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

Or connect your GitHub repository to Vercel dashboard.

**Environment Variables in Vercel:**
- `REACT_APP_API_URL` = Your backend API URL

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Random secure string
   - `GROQ_API_KEY` = Your Groq API key
   - `FRONTEND_URL` = Your Vercel frontend URL

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Add database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Update in Render environment variables

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Campaign Generator
- `POST /api/campaign/generate` - Generate campaign
- `GET /api/campaign/history` - Get user's campaigns
- `GET /api/campaign/:id` - Get campaign by ID

### Sales Pitch
- `POST /api/pitch/generate` - Generate pitch
- `GET /api/pitch/history` - Get user's pitches
- `GET /api/pitch/:id` - Get pitch by ID

### Lead Scoring
- `POST /api/lead/score` - Score lead
- `GET /api/lead/history` - Get user's leads
- `GET /api/lead/stats` - Get lead statistics
- `GET /api/lead/:id` - Get lead by ID

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running (local) or connection string is correct (Atlas)
- Verify all environment variables are set
- Check Groq API key is valid

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check REACT_APP_API_URL in frontend .env
- Enable CORS in backend (already configured)

### AI generation fails
- Check Groq API key is valid
- Verify API key has sufficient credits
- Check network connection

## 📚 Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **AI**: Groq API (LLaMA 3.3 70B)
- **Authentication**: JWT, bcrypt
- **Deployment**: Vercel (Frontend), Render (Backend)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check Groq API documentation: https://console.groq.com/docs

---

Built with ❤️ for the MarketAI Suite
