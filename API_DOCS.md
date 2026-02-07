# MarketAI Suite - API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

## Campaign Generator

### Generate Campaign
**POST** `/campaign/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product": "AI-powered project management tool",
  "audience": "Tech startups and small businesses, 25-45 age group",
  "platform": "LinkedIn"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "campaign_id",
    "objective": "Drive awareness and trial sign-ups for AI project management",
    "contentIdeas": [
      "Behind-the-scenes: How AI optimizes team workflows",
      "Customer success story: 50% productivity increase",
      "Interactive poll: Biggest project management challenges",
      "Tutorial: Setting up your first AI-powered project",
      "Infographic: AI vs traditional project management"
    ],
    "adCopies": [
      "Transform your team's productivity with AI-powered insights...",
      "Say goodbye to missed deadlines. Our AI predicts bottlenecks...",
      "Join 10,000+ teams using AI to work smarter, not harder..."
    ],
    "ctas": [
      "Start Free Trial",
      "Watch Demo",
      "Get Started Today"
    ],
    "createdAt": "2026-02-06T10:30:00.000Z"
  }
}
```

### Get Campaign History
**GET** `/campaign/history`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "campaign_id",
      "product": "...",
      "audience": "...",
      "platform": "LinkedIn",
      "result": {
        "objective": "...",
        "contentIdeas": [...],
        "adCopies": [...],
        "ctas": [...]
      },
      "createdAt": "2026-02-06T10:30:00.000Z"
    }
  ]
}
```

---

## Sales Pitch Generator

### Generate Pitch
**POST** `/pitch/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productName": "CloudSync Pro",
  "persona": "IT Director at mid-size company, frustrated with data silos",
  "industry": "SaaS",
  "companySize": "51-200",
  "budgetRange": "$50K - $100K"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pitch_id",
    "elevatorPitch": "CloudSync Pro eliminates data silos by seamlessly connecting...",
    "valueProposition": "Our platform reduces integration time by 70%...",
    "differentiators": [
      "AI-powered data mapping reduces setup from weeks to hours",
      "99.99% uptime SLA with enterprise-grade security",
      "ROI positive within 3 months for most customers"
    ],
    "callToAction": "Schedule a personalized demo to see how we can eliminate your data silos",
    "createdAt": "2026-02-06T10:35:00.000Z"
  }
}
```

### Get Pitch History
**GET** `/pitch/history`

**Headers:** `Authorization: Bearer <token>`

---

## Lead Scoring

### Score Lead
**POST** `/lead/score`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Acme Corp",
  "budget": "Confirmed budget of $75K for Q1",
  "need": "Urgent need to consolidate marketing tools and reduce costs",
  "urgency": "Immediate (within 1 month)",
  "authority": "Speaking with CMO who has final decision-making power"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "lead_id",
    "name": "Acme Corp",
    "score": 92,
    "category": "Hot",
    "conversionProbability": 85,
    "explanation": "This is a highly qualified lead with confirmed budget, urgent timeline, and direct access to decision-maker. Strong product-need fit with clear ROI path.",
    "nextAction": "Schedule executive briefing within 48 hours. Prepare custom ROI analysis and implementation timeline.",
    "createdAt": "2026-02-06T10:40:00.000Z"
  }
}
```

### Get Lead History
**GET** `/lead/history`

**Headers:** `Authorization: Bearer <token>`

### Get Lead Statistics
**GET** `/lead/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "hot": 5,
    "warm": 10,
    "lukewarm": 7,
    "cold": 3,
    "averageScore": "68.5",
    "averageConversionProbability": "62.3"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "message": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to generate campaign",
  "stack": "..." // Only in development
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all `/api/` routes

---

## Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 7 days
- Groq AI responses typically complete in 2-5 seconds
- Maximum request payload size: 10MB
