// ========== MOCK DATA ==========

const mockTransactions = [
    {
        id: 1,
        name: 'Lunch at Cafe Coffee Day',
        amount: 350,
        category: 'food',
        date: new Date(2025, 1, 19).toISOString().split('T')[0],
        time: '14:30',
        type: 'expense'
    },
    {
        id: 2,
        name: 'Metro Card Recharge',
        amount: 200,
        category: 'transport',
        date: new Date(2025, 1, 19).toISOString().split('T')[0],
        time: '09:15',
        type: 'expense'
    },
    {
        id: 3,
        name: 'New Headphones',
        amount: 2500,
        category: 'shopping',
        date: new Date(2025, 1, 18).toISOString().split('T')[0],
        time: '18:45',
        type: 'expense'
    },
    {
        id: 4,
        name: 'Electricity Bill',
        amount: 1800,
        category: 'bills',
        date: new Date(2025, 1, 18).toISOString().split('T')[0],
        time: '11:00',
        type: 'expense'
    },
    {
        id: 5,
        name: 'Movie Tickets - Dune 2',
        amount: 600,
        category: 'entertainment',
        date: new Date(2025, 1, 17).toISOString().split('T')[0],
        time: '20:00',
        type: 'expense'
    },
    {
        id: 6,
        name: 'Weekly Groceries',
        amount: 2400,
        category: 'food',
        date: new Date(2025, 1, 17).toISOString().split('T')[0],
        time: '17:30',
        type: 'expense'
    },
    {
        id: 7,
        name: 'Spotify Premium',
        amount: 119,
        category: 'entertainment',
        date: new Date(2025, 1, 16).toISOString().split('T')[0],
        time: '00:01',
        type: 'expense'
    },
    {
        id: 8,
        name: 'Coffee with Friends',
        amount: 450,
        category: 'food',
        date: new Date(2025, 1, 16).toISOString().split('T')[0],
        time: '10:30',
        type: 'expense'
    },
    {
        id: 9,
        name: 'Monthly Savings Transfer',
        amount: 5000,
        category: 'savings',
        date: new Date(2025, 1, 15).toISOString().split('T')[0],
        time: '12:00',
        type: 'expense'
    },
    {
        id: 10,
        name: 'Uber to Office',
        amount: 340,
        category: 'transport',
        date: new Date(2025, 1, 15).toISOString().split('T')[0],
        time: '22:15',
        type: 'expense'
    },
    {
        id: 11,
        name: 'Dinner at Restaurant',
        amount: 1200,
        category: 'food',
        date: new Date(2025, 1, 14).toISOString().split('T')[0],
        time: '20:00',
        type: 'expense'
    },
    {
        id: 12,
        name: 'Internet Bill',
        amount: 999,
        category: 'bills',
        date: new Date(2025, 1, 13).toISOString().split('T')[0],
        time: '10:00',
        type: 'expense'
    }
];

// User's monthly budget
const userBudget = {
    total: 15000,
    needs: 7500,   // 50%
    wants: 4500,   // 30%
    savings: 3000  // 20%
};

// ========== CALCULATIONS ==========

// Calculate spent amounts by type
function calculateSpent(transactions) {
    const spent = {
        needs: 0,
        wants: 0,
        savings: 0,
        total: 0
    };
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const type = getCategoryType(transaction.category);
            spent[type] += transaction.amount;
            spent.total += transaction.amount;
        }
    });
    
    return spent;
}

// Get today's spending
function getTodaySpending(transactions) {
    const today = getToday();
    return transactions
        .filter(t => t.type === 'expense' && t.date === today)
        .reduce((sum, t) => sum + t.amount, 0);
}

// Get spending for a specific date
function getSpendingForDate(transactions, date) {
    return transactions
        .filter(t => t.type === 'expense' && t.date === date)
        .reduce((sum, t) => sum + t.amount, 0);
}

// ========== LOCAL STORAGE ==========

const STORAGE_KEY = 'finance_tracker_data';
const STORAGE_VERSION = '1.0';

// Initialize storage with mock data
function initStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
        const initialData = {
            version: STORAGE_VERSION,
            transactions: mockTransactions,
            budget: userBudget,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}

// Get all data from storage
function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        initStorage();
        return getData();
    }
    return JSON.parse(data);
}

// Save data to storage
function saveData(data) {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get all transactions
function getTransactions() {
    const data = getData();
    // Sort by date (newest first), then by time
    return data.transactions.sort((a, b) => {
        if (a.date !== b.date) {
            return new Date(b.date) - new Date(a.date);
        }
        return b.time.localeCompare(a.time);
    });
}

// Get budget
function getBudget() {
    return getData().budget;
}

// Add new transaction
function addTransaction(transaction) {
    const data = getData();
    
    // Create transaction object
    const newTransaction = {
        id: Date.now(),
        name: sanitizeString(transaction.name),
        amount: parseFloat(transaction.amount),
        category: transaction.category,
        date: transaction.date || getToday(),
        time: new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        type: 'expense'
    };
    
    data.transactions.push(newTransaction);
    saveData(data);
    
    return newTransaction;
}

// Delete transaction
function deleteTransaction(id) {
    const data = getData();
    data.transactions = data.transactions.filter(t => t.id !== id);
    saveData(data);
}

// Update budget
function updateBudget(newBudget) {
    const data = getData();
    data.budget = newBudget;
    saveData(data);
}

// Clean old data (keep only last 7 days)
function cleanOldData() {
    const data = getData();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    data.transactions = data.transactions.filter(t => 
        new Date(t.date) >= sevenDaysAgo
    );
    
    saveData(data);
}

// Reset all data (for testing)
function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    initStorage();
}

// ========== INITIALIZE ON LOAD ==========
initStorage();
cleanOldData();