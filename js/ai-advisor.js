// ============================================
// AI ADVISOR - ENHANCED RELIABLE VERSION
// ============================================

let conversationHistory = [];
let messageInFlight = false;
let abortController = null;
const MAX_HISTORY_LENGTH = 10;
const HISTORY_STORAGE_KEY = 'finance_tracker_ai_history';
const MESSAGE_TIMEOUT = 15000; // 15 second timeout

function initAIAdvisor() {
    loadConversationHistory();
    setupAIEventListeners();
    displayWelcomeMessage();
    console.log('✅ AI Advisor initialized with enhanced reliability');
}

function setupAIEventListeners() {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');
    
    if (sendBtn) {
        const newBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newBtn, sendBtn);
        newBtn.addEventListener('click', debounceMessage);
    }
    
    if (input) {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                debounceMessage();
            }
        });
    }
}

// Debounce to prevent rapid duplicate submissions
let sendTimeout = null;
function debounceMessage() {
    clearTimeout(sendTimeout);
    sendTimeout = setTimeout(() => {
        if (!messageInFlight) {
            sendMessage();
        }
    }, 100);
}

function displayWelcomeMessage() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (conversationHistory.length === 0) {
        addMessageToUI('ai', '👋 Hi! I\'m your AI Financial Advisor. Ask me anything about budgeting, saving, or your spending habits!', false);
    } else {
        conversationHistory.forEach(msg => {
            addMessageToUI(msg.type, msg.text, false);
        });
    }
}

async function sendMessage() {
    const input = document.getElementById('ai-input');
    if (!input || messageInFlight) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Prevent duplicate sends
    messageInFlight = true;
    input.disabled = true;
    
    try {
        // Add user message to UI
        addMessageToUI('user', message);
        input.value = '';
        
        // Hide suggestions after first message
        const suggestions = document.getElementById('ai-suggestions');
        if (suggestions) suggestions.style.display = 'none';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Create abort controller for this request
        abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), MESSAGE_TIMEOUT);
        
        let response;
        
        try {
            // Try backend API first if authenticated
            if (typeof getAuthToken === 'function' && getAuthToken()) {
                const userData = await gatherUserData();
                response = await apiAIChat(message, userData, conversationHistory, { signal: abortController.signal });
            } else {
                // Use local pattern matching
                response = getLocalAIResponse(message);
            }
        } catch (apiError) {
            // Handle abort or timeout
            if (apiError.name === 'AbortError') {
                response = '⏱️ Request timed out. Please try a shorter message or try again.';
                console.warn('AI request timeout');
            } else {
                console.warn('Backend AI error, using fallback:', apiError.message);
                response = getLocalAIResponse(message);
            }
        } finally {
            clearTimeout(timeoutId);
        }
        
        hideTypingIndicator();
        addMessageToUI('ai', response);
        
    } catch (err) {
        hideTypingIndicator();
        addMessageToUI('ai', '⚠️ Sorry, I encountered an error. Please try again.');
        console.error('AI Chat Error:', err);
    } finally {
        messageInFlight = false;
        if (input) input.disabled = false;
    }
}

// Local AI response with better pattern matching
function getLocalAIResponse(message) {
    if (typeof getAIResponse === 'function') {
        try {
            const transactions = typeof getTransactions === 'function' ? getTransactions() : [];
            const budget = typeof getBudget === 'function' ? getBudget() : { total: 15000, needs: 7500, wants: 4500, savings: 3000 };
            return getAIResponse(message, transactions, budget);
        } catch (e) {
            console.warn('Local AI response error:', e);
        }
    }
    return "I'm here to help with your finances! Ask me about saving money, budgeting, managing debt, or specific purchase decisions. 💬";
}

function addMessageToUI(type, text, saveHistory = true) {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'ai-message-time';
    time.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    container.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
    
    if (saveHistory) {
        const historyEntry = { type, text, timestamp: new Date().toISOString() };
        conversationHistory.push(historyEntry);
        
        // Keep only last N messages for performance
        if (conversationHistory.length > MAX_HISTORY_LENGTH) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH);
        }
        
        saveConversationHistory();
    }
}

function showTypingIndicator() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
    hideTypingIndicator();
    
    const typing = document.createElement('div');
    typing.id = 'ai-typing';
    typing.className = 'ai-message ai-message-ai';
    typing.innerHTML = '<div class="ai-message-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById('ai-typing');
    if (typing) typing.remove();
}

async function gatherUserData() {
    try {
        const transactions = typeof getTransactions === 'function' ? getTransactions() : [];
        const budget = typeof getBudget === 'function' ? getBudget() : null;
        
        const income = transactions
            .filter(t => t.transactionType === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.transactionType !== 'income' && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const categories = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            });
        
        const topCategories = Object.entries(categories)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);
        
        return {
            totalIncome: income,
            totalExpenses: expenses,
            budget,
            topCategories
        };
    } catch (err) {
        console.error('Error gathering data:', err);
        return null;
    }
}

// ========== PERSISTENT STORAGE WITH SIZE MANAGEMENT ==========

function saveConversationHistory() {
    try {
        const data = JSON.stringify(conversationHistory);
        // Limit to ~30KB per conversation history
        if (data.length > 30000) {
            conversationHistory = conversationHistory.slice(-5);
        }
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversationHistory));
    } catch (e) {
        console.warn('Failed to save conversation history:', e);
        // If quota exceeded, clear and save only recent messages
        if (e.name === 'QuotaExceededError') {
            conversationHistory = conversationHistory.slice(-5);
            try {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversationHistory));
            } catch (error_) {
                console.error('Storage quota still exceeded:', error_);
            }
        }
    }
}

function loadConversationHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        conversationHistory = stored ? JSON.parse(stored) : [];
        console.log(`📝 Loaded ${conversationHistory.length} messages from chat history`);
    } catch (e) {
        console.warn('Failed to load conversation history:', e);
        conversationHistory = [];
    }
}

function clearConversationHistory() {
    conversationHistory = [];
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    displayWelcomeMessage();
    console.log('🗑️ Chat history cleared');
}

// Make functions globally accessible
if (typeof globalThis !== 'undefined') {
    globalThis.initAIAdvisor = initAIAdvisor;
    globalThis.sendMessage = sendMessage;
    globalThis.clearConversationHistory = clearConversationHistory;
}

console.log('✅ AI Advisor loaded with enhanced reliability & persistence');
