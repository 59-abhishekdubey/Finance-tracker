# 🚀 Finance Tracker Backend Setup Guide

## **📋 Overview**

This document provides step-by-step instructions to set up and run the Finance Tracker backend server with AI integration.

---

## **🔧 STEP 1: Install Dependencies**

### Prerequisites
- **Node.js**: v14 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **API Keys**: OpenAI and/or Anthropic Claude (optional, for AI features)

### Installation

```bash
# Navigate to project directory
cd "Finance Tracker"

# Install all dependencies
npm install
```

**Expected output:**
```
added XX packages in Xs
```

---

## **🔐 STEP 2: Configure API Keys**

### Get Your API Keys

#### **OpenAI** (GPT-3.5-Turbo)
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Create new API key
4. Copy the key (format: `sk-...`)

#### **Anthropic Claude** (Optional)
1. Go to: https://console.anthropic.com/
2. Create account
3. Generate API key
4. Copy the key (format: `sk-ant-...`)

### Update `.env` File

Open the `.env` file in your project root and add your keys:

```env
# OPENAI KEY
OPENAI_API_KEY=sk-your-actual-key-here

# ANTHROPIC KEY
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

PORT=3000
NODE_ENV=development
```

⚠️ **SECURITY WARNING:**
- Never commit `.env` to Git (already in `.gitignore`)
- Never share API keys publicly
- Regenerate keys if exposed

---

## **🚀 STEP 3: Start the Backend Server**

### Development Mode (Auto-restart on changes)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
============================================================
🚀 Finance Tracker Backend Server Started
============================================================
📍 Server: http://localhost:3000
🔍 Health Check: http://localhost:3000/api/health
💬 AI Chat Endpoint: POST http://localhost:3000/api/ai/chat
============================================================

🔐 API Key Status:
  ✅ OpenAI:    ✓ Configured
  ✅ Anthropic: ✓ Configured
```

---

## **✅ STEP 4: Test the Backend**

### Option 1: Browser (Health Check)
Open in your browser:
```
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Finance Tracker API running",
  "timestamp": "2026-03-28T10:30:00.000Z"
}
```

### Option 2: Using cURL (Test AI Chat)

**OpenAI Test:**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a financial advisor."},
      {"role": "user", "content": "How do I budget my income?"}
    ],
    "provider": "openai"
  }'
```

**Claude Test:**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a financial advisor."},
      {"role": "user", "content": "What is compound interest?"}
    ],
    "provider": "anthropic"
  }'
```

Expected response:
```json
{
  "success": true,
  "provider": "openai",
  "message": "Here's how to budget your income..."
}
```

---

## **🌐 STEP 5: Frontend Configuration**

The frontend automatically connects to the backend at:
```
http://localhost:3000/api/ai/chat
```

Open `index.html` in your browser after starting the server:
```
http://localhost:3000
```

✅ The AI Advisor will now use your backend!

---

## **🔄 How It Works**

### Architecture Diagram
```
┌─────────────────────────────────────┐
│   Frontend (index.html)             │
│   - Dashboard                       │
│   - Analytics                       │
│   - AI Chat Interface               │
└──────────────┬──────────────────────┘
               │ HTTP POST
               │ /api/ai/chat
               ↓
┌─────────────────────────────────────┐
│   Backend Server (server.js)        │
│   - Express.js                      │
│   - CORS enabled                    │
│   - API key management              │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ↓                 ↓
┌──────────────┐  ┌─────────────────┐
│   OpenAI API │  │ Anthropic API   │
│ GPT-3.5      │  │ Claude-3-Haiku  │
└──────────────┘  └─────────────────┘
```

### Request Flow

1. **User** types message in AI Advisor
2. **Frontend** sends POST request to `http://localhost:3000/api/ai/chat`
3. **Backend** receives request with messages and provider
4. **Backend** securely adds API key (stored in `.env`)
5. **Backend** calls OpenAI/Anthropic API
6. **API Response** is sent back to frontend
7. **Frontend** displays AI response to user

---

## **📝 API Endpoints**

### Health Check
```
GET /api/health
Response:
{
  "status": "OK",
  "message": "Finance Tracker API running",
  "timestamp": "ISO timestamp"
}
```

### AI Chat
```
POST /api/ai/chat
Content-Type: application/json

Request Body:
{
  "messages": [
    {"role": "system", "content": "You are a financial advisor..."},
    {"role": "user", "content": "User's question here..."}
  ],
  "provider": "openai" // or "anthropic"
}

Response:
{
  "success": true,
  "provider": "openai",
  "message": "AI's response here..."
}
```

---

## **🐛 Troubleshooting**

### Problem: "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux:
lsof -i :3000
kill -9 [PID]

# Or use different port:
PORT=3001 npm start
```

### Problem: "API key not found"
- Ensure `.env` file exists in project root
- Check API key format (OpenAI: `sk-...`, Anthropic: `sk-ant-...`)
- Verify `.env` file has correct structure

### Problem: "CORS error in frontend"
- Confirm backend is running on `http://localhost:3000`
- Check frontend code is calling correct URL
- Backend automatically enables CORS

### Problem: "OpenAI/Claude API Error"
- Verify API key is correct
- Check account has available credits
- Ensure API key has not expired
- Check API status at their dashboards

---

## **🚀 Deploy to Production**

### Option 1: Railway.app
```bash
# Install railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render.com
1. Create account at https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Set environment variables (add `.env` values)
5. Deploy

### Option 3: Heroku
```bash
heroku login
heroku create finance-tracker-api
git push heroku main
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
```

---

## **📊 Environment Variables Reference**

```env
# Required for all installations
PORT=3000
NODE_ENV=development

# Optional - AI Features
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Future - Database
MONGODB_URI=mongodb+srv://...
DB_NAME=finance_tracker

# Future - Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

---

## **✨ Features Now Available**

- ✅ Real AI advisor using OpenAI GPT-3.5
- ✅ Alternative AI using Anthropic Claude
- ✅ Secure API key management
- ✅ CORS-enabled backend
- ✅ Error handling and logging
- ✅ Conversation history support
- ✅ Financial context awareness

---

## **📞 Support**

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review backend logs (check console output)
3. Verify API keys are correct
4. Test endpoints with cURL commands above

---

## **🎉 You're All Set!**

Your Finance Tracker is now fully configured with a working backend! 🚀

**Next steps:**
1. Open `http://localhost:3000` in browser
2. Login/Register
3. Test AI Advisor by clicking the "💬 AI Advisor" menu
4. Ask questions about your finances!

Happy tracking! 💰📊
