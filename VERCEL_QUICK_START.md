# Vercel Deployment Quick Reference

## 🚀 Deploy in 5 Minutes

### 1. MongoDB Setup (2 min)
```
1. Sign up: https://mongodb.com/cloud/atlas
2. Create M0 cluster (free)
3. Network Access → Allow 0.0.0.0/0
4. Create user: finance_tracker / [password]
5. Copy connection string
```

### 2. Push to GitHub (1 min)
```bash
git init
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 3. Deploy on Vercel (1 min)
```
1. https://vercel.com/import
2. Select GitHub repo
3. Add environment variables:
   - MONGODB_URI: [from MongoDB]
   - JWT_SECRET: [random 32+ chars]
   - FRONTEND_URL: https://PROJECT.vercel.app
   - NODE_ENV: production
4. Deploy!
```

### 4. Verify (1 min)
```
✓ https://PROJECT.vercel.app loads
✓ https://PROJECT.vercel.app/api/health returns success
✓ Login works in UI
✓ Data saves (check MongoDB)
```

---

## 📝 Environment Variables

| Variable | Example | Where to Get |
|----------|---------|--------------|
| MONGODB_URI | mongodb+srv://user:pass@cluster.mongodb.net/db | MongoDB Atlas |
| JWT_SECRET | a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 | Generate random |
| FRONTEND_URL | https://finance-tracker-123.vercel.app | Your Vercel URL |
| NODE_ENV | production | Set to production |

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| MongoDB Atlas | https://mongodb.com/cloud/atlas |
| Your App | https://[PROJECT].vercel.app |
| Health Check | https://[PROJECT].vercel.app/api/health |
| API Test | https://[PROJECT].vercel.app/api/auth/login (POST) |

---

## ❌ If It Doesn't Work

```
1. Check Vercel logs: Deployments → Show logs
2. Verify MongoDB connection: ping cluster in Atlas
3. Check env variables: Settings → Environment Variables
4. Redeploy: git push origin main
5. Clear browser cache: Ctrl+Shift+Delete
6. Check console: F12 → Console tab
```

---

## 📊 Architecture

```
Frontend (index.html, js/, css/)
        ↓ (API calls to /api/*)
        ↓
api/index.js (Vercel Serverless)
        ↓ (MongoDB driver)
        ↓
MongoDB Atlas (Data storage)
```

---

## ✅ Success Indicators

- ✅ App loads without errors
- ✅ /api/health returns JSON
- ✅ Login page works
- ✅ Can create account
- ✅ Data persists after refresh
- ✅ No CORS errors in console

---

**Need detailed help?** See: `VERCEL_DEPLOYMENT_GUIDE.md`
