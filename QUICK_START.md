# ⚡ Quick Start - Finance Tracker Backend

## 🏃 Get Running in 5 Minutes

### 1️⃣ Check Prerequisites
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
```

### 2️⃣ Install Dependencies (Already Done, But Just In Case)
```bash
npm install
```

### 3️⃣ Setup MongoDB

**Option A: Local MongoDB**
- Download: https://www.mongodb.com/try/download/community
- Install & Start it
- MongoDB will be at: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Go to: https://www.mongodb.com/cloud/atlas
- Create account & cluster (free tier)
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 4️⃣ Update .env File
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=change-this-to-random-string-in-production
FRONTEND_URL=http://127.0.0.1:5501
```

### 5️⃣ Start Server
```bash
npm run dev
```

✅ See green checkmarks? You're running!

---

## 🧪 Test Immediately

### Via Terminal (curl)

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "password": "Test@123"
  }'
```

Copy the `token` from response.

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "Test@123"
  }'
```

**Get Transactions** (replace TOKEN):
```bash
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer TOKEN"
```

---

### Via Thunder Client / Postman

1. Open Thunder Client in VS Code
2. Click "+" for new request
3. Set: `POST` → `http://localhost:5000/api/auth/register`
4. Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123"
}
```
5. Send → You'll get a token
6. Copy the token
7. Create new request: `GET` → `http://localhost:5000/api/transactions`
8. Header: `Authorization: Bearer YOUR_TOKEN`
9. Send → See empty array `[]`

---

## 📊 What's Running

```
API Base: http://localhost:5000
Database: MongoDB (local or Atlas)
JWT Secret: Configured ✓
Frontend: Not needed for API testing

Endpoints:
✓ POST   /api/auth/register
✓ POST   /api/auth/login
✓ GET    /api/transactions
✓ POST   /api/transactions
✓ PUT    /api/transactions/:id
✓ DELETE /api/transactions/:id
✓ GET    /api/budget
✓ POST   /api/budget
✓ POST   /api/ai/chat (with OpenAI key)
```

---

## 🔗 Frontend Integration

Your frontend is already set up! 

When you:
1. ✅ Open `index.html`
2. ✅ Click "Register"
3. ✅ Fill form & submit

It will:
- Call `/api/auth/register`
- Store token in localStorage
- Load dashboard from backend

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` | MongoDB not running. Start it! |
| `Port 5000 in use` | Kill other process or change PORT in .env |
| `Cannot find module` | Run `npm install` again |
| `CORS error` | Check FRONTEND_URL in .env |
| `Invalid token` | Login again, token might be expired |

---

## 📚 Complete Docs

Full documentation: **BACKEND_COMPLETE.md**

---

## ✅ Success Criteria

- [ ] `npm run dev` shows server running
- [ ] MongoDB connects (see "✅ MongoDB Connected")
- [ ] Can register user (get token back)
- [ ] Can login (get new token)
- [ ] Can create transaction (with token)
- [ ] Can view transactions (with token)

**If all checked: You're ready to build! 🚀**

---

## 🎯 Next

1. Test all endpoints
2. Run frontend
3. Register account
4. Create transactions
5. Check they appear in database

**Questions?** Check BACKEND_COMPLETE.md

**GitHub:** https://github.com/59-abhishekdubey/Finance-tracker
