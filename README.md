# 💰 Finance Tracker - Gen Z Edition

A modern, full-stack personal finance tracking application designed for Generation Z users. Track expenses, manage budgets, and get AI-powered financial advice with a production-ready backend!

## 🎯 Features

### Frontend
- ✅ **Interactive Dashboard**: Real-time spending overview with daily budget tracking
- ✅ **Budget Breakdown**: 50/30/20 budget allocation (Needs, Wants, Savings)
- ✅ **Transaction Management**: Easy expense logging with categories and dates
- ✅ **AI Finance Advisor**: Chat with intelligent finance assistant (OpenAI/Claude)
- ✅ **Mobile Optimized**: Fully responsive design for all devices
- ✅ **Dark Mode**: Eye-friendly interface with glassmorphism effects
- ✅ **User Authentication**: Secure registration and login system

### Backend
- ✅ **RESTful API**: 10+ endpoints for complete CRUD operations
- ✅ **MongoDB Database**: Persistent data storage with schemas
- ✅ **JWT Authentication**: Secure token-based session management
- ✅ **Password Security**: bcrypt hashing for password protection
- ✅ **AI Integration**: OpenAI/Claude support for financial advice
- ✅ **Error Handling**: Comprehensive error management
- ✅ **CORS Enabled**: Frontend-backend integration ready

---

## 📁 Complete Project Structure

```
finance-tracker/
│
├── 📄 README.md                              # Project documentation (YOU ARE HERE)
├── 📄 QUICK_START.md                         # 5-minute quick start guide
├── 📄 BACKEND_COMPLETE.md                    # Full backend API reference
├── 📄 MONGODB_SETUP.md                       # MongoDB installation guide
├── 📄 TEAM_PULL_REQUEST.md                   # Team integration guide
├── 📄 package.json                           # Node.js dependencies
├── 📄 .env                                   # Environment variables (SECRET - not in git)
├── 📄 .gitignore                             # Git ignore rules
├── 📄 server.js                              # Express server entry point
│
│
├── 🗂️  backend/                              # Backend folder
│   ├── 📁 config/
│   │   └── db.js                             # MongoDB connection setup
│   │
│   ├── 📁 models/                            # Mongoose schemas
│   │   ├── User.js                           # User schema (registration, password)
│   │   ├── Transaction.js                    # Transaction schema (income/expense)
│   │   └── Budget.js                         # Budget schema (allocations)
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                           # JWT verification middleware
│   │
│   ├── 📁 controllers/                       # Business logic
│   │   ├── authController.js                 # Register, login, get user
│   │   ├── transactionController.js          # CRUD for transactions
│   │   ├── budgetController.js               # Get/update budget
│   │   └── aiController.js                   # AI chat with OpenAI/Claude
│   │
│   ├── 📁 routes/                            # API endpoints
│   │   ├── auth.js                           # /api/auth/* routes
│   │   ├── transactions.js                   # /api/transactions/* routes
│   │   ├── budget.js                         # /api/budget/* routes
│   │   └── ai.js                             # /api/ai/* routes
│   │
│   └── 📁 utils/                             # Utility functions
│
│
├── 🗂️  frontend files/                       # Frontend UI
│   ├── 📄 index.html                         # Main HTML file
│   │
│   ├── 📁 css/                               # Stylesheets
│   │   ├── variables.css                     # CSS custom properties
│   │   ├── global.css                        # Global styles
│   │   ├── components.css                    # Component styles
│   │   ├── dashboard.css                     # Dashboard styling
│   │   ├── auth.css                          # Auth pages styling
│   │   ├── theme-dark.css                    # Dark mode theme
│   │   └── ... (15+ CSS files)
│   │
│   ├── 📁 js/                                # JavaScript files
│   │   ├── api.js                            # 🆕 API client (communicates with backend)
│   │   ├── auth.js                           # 🔄 UPDATED - Now uses backend API
│   │   ├── auth-ui.js                        # 🔄 UPDATED - Async handlers
│   │   ├── app.js                            # Main app logic
│   │   ├── dashboard.js                      # Dashboard screen
│   │   ├── components.js                     # Reusable components
│   │   ├── router.js                         # Page navigation
│   │   ├── sidebar.js                        # Sidebar component
│   │   ├── header.js                         # Header component
│   │   ├── analytics.js                      # Analytics screen
│   │   ├── ai-chat.js                        # AI advisor chat
│   │   ├── theme.js                          # Theme management
│   │   └── ... (15+ JS files)
│   │
│   ├── 📁 image/                             # Image assets
│   └── 📁 assets/
│       └── icons/                            # Icon assets
│
│
├── 📁 node_modules/                          # npm packages (auto-generated)
└── 📁 .git/                                  # Git repository (auto-generated)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org))
- **MongoDB** (Atlas cloud recommended - [MONGODB_SETUP.md](MONGODB_SETUP.md))
- **npm** or **yarn** package manager

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/59-abhishekdubey/Finance-tracker.git
cd Finance-tracker
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup MongoDB
Choose one option in [MONGODB_SETUP.md](MONGODB_SETUP.md):
- **☁️ MongoDB Atlas** (Cloud - Recommended)
- **📦 Local MongoDB** (Installed on your machine)

#### 4. Configure Environment Variables
Create/update `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.k3ujqr3.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=change-this-to-random-string-before-production
JWT_EXPIRE=30d
FRONTEND_URL=http://127.0.0.1:5501
```

#### 5. Start the Backend Server
```bash
npm run dev
```

Expected output:
```
✅ Finance Tracker Backend Server Started
✅ MongoDB Connected
🚀 Server running on: http://localhost:5000
```

#### 6. Open Frontend (New Terminal)
```bash
# Using Python (if installed)
python -m http.server 5501

# OR using Node.js
npx http-server -p 5501
```

Then open: **http://127.0.0.1:5501**

---

## 📡 API Endpoints

### Authentication (Public)
```
POST   /api/auth/register          # Create new account
POST   /api/auth/login             # Login & get JWT token
GET    /api/auth/me                # Get current user (requires token)
```

### Transactions (Protected)
```
GET    /api/transactions           # Get all user transactions
POST   /api/transactions           # Create new transaction
PUT    /api/transactions/:id       # Update transaction
DELETE /api/transactions/:id       # Delete transaction
```

### Budget (Protected)
```
GET    /api/budget                 # Get user's budget
POST   /api/budget                 # Update budget allocation
```

### AI Chat (Protected)
```
POST   /api/ai/chat                # Chat with AI advisor
```

**All protected endpoints require:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Structure & markup |
| **CSS3** | Styling & animations |
| **JavaScript (ES6+)** | Interactivity & logic |
| **Chart.js** | Real charts & analytics |
| **Fetch API** | API communication |

### Backend  
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | Database ODM |
| **JWT** | Token authentication |
| **bcryptjs** | Password hashing |
| **nodemon** | Development auto-reload |

### APIs
| Service | Purpose |
|---------|---------|
| **OpenAI** | GPT-3.5 financial advice |
| **Anthropic Claude** | Alternative AI advisor |

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing (10 salt rounds)
- Never stored in plaintext
- Not returned by API

✅ **Authentication**
- JWT tokens (30-day expiration)
- Header-based token validation
- Protected routes with middleware

✅ **Data Protection**
- CORS enabled for frontend only
- MongoDB document validation
- Input sanitization

✅ **Secrets Management**
- `.env` file with sensitive data (never committed)
- API keys kept on server side
- Frontend never accesses secrets

---

## 📊 Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (default: '👤'),
  createdAt: Date,
  lastLogin: Date
}
```

### Transaction Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  amount: Number (required),
  category: String (enum: food, transport, etc.),
  transactionType: String (enum: 'income', 'expense'),
  budgetType: String (enum: 'needs', 'wants', 'savings'),
  description: String,
  date: String (YYYY-MM-DD format),
  createdAt: Date
}
```

### Budget Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (unique reference to User),
  total: Number,
  needs: Number (50%),
  wants: Number (30%),
  savings: Number (20%),
  savingsGoal: Number,
  updatedAt: Date
}
```

---

## 🧪 Testing the API

### Using Thunder Client / Postman

1. **Register User**
   - POST → `http://localhost:5000/api/auth/register`
   - Body: `{ "name": "John", "email": "john@test.com", "password": "Test@123" }`
   - Response: Get JWT token

2. **Create Transaction**
   - POST → `http://localhost:5000/api/transactions`
   - Header: `Authorization: Bearer YOUR_TOKEN`
   - Body: `{ "amount": 500, "category": "food", ... }`

3. **Get Transactions**
   - GET → `http://localhost:5000/api/transactions`
   - Header: `Authorization: Bearer YOUR_TOKEN`

See [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) for complete examples.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](QUICK_START.md)** | Get running in 5 minutes |
| **[BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)** | Full API reference & examples |
| **[MONGODB_SETUP.md](MONGODB_SETUP.md)** | MongoDB installation guide |
| **[TEAM_PULL_REQUEST.md](TEAM_PULL_REQUEST.md)** | Team integration guide |

---

## 🚀 Deployment

### Backend (Recommended Platforms)
- **Heroku** - Free tier available (`git push heroku main`)
- **Railway** - Easy deployment (`railway up`)
- **Render** - Free tier hosting
- **AWS** - Production-grade hosting

### Frontend
- **GitHub Pages** - Static hosting
- **Vercel** - Optimized for web apps
- **Netlify** - Drag & drop deployment

### Database
- **MongoDB Atlas** - Free cloud database (recommended)
- **Railway** - Managed MongoDB
- **AWS RDS** - Enterprise solution

---

## 🔄 Workflow

### Development
```bash
npm run dev              # Start backend with auto-reload
python -m http.server 5501  # Start frontend in another terminal
```

### For Team Members
```bash
git pull origin main    # Get latest changes
npm install             # Install new dependencies
npm run dev             # Start server
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongoDB Connection Error` | Check MONGODB_SETUP.md, ensure MongoDB is running |
| `Port 5000 already in use` | Change PORT in .env or kill process |
| `Cannot find module` | Run `npm install` again |
| `CORS errors` | Verify FRONTEND_URL in .env |
| `JWT Auth fails` | Get new token by logging in again |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request
5. Read [TEAM_PULL_REQUEST.md](TEAM_PULL_REQUEST.md) first!

---

## 📈 Project Stats

- **Frontend Files:** 40+ files (HTML, CSS, JS)
- **Backend Files:** 15+ files (config, models, routes, controllers)
- **API Endpoints:** 10+ endpoints
- **Database Models:** 3 schemas (User, Transaction, Budget)
- **Documentation:** 4 comprehensive guides
- **Lines of Code:** 4000+
- **Dependencies:** 20+ npm packages

---

## 🎯 Roadmap

### Phase 1 (✅ Completed)
- Backend API implementation
- MongoDB integration
- JWT authentication
- Frontend-backend connection
- Basic CRUD operations

### Phase 2 (🚀 In Progress)
- AI financial advisor integration
- Advanced analytics & reports
- Budget alerts & notifications
- Expense analytics

### Phase 3 (📋 Planned)
- Multi-currency support
- Data export (PDF, CSV)
- Mobile app (React Native)
- Real-time notifications
- Offline mode support
- Advanced charts & visualizations

---

## 📞 Support

### Getting Help
1. Check relevant documentation file
2. Review error messages carefully
3. Search GitHub issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

### Contact
- **Repository:** https://github.com/59-abhishekdubey/Finance-tracker
- **Issues:** https://github.com/59-abhishekdubey/Finance-tracker/issues
- **Email:** abhishekdubey112jeem@gmail.com

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **Chart.js** - For beautiful charts
- **Express.js** - For robust API framework
- **MongoDB** - For reliable database
- **OpenAI & Anthropic** - For AI capabilities
- **Gen Z users** - For inspiring modern UX

---

## ✨ Built With ❤️ by Abhishek Dubey

**Happy Tracking! 💰🎉**

---

## 👥 Contributors & Commit History

### Divyanshi Tripathi

| Commit | Date | Message |
|--------|------|---------|
| `aea555c` | 2026-03-15 | resolve merge conflicts - keep local version *(last commit)* |
| `73764ed` | 2026-03-15 | update project files |
| `7fad57c` | 2026-03-09 | Final working version of Finance Tracker |
| `72d40f2` | 2026-03-09 | Add auth system, analytics page, and UI updates |
| `04cdaf5` | 2026-03-09 | Add landing page styles |
| `cb6e3ed` | 2026-03-08 | feat: add authentication system with login and signup pages |
| `81a47bc` | 2026-03-08 | 3rd commit - AI chat interface implementation with message bubbles and smart responses |
| `049cd8c` | 2026-03-08 | first commit |
| `919ba9b` | 2026-03-08 | 2nd commit |
| `9315099` | 2026-03-08 | First commit |
| `5c98e8c` | 2026-03-08 | Updated title |
| `eb771e7` | 2026-03-08 | Updated title |
| `5640cd9` | 2026-03-08 | Update project title to 'Finance Tracker - minimalist edition' |
| `08f9f3a` | 2026-03-08 | first commit |

> **Last commit by Divyanshi Tripathi:**
> - **SHA:** `aea555cb3090bb10f59f6c9cea90a0571b4b36da`
> - **Date:** 2026-03-15
> - **Message:** resolve merge conflicts - keep local version

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#6C5CE7 → #A78BFA)
- **Accent**: Cyan (#00D9FF)
- **Dark backgrounds**: Charcoal (#0F0F1E, #1A1A2E, #252538)
- **Categories**: Red, Teal, Yellow, Green custom colors

### Spacing & Sizing
- Consistent spacing scale from XS to 2XL
- Rounded corners: sm, md, lg, xl, 2xl
- Smooth transitions with custom easing functions

## 📱 Features Breakdown

### Dashboard
- Daily spending overview
- Budget progress bars (50/30/20 rule)
- Recent transactions list
- Quick action buttons

### Add Expense Modal
- Amount input with rupee formatting
- Category selection with visual pills
- Optional note field
- Date picker

### AI Advisor
- Chat interface with mock responses
- Suggestion cards for common questions
- Real-time message updates
- Conversational financial advice

### Bottom Navigation
- Quick access to all app sections
- Active state indicators
- Mobile-optimized touch targets

## 📊 Budget Categories

### Needs (50%)
- Transport, Bills, Groceries
- Essential expenses

### Wants (30%)
- Food, Shopping, Entertainment
- Discretionary spending

### Savings (20%)
- Future financial goals
- Emergency fund

## 🔧 Customization

### Modifying Budget Percentages
Edit `js/data.js`:
```javascript
const BUDGET_CONFIG = {
  monthlyBudget: 50000,
  needs: 0.5,    // 50%
  wants: 0.3,    // 30%
  savings: 0.2   // 20%
};
```

### Adding New Categories
1. Add to `CATEGORY_DATA` in `js/data.js`
2. Add icon to `CATEGORY_ICONS`
3. Update styles in `css/components.css`

### Changing Theme Colors
Edit CSS variables in `css/variables.css`:
```css
--primary-purple: #6C5CE7;
--primary-cyan: #00D9FF;
/* ... other colors */
```

## 🌐 Future Enhancements

- [ ] Backend integration with database
- [ ] User authentication
- [ ] Data persistence (localStorage/IndexedDB)
- [ ] Advanced charts and analytics
- [ ] Real AI integration
- [ ] Multi-currency support
- [ ] Budget alerts and notifications
- [ ] Expense reports and exports
- [ ] Dark/Light theme toggle
- [ ] Offline mode support

## ♿ Accessibility

The app includes:
- Semantic HTML structure
- ARIA labels for screen readers
- High contrast colors
- Keyboard navigation support
- Touch-friendly interface

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Made with ❤️ for Gen Z**
