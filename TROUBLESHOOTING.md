# 🚨 TROUBLESHOOTING GUIDE

## Main Issue Found: Groq API Key Not Configured

### ✅ QUICK FIX (3 Steps):

#### Step 1: Get Your Groq API Key

1. Visit: **https://console.groq.com/**
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create API Key"
5. Copy the key (it looks like: `gsk_...`)

#### Step 2: Add the Key to Your Project

1. Open the file: `backend\.env`
2. Find the line: `GROQ_API_KEY=your_groq_api_key_here`
3. Replace with: `GROQ_API_KEY=gsk_your_actual_key_here`
4. Save the file

#### Step 3: Start the Application

**Terminal 1 (Backend):**
```powershell
.\start-backend.ps1
```

**Terminal 2 (Frontend):**
```powershell
.\start-frontend.ps1
```

**Then open:** http://localhost:3000

---

## Common Issues & Solutions

### Issue: "MongoDB connection failed"

**Solution 1 (Use MongoDB Atlas - Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend\.env`

**Solution 2 (Install MongoDB locally):**
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Run `mongod` in terminal
4. Keep it running

**Solution 3 (Skip for now):**
- The app will show connection errors but authentication won't work
- You need MongoDB to register/login users

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Kill the process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Issue: "Port 5000 already in use"

**Solution:**
```powershell
# Kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Issue: Frontend shows "Network Error" or "Cannot connect to server"

**Check:**
1. Backend is running on http://localhost:5000
2. Check terminal for backend errors
3. Test: http://localhost:5000/health (should show "OK")

**Fix:**
```powershell
# Restart backend
.\start-backend.ps1
```

### Issue: AI generation returns errors

**Possible causes:**
1. **No Groq API key** → Add key to `backend\.env`
2. **Invalid API key** → Check key at https://console.groq.com/
3. **No API credits** → Check your Groq account
4. **Backend not running** → Run `.\start-backend.ps1`

### Issue: Cannot register/login

**Cause:** MongoDB not running or not connected

**Fix:**
1. Start MongoDB (see MongoDB solutions above)
2. Or use MongoDB Atlas (cloud - free tier)
3. Check `MONGODB_URI` in `backend\.env`

---

## Verification Steps

### 1. Check Backend is Running
Visit: http://localhost:5000/health

Should see:
```json
{
  "status": "OK",
  "message": "MarketAI Suite API is running",
  "timestamp": "..."
}
```

### 2. Check Frontend is Running
Visit: http://localhost:3000

Should see: Login/Register page

### 3. Check All Services Status
Run:
```powershell
.\diagnose.ps1
```

---

## Quick Command Reference

```powershell
# Check system
.\diagnose.ps1

# Start backend
.\start-backend.ps1

# Start frontend (new terminal)
.\start-frontend.ps1

# Install dependencies (if needed)
cd backend
npm install
cd ../frontend
npm install
```

---

## Still Not Working?

1. **Check Node.js version:**
   ```powershell
   node -v  # Should be v16 or higher
   ```

2. **Clear and reinstall:**
   ```powershell
   # Backend
   cd backend
   Remove-Item node_modules -Recurse -Force
   npm install
   
   # Frontend
   cd ../frontend
   Remove-Item node_modules -Recurse -Force
   npm install
   ```

3. **Check all environment variables in `backend\.env`:**
   - `PORT=5000`
   - `MONGODB_URI=` (your connection string)
   - `JWT_SECRET=` (any random string)
   - `GROQ_API_KEY=` (your actual Groq key)
   - `FRONTEND_URL=http://localhost:3000`

4. **Test API manually:**
   ```powershell
   # Test health endpoint
   curl http://localhost:5000/health
   ```

---

## Contact & Resources

- **Groq Console:** https://console.groq.com/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **API Documentation:** See `API_DOCS.md`
- **Setup Guide:** See `SETUP.md`
