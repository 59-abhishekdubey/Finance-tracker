// ============================================
// AI ADVISOR - SIMPLIFIED WORKING VERSION
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
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
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
    
    if (conversationHistory.length === 0) {
        addMessageToUI('ai', '👋 Hi! I\'m your AI Financial Advisor. Ask me anything about budgeting, saving, or spending!');
    } else {
        conversationHistory.forEach(msg => {
            addMessageToUI(msg.type, msg.text, false);
        });
    }
}

async function sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessageToUI('user', message);
    input.value = '';
    
    showTypingIndicator();
    
    try {
        const userData = await gatherUserData();
        const response = await apiAIChat(message, userData, conversationHistory);
        
        hideTypingIndicator();
        addMessageToUI('ai', response);
        
    } catch (err) {
        hideTypingIndicator();
        addMessageToUI('ai', '⚠️ Sorry, I encountered an error. Please try again.');
        console.error('AI Chat Error:', err);
    }
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
    
    container.scrollTop = container.scrollHeight;
    
    if (saveHistory) {
        conversationHistory.push({ type, text, timestamp: new Date().toISOString() });
        saveConversationHistory();
    }
}

function showTypingIndicator() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;
    
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
        const transactions = await apiGetTransactions();
        const budget = await apiGetBudget();
        
        const income = transactions
            .filter(t => t.transactionType === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.transactionType === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const categories = {};
        transactions
            .filter(t => t.transactionType === 'expense')
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
    localStorage.setItem('finance_tracker_ai_history', JSON.stringify(conversationHistory));
}

function loadConversationHistory() {
    const saved = localStorage.getItem('finance_tracker_ai_history');
    if (saved) {
        conversationHistory = JSON.parse(saved);
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.initAIAdvisor = initAIAdvisor;
}

console.log('✅ AI Advisor loaded');
