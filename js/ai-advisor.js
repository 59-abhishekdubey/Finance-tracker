// ============================================
// AI ADVISOR - COMPLETE WORKING VERSION
// ============================================

let conversationHistory = [];

function initAIAdvisor() {
    loadConversationHistory();
    setupAIEventListeners();
    displayWelcomeMessage();
}

function setupAIEventListeners() {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');
    
    if (sendBtn) {
        // Remove old listeners by cloning
        const newBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newBtn, sendBtn);
        newBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        // Remove old listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function displayWelcomeMessage() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
    // Clear existing messages
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
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    input.value = '';
    
    // Hide suggestion chips after first message
    const suggestions = document.getElementById('ai-suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        let response;
        
        // Try backend API first if user is logged in
        if (typeof getAuthToken === 'function' && getAuthToken()) {
            try {
                const userData = await gatherUserData();
                response = await apiAIChat(message, userData, conversationHistory);
            } catch (apiError) {
                console.warn('Backend AI unavailable, using local fallback:', apiError.message);
                // Fallback to local pattern matching
                response = getLocalAIResponse(message);
            }
        } else {
            // No auth token — use local pattern matching
            response = getLocalAIResponse(message);
        }
        
        hideTypingIndicator();
        addMessageToUI('ai', response);
        
    } catch (err) {
        hideTypingIndicator();
        addMessageToUI('ai', '⚠️ Sorry, I encountered an error. Please try again.');
        console.error('AI Chat Error:', err);
    }
}

// Local fallback using pattern matching from ai-chat.js
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
    container.scrollTop = container.scrollHeight;
    
    if (saveHistory) {
        conversationHistory.push({ type, text, timestamp: new Date().toISOString() });
        saveConversationHistory();
    }
}

function showTypingIndicator() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
    // Remove existing typing indicator if any
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

function saveConversationHistory() {
    try {
        // Keep only last 50 messages to prevent localStorage bloat
        const toSave = conversationHistory.slice(-50);
        localStorage.setItem('finance_tracker_ai_history', JSON.stringify(toSave));
    } catch (e) {
        console.warn('Could not save conversation history:', e);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('finance_tracker_ai_history');
        if (saved) {
            conversationHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load conversation history:', e);
        conversationHistory = [];
    }
}

// Make functions globally accessible
if (typeof globalThis !== 'undefined') {
    globalThis.initAIAdvisor = initAIAdvisor;
    globalThis.sendMessage = sendMessage;
}

console.log('✅ AI Advisor loaded');
