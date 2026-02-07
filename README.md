# MarketAI Suite

**AI-Powered Sales & Marketing Intelligence Platform**

MarketAI Suite is a unified AI-powered platform that generates marketing campaigns, creates personalized sales pitches, and scores leads intelligently - all powered by real-time AI reasoning using Groq + LLaMA 3.3 70B.

## 🚀 Features

- **AI Marketing Campaign Generator**: Generate complete marketing strategies with content ideas, ad copy, and CTAs
- **Intelligent Sales Pitch Generator**: Create personalized sales pitches tailored to customer personas
- **AI Lead Scoring System**: Quantify lead quality with explainable AI reasoning

## 🛠 Tech Stack

- **Frontend**: React.js, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Engine**: Groq API (LLaMA 3.3 70B)
- **Authentication**: JWT-based Auth

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Groq API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret key
- Groq API key

5. Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## 🔑 Getting a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to backend `.env` file

## 📁 Project Structure

```
MarketMind/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing with bcrypt
- Environment variable protection
- HTTPS enforcement in production
- Rate limiting on API endpoints
- Helmet.js security headers

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### Backend (Render/AWS)

1. Push code to GitHub
2. Create new web service on Render
3. Configure environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Configure network access
3. Get connection string
4. Update backend `.env`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Campaign Generator
- `POST /api/campaign/generate` - Generate marketing campaign

### Sales Pitch
- `POST /api/pitch/generate` - Generate sales pitch

### Lead Scoring
- `POST /api/lead/score` - Score and qualify lead

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@marketai-suite.com or open an issue.

---

Built with ❤️ using Groq AI and LLaMA 3.3 70B
