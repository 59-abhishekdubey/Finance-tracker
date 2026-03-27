// ========== AUTHENTICATION SYSTEM (Backend API based) ==========

// Check if user is logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Get current user data
function getCurrentUser() {
    const userStr = localStorage.getItem('finance_tracker_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Register new user (API)
async function registerUser(userData) {
    try {
        const data = await apiRegister(userData.name, userData.email, userData.password);
        return {
            success: data.success,
            user: data.user,
            error: data.error
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Login user (API)
async function loginUser(email, password) {
    try {
        const data = await apiLogin(email, password);
        return {
            success: data.success,
            user: data.user,
            error: data.error
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Logout user
function logoutUser() {
    apiLogout();
    localStorage.removeItem('chat_history');
}

// Get all users (kept for compatibility, not used with backend)
function getAllUsers() {
    return [];
}

// Update user profile
function updateUserProfile(updates) {
    const session = getCurrentUser();
    if (!session) return { success: false, error: 'Not logged in' };
    
    const updatedSession = { ...session, ...updates };
    localStorage.setItem('finance_tracker_session', JSON.stringify(updatedSession));
    
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === session.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('finance_tracker_users', JSON.stringify(users));
    }
    
    return { success: true, user: updatedSession };
}

// Get user stats
function getUserStats() {
    const transactions = getTransactions();
    const user = getCurrentUser();
    
    if (!user) return null;
    
    const memberSince = new Date(user.createdAt);
    const now = new Date();
    const daysSince = Math.floor((now - memberSince) / (1000 * 60 * 60 * 24));
    
    const totalTransactions = transactions.length;
    const thisMonth = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });
    
    const monthlySpending = thisMonth.reduce((sum, t) => sum + t.amount, 0);
    const budget = getBudget();
    const budgetUsed = (monthlySpending / budget.total) * 100;
    
    return {
        totalTransactions,
        daysSince,
        monthlySpending,
        budgetUsed: Math.round(budgetUsed),
        memberSince: user.createdAt
    };
}
