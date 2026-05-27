# Vercel Deployment Guide - Finance Tracker

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

1. **GitHub Account** - Vercel integrates with GitHub
   - Push your project to GitHub
   - Run: `git init && git add . && git commit -m "Initial commit"`

2. **Vercel Account** - Free tier available
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

3. **MongoDB Atlas Account** - Free cluster available
   - Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Get connection string

4. **Node.js Compatibility**
   - Project requires Node.js 14+
   - Vercel supports this by default

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare MongoDB Atlas

```
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Create a new cluster:
   - Choose M0 (Free tier)
   - Select region closest to your users
   - Create cluster (takes 1-2 minutes)

3. Setup network access:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

4. Create database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: finance_tracker
   - Password: Generate strong password (store it!)
   - Built-in Role: Atlas admin
   - Click "Create User"

5. Get connection string:
   - Click "Databases" → "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace <username> and <password>
   - Replace <database> with "finance-tracker"
   
   Final format:
   mongodb+srv://finance_tracker:PASSWORD@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial Finance Tracker commit - ready for Vercel"

# Create new repository on GitHub
# Go to https://github.com/new
# Name: Finance-Tracker
# Choose Private or Public

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/Finance-Tracker.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

```
1. Go to Vercel: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from Git:
   - Select your GitHub repository (Finance-Tracker)
   - Click "Import"

4. Configure project:
   - Framework Preset: "Other" (or "Node.js")
   - Root Directory: "./" (default)
   - Build Command: (leave as is or "npm install")
   - Output Directory: (leave empty)
   - Install Command: (leave as is)

5. Environment Variables:
   - Add these in the configuration screen:
   
   | Variable | Value |
   |----------|-------|
   | MONGODB_URI | (MongoDB connection string from Step 1) |
   | JWT_SECRET | (Generate random string, 32+ chars) |
   | FRONTEND_URL | https://your-project.vercel.app |
   | NODE_ENV | production |

   Click "Deploy"
```

### Step 4: Verify Deployment

```
Once deployment completes:

1. Check deployment URL: https://your-project.vercel.app
2. Test API health: https://your-project.vercel.app/api/health
   - Should return: { "success": true, "message": "Finance Tracker API is running" }

3. Test authentication:
   - Try login at the deployed URL
   - Check Network tab in DevTools → Inspect API calls
   - Should see /api/auth/login requests working
```

---

## 🔧 Environment Variables Reference

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
- MongoDB connection string
- Get from MongoDB Atlas

JWT_SECRET=your-random-secret-string-32-chars-or-more
- Used for JWT token generation
- Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

FRONTEND_URL=https://your-vercel-project.vercel.app
- Your Vercel deployment URL
- Needed for CORS

NODE_ENV=production
- Tells Express to run in production mode
```

### Optional Variables

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
- For AI Advisor feature
- Get from OpenAI API keys
- Currently not used by frontend (uses localStorage fallback)
```

---

## 🏗️ Project Architecture

### Frontend (Deployed to Vercel)
```
- HTML/CSS/JavaScript (vanilla)
- Uses localStorage for offline data persistence
- API client: /js/api.js (routes to /api/*)
- Static files served from root
```

### Backend (Vercel Serverless)
```
/api/index.js
├─ Wraps Express.js application
├─ Routes all /api/* requests
├─ Connects to MongoDB Atlas
└─ Handles authentication, transactions, budget, AI routes

MongoDB Atlas
├─ Users collection (authentication)
├─ Transactions collection (financial data)
├─ Budgets collection (budget data)
└─ Cloud-hosted, accessible from Vercel
```

### File Structure
```
Finance-Tracker/
├── api/
│   └── index.js (Serverless Express handler)
├── backend/
│   ├── config/
│   │   └── db.js (MongoDB connection)
│   ├── controllers/ (Request handlers)
│   ├── middleware/ (Auth middleware)
│   ├── models/ (MongoDB schemas)
│   └── routes/ (API endpoints)
├── js/ (Frontend JavaScript)
├── css/ (Frontend styling)
├── index.html (Main page)
├── package.json (Dependencies)
├── vercel.json (Vercel configuration)
└── .env.example (Environment template)
```

---

## 📊 API Endpoints

All endpoints require the `/api` prefix on Vercel:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budget
- `GET /api/budget` - Get budget data
- `POST /api/budget` - Create/update budget
- `PUT /api/budget/:id` - Update budget item

### AI Advisor
- `POST /api/ai/chat` - Send message to AI advisor
- `GET /api/ai/chat-history` - Get conversation history

---

## 🔐 Security Checklist

- ✅ Sensitive files deleted (my_api_key.txt, diagnostics.txt)
- ✅ node_modules and .vscode folders removed (reinstalled on Vercel)
- ✅ .env file added to .gitignore (never commit secrets)
- ✅ Environment variables configured in Vercel dashboard
- ✅ CORS configured for production domain
- ✅ MongoDB IP whitelist configured (0.0.0.0/0)
- ✅ JWT tokens used for authentication
- ✅ Passwords hashed with bcryptjs

### Additional Security Notes
- Never commit `.env` file to GitHub
- Rotate JWT_SECRET periodically
- Monitor MongoDB Atlas usage (free tier limits)
- Enable Vercel's Web Security features
- Review OAuth applications if using social login

---

## 🐛 Troubleshooting

### Issue: "MONGODB_URI not defined"
```
Solution:
1. Go to Vercel Project Settings → Environment Variables
2. Verify MONGODB_URI is set correctly
3. Redeploy: git push (triggers automatic redeploy)
```

### Issue: "Cannot find module '../backend/routes/auth'"
```
Solution:
1. Verify file structure matches (api/index.js can access ../backend/)
2. Check .gitignore doesn't exclude backend/
3. Redeploy and check build logs
```

### Issue: "CORS error" in browser console
```
Solution:
1. Verify FRONTEND_URL env variable matches your Vercel domain
2. Check browser console shows correct domain
3. Environment variables set? Redeploy: git push
```

### Issue: "MongoDB connection timeout"
```
Solution:
1. Verify MONGODB_URI connection string is correct
2. Check MongoDB IP whitelist includes 0.0.0.0/0
3. Test local: npm install && npm start
4. Check MongoDB Atlas cluster status (running?)
```

### Issue: "API returns 404"
```
Solution:
1. Verify API endpoint format: /api/auth/login (not /auth/login)
2. Check request method (POST vs GET)
3. Review Network tab in DevTools
4. Check Vercel deployment logs: Deployments → Show logs
```

---

## 📈 Monitoring & Logs

### View Deployment Logs
```
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. View build logs and errors
```

### Monitor API Usage
```
1. Vercel Dashboard → Project → Analytics
2. View request counts, response times
3. Monitor serverless function duration
```

### Monitor Database
```
1. MongoDB Atlas → Clusters → Monitoring
2. Check connection count
3. Monitor storage usage (free tier: 512 MB)
4. Review access logs for suspicious activity
```

---

## 🚦 Performance Tips

1. **Database Indexing**
   - MongoDB automatically indexes `_id`
   - Add indexes on `email` for faster lookups
   
2. **Connection Pooling**
   - Serverless: maxPoolSize = 2 (configured in api/index.js)
   - Preserves MongoDB free tier limits

3. **Caching Headers**
   - vercel.json configured for 1-year cache on static files
   - 0 cache on index.html (always fresh)

4. **Cold Start Optimization**
   - First request after deployment takes 2-5 seconds
   - Subsequent requests cached in memory
   - MongoDB connection persists between requests

---

## 🎯 Next Steps

1. ✅ Configure MongoDB Atlas (step-by-step guide provided)
2. ✅ Push code to GitHub
3. ✅ Deploy to Vercel (environment variables)
4. ✅ Test deployed application
5. ✅ Configure custom domain (optional, in Vercel settings)
6. ✅ Set up GitHub integration for automatic deployments

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **Mongoose Docs**: https://mongoosejs.com/

---

## ✨ Deployment Success Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Connection string generated and verified
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Environment variables configured:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] FRONTEND_URL
  - [ ] NODE_ENV=production
- [ ] Deployment completed successfully
- [ ] Health check passes: /api/health
- [ ] Login works on deployed site
- [ ] Data persists in MongoDB
- [ ] No console errors in browser DevTools
- [ ] API requests show /api/* paths
- [ ] CORS not blocking requests

---

## 🎉 You're Deployed!

Your Finance Tracker application is now live on Vercel with MongoDB backend!

**URL**: https://your-project.vercel.app

Share the link and start tracking finances! 📊💰
