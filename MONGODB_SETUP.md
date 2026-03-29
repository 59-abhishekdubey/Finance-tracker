# 🗄️ MongoDB Setup Guide

Your backend needs MongoDB to work. Choose the option that best fits you.

---

## ☁️ **Option 1: MongoDB Atlas (Cloud) - FASTEST & EASIEST** ⭐

No installation needed. Perfect for development and testing.

### Step-by-Step:

#### 1. Create Free Account
- Visit: https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email or Google
- Verify your email

#### 2. Create a Cluster
1. After login, click "+ Create"
2. Select the **Free** tier (M0)
3. Choose your region (closest to you)
4. Click "Create Deployment"
5. Wait 3-5 minutes...

#### 3. Get Connection String
1. Click the green "Connect" button
2. Choose "Connect your application"
3. Select **Node.js** driver version **4.1 or later**
4. Copy the entire connection string

It will look like:
```
mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 4. ⚠️ **CRITICAL: Whitelist Your IP Address** (REQUIRED!)

**IMPORTANT:** Before connecting, you MUST add your IP to MongoDB Atlas's security whitelist!

1. In MongoDB Atlas dashboard, go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. **Recommended for Development:** Enter `0.0.0.0/0` (allows all IPs)
4. Click **"Confirm"** and wait 1-2 minutes for it to apply
5. Now your app can connect!

**⚠️ If you keep getting "Could not connect to any servers" error:**
- [ ] Did you whitelist your IP?
- [ ] Did you wait 2 minutes after adding it?
- [ ] Restart your server: `npm start`

**See [MONGODB_IP_WHITELIST_GUIDE.md](MONGODB_IP_WHITELIST_GUIDE.md) for permanent solutions if you have dynamic IP!**

#### 5. Update Your `.env` File

Replace the `MONGODB_URI` line:

```env
MONGODB_URI=mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

**Important:** 
- Replace `yourname` with your Atlas username
- Replace `yourpassword` with your Atlas password
- Add `/finance-tracker` at the end (before the `?`)

#### 6. Create Database & Collection (Optional)
In MongoDB Atlas dashboard:
1. Click "Browse Collections"
2. Click "Create Database"
3. Name: `finance-tracker`
4. Click "Create"

#### 7. Test the Connection
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database: finance-tracker
```

**✅ Done! You're connected to cloud MongoDB.**

---

## 📦 **Option 2: MongoDB Local Installation** (More Control)

Good if you want MongoDB on your machine.

### Windows Installation:

#### Step 1: Download
Go to: https://www.mongodb.com/try/download/community

Download the **Windows .msi installer**

#### Step 2: Run Installer
1. Double-click the `.msi` file
2. Accept license agreement
3. Choose "Custom" installation
4. Click "Install"
5. MongoDB will install and start automatically

#### Step 3: Verify Installation
Open Command Prompt:
```bash
mongod --version
```

Should show version number like `db version v6.0.0`

#### Step 4: Start MongoDB Service

**Windows:**
- Open "Services" app
- Find "MongoDB Server"
- Right-click → "Start"

Or create a batch file to start mongod:
```batch
@echo off
cd "C:\Program Files\MongoDB\Server\6.0\bin"
mongod.exe
```

#### Step 5: Start Your Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: finance-tracker
```

**✅ Done! MongoDB is running locally.**

---

## 📊 **Verify Your Database is Working**

### Using MongoDB Compass (GUI)

#### Atlas:
1. In MongoDB Atlas, click "Collections"
2. You'll see your database & collections

#### Local:
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. You'll see your local databases

---

## 🆘 **Troubleshooting**

| Problem | Solution |
|---------|----------|
| **Atlas won't load cluster** | Wait 5-10 minutes, refresh page |
| **Auth failed (403)** | Check username/password in connection string |
| **Connection timeout** | Check internet, whitelist your IP in Atlas |
| **Local MongoDB port 27017 already in use** | Change port in `.env`: `mongodb://localhost:27018/...` |
| **mongod command not found** | MongoDB not installed. Install it or use Atlas |

---

## 🔄 **How to Switch Between Local & Atlas**

Just change the `MONGODB_URI` in your `.env`:

#### To Local:
```env
MONGODB_URI=mongodb://localhost:27017/finance-tracker
```

#### To Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

No code changes needed!

---

## ✅ **Quick Start Commands**

### Atlas (Cloud) - Just set `.env` and run:
```bash
npm run dev
```

### Local - Start MongoDB first:
```bash
mongod
```

Then in another terminal:
```bash
npm run dev
```

---

## 🎯 **Recommendation**

**For Development:** Use **MongoDB Atlas** (No setup, always available)  
**For Production:** Use **MongoDB Atlas** with proper backups  
**For Testing:** Use **Local MongoDB** (faster, no network dependency)

---

**Pick one above and let me know if you hit any issues! ✨**
