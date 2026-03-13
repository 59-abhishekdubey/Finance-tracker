// ========== ICONS ==========
const ICONS = {
    // Categories
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    bills: '💡',
    entertainment: '🎮',
    savings: '💰',
    other: '📦',
    
    // UI
    home: '🏠',
    chart: '📊',
    chat: '💬',
    add: '➕',
    close: '✕',
    check: '✓',
    warning: '⚠️',
    back: '←',
    menu: '☰',
};

// Get icon by name
function getIcon(name) {
    return ICONS[name] || ICONS.other;
}

// ========== FORMATTING ==========

// Format currency (Indian Rupees)
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Format date (e.g., "Feb 19")
function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
}

// Format date for display (e.g., "Today", "Yesterday", or "Feb 17")
function formatDateRelative(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateObj = new Date(date);
    
    if (dateObj.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return formatDate(date);
    }
}

// Format time (e.g., "2:30 PM")
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Get day name (e.g., "Mon", "Tue")
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(date).getDay()];
}

// ========== CATEGORY HELPERS ==========

// Get category color
function getCategoryColor(category) {
    const colors = {
        food: '#10B981',
        transport: '#3B82F6',
        shopping: '#F59E0B',
        bills: '#8B5CF6',
        entertainment: '#EC4899',
        savings: '#14B8A6',
        other: '#6B7280'
    };
    return colors[category.toLowerCase()] || colors.other;
}

// Get category type (needs/wants/savings)
function getCategoryType(category) {
    const needs = ['food', 'bills', 'transport'];
    const wants = ['shopping', 'entertainment', 'other'];
    
    const cat = category.toLowerCase();
    
    if (needs.includes(cat)) return 'needs';
    if (wants.includes(cat)) return 'wants';
    return 'savings';
}

// ========== DATE HELPERS ==========

// Get last N days as array of date strings
function getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// Get date string for today
function getToday() {
    return new Date().toISOString().split('T')[0];
}

// Check if date is today
function isToday(date) {
    return date === getToday();
}

// ========== CALCULATION HELPERS ==========

// Calculate percentage
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// Get spending by day for histogram
function getSpendingByDay(transactions, days = 7) {
    const lastNDays = getLastNDays(days);
    const spendingMap = {};
    
    // Initialize all days with 0
    lastNDays.forEach(date => {
        spendingMap[date] = 0;
    });
    
    // Sum up transactions by day
    transactions.forEach(transaction => {
        if (transaction.type === 'expense' && spendingMap.hasOwnProperty(transaction.date)) {
            spendingMap[transaction.date] += transaction.amount;
        }
    });
    
    return lastNDays.map(date => ({
        date: date,
        amount: spendingMap[date],
        label: getDayName(date),
        isToday: isToday(date)
    }));
}

// Get max value from array (for histogram scaling)
function getMaxValue(arr, key = 'amount') {
    if (arr.length === 0) return 0;
    return Math.max(...arr.map(item => item[key]));
}

// ========== VALIDATION ==========

// Validate amount input
function isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
}

// Sanitize string input
function sanitizeString(str) {
    return str.trim().slice(0, 100); // Max 100 chars
}