// ============================================
// AUTHENTICATION LOGIC
// ============================================

// Register user
async function registerUser(name, email, password) {
    try {
        const data = await apiRegister(name, email, password);
        return {
            success: true,
            user: data.user,
            message: 'Registration successful!'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Registration failed'
        };
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const data = await apiLogin(email, password);
        return {
            success: true,
            user: data.user,
            message: 'Login successful!'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Login failed'
        };
    }
}

// Logout user
function logoutUser() {
    apiLogout();
    navigateTo('landing');
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('finance_tracker_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Check auth on protected pages
function checkAuth() {
    const publicPages = ['landing', 'login', 'register'];
    const currentPage = getCurrentPage();
    
    if (!publicPages.includes(currentPage) && !isLoggedIn()) {
        navigateTo('login');
        return false;
    }
    
    if (publicPages.includes(currentPage) && isLoggedIn()) {
        navigateTo('home');
        return false;
    }
    
    return true;
}

console.log('✅ Auth module loaded');
