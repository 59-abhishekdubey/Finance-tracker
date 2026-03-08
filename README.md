# Finance Tracker - Gen Z Edition

A modern, mobile-first personal finance tracking application designed for Generation Z users. Track expenses, manage budgets, and get AI-powered financial advice all in one place.

## 🎯 Features

- **Dashboard**: Real-time spending overview with daily budget tracking
- **Budget Breakdown**: 50/30/20 budget allocation (Needs, Wants, Savings)
- **Transaction Management**: Easy expense logging with categories and dates
- **AI Finance Advisor**: Chat with an intelligent finance assistant
- **Mobile Optimized**: Fully responsive design for all devices
- **Dark Mode**: Eye-friendly interface with modern glassmorphism effects
- **Local Storage Ready**: Foundation for persistent data storage

## 📁 Project Structure

```
finance-tracker/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── global.css          # Global styles & animations
│   ├── components.css      # Component-specific styles
│   └── screens.css         # Screen layouts & responsive design
├── js/
│   ├── app.js              # Main React app component
│   ├── components.js       # Reusable React components
│   ├── data.js             # Mock data & constants
│   └── utils.js            # Utility functions
├── assets/
│   └── icons/              # Icon assets (future use)
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required - runs directly in the browser

### Installation
1. Clone or download the project
2. Open `index.html` in your web browser
3. Start tracking your finances!

## 💻 Technologies Used

### Frontend
- **React 18** - UI framework
- **Babel Standalone** - JSX transpiler
- **Tailwind CSS** - Utility CSS framework
- **Custom CSS** - Advanced styling and animations

### Design
- **DM Sans Font** - Modern typeface
- **Glassmorphism** - Modern UI effects
- **Mobile-First Responsive** - Works on all screen sizes

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
