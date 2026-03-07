// ========== AUTHENTICATION SYSTEM (localStorage based) ==========

// Check if user is logged in
function isLoggedIn() {
    const session = localStorage.getItem('finance_tracker_session');
    return session !== null;
}

// Get current user data
function getCurrentUser() {
    const session = localStorage.getItem('finance_tracker_session');
    if (session) {
        return JSON.parse(session);
    }
    return null;
}

// Register new user
function registerUser(userData) {
    // userData: { name, email, password, avatar }
    
    // Check if user already exists
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
        return {
            success: false,
            error: 'Email already registered'
        };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        avatar: userData.avatar,
        createdAt: new Date().toISOString(),
        accountType: 'Free Plan'
    };
    
    // Save to users list
    users.push(newUser);
    localStorage.setItem('finance_tracker_users', JSON.stringify(users));
    
    return {
        success: true,
        user: newUser
    };
}

// Login user
function loginUser(email, password) {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session (remove password before storing)
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            accountType: user.accountType,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('finance_tracker_session', JSON.stringify(session));
        
        return {
            success: true,
            user: session
        };
    }
    
    return {
        success: false,
        error: 'Invalid email or password'
    };
}

// Logout user
function logoutUser() {
    localStorage.removeItem('finance_tracker_session');
    // Optionally clear chat history
    localStorage.removeItem('chat_history');
}

// Get all users (helper function)
function getAllUsers() {
    const users = localStorage.getItem('finance_tracker_users');
    return users ? JSON.parse(users) : [];
}

// Update user profile
function updateUserProfile(updates) {
    const session = getCurrentUser();
    if (!session) return { success: false, error: 'Not logged in' };
    
    // Update session
    const updatedSession = { ...session, ...updates };
    localStorage.setItem('finance_tracker_session', JSON.stringify(updatedSession));
    
    // Update in users list
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
    const transactions = getTransactions(); // From existing data.js
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
