// ========== API CLIENT ==========
// Communicates with backend server

const API_URL = 'http://localhost:5001/api';

// Get auth token
function getAuthToken() {
    return localStorage.getItem('finance_tracker_token');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('finance_tracker_token', token);
}

// Clear auth token
function clearAuthToken() {
    localStorage.removeItem('finance_tracker_token');
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
        
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== AUTH API ==========

async function apiRegister(name, email, password) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
    
    if (data.success) {
        setAuthToken(data.token);
        localStorage.setItem('finance_tracker_user', JSON.stringify(data.user));
    }
    
    return data;
}

async function apiLogin(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    if (data.success) {
        setAuthToken(data.token);
        localStorage.setItem('finance_tracker_user', JSON.stringify(data.user));
    }
    
    return data;
}

async function apiGetCurrentUser() {
    const data = await apiRequest('/auth/me');
    return data.user;
}

function apiLogout() {
    clearAuthToken();
    localStorage.removeItem('finance_tracker_user');
}

// ========== TRANSACTIONS API ==========

async function apiGetTransactions(filters = {}) {
    const params = new URLSearchParams(filters);
    const data = await apiRequest(`/transactions?${params}`);
    return data.transactions;
}

async function apiCreateTransaction(transaction) {
    const data = await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction)
    });
    return data.transaction;
}

async function apiUpdateTransaction(id, updates) {
    const data = await apiRequest(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    return data.transaction;
}

async function apiDeleteTransaction(id) {
    const data = await apiRequest(`/transactions/${id}`, {
        method: 'DELETE'
    });
    return data;
}

// ========== BUDGET API ==========

async function apiGetBudget() {
    const data = await apiRequest('/budget');
    return data.budget;
}

async function apiUpdateBudget(budget) {
    const data = await apiRequest('/budget', {
        method: 'POST',
        body: JSON.stringify(budget)
    });
    return data.budget;
}

// ========== AI API ==========

async function apiAIChat(message, userData, conversationHistory) {
    const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, userData, conversationHistory })
    });
    return data.message;
}

console.log('✅ API client loaded');
