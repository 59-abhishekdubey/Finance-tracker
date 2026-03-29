// AI Advisor functionality

let conversationHistory = [];

function initAIAdvisor() {
    loadConversationHistory();
    setupAIEventListeners();
    displayInitialMessage();
}

function setupAIEventListeners() {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');
    const quickActions = document.querySelectorAll('.ai-quick-action');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (evt) => {
            if (evt.key === 'Enter' && !evt.shiftKey) {
                evt.preventDefault();
                sendMessage();
            }
        });
    }
    
    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            if (question) {
                document.getElementById('ai-input').value = question;
                sendMessage();
            }
        });
    });
}

function displayInitialMessage() {
    if (conversationHistory.length === 0) {
        addMessageToChat('ai', '👋 Hi! I\'m your AI Financial Advisor. I can help you with budgeting, saving, spending analysis, and financial decisions. What would you like to know?');
    } else {
        // Render existing history
        conversationHistory.forEach(msg => {
            addMessageToChat(msg.type, msg.text, false);
        });
    }
}

async function sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Gather user financial data for context
        const userData = await gatherUserFinancialData();
        
        // Call AI API
        const response = await apiAIChat(message, userData, conversationHistory);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat('ai', response);
        
    } catch (error) {
        console.error('AI Chat Error:', error);
        hideTypingIndicator();
        addMessageToChat('ai', '⚠️ Sorry, I encountered an error. Please try again or rephrase your question.');
    }
}

function addMessageToChat(type, text, saveToHistory = true) {
    const chatContainer = document.getElementById('ai-chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    bubble.textContent = text;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'ai-message-time';
    timestamp.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(timestamp);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Save to history
    if (saveToHistory) {
        conversationHistory.push({ type, text, timestamp: new Date().toISOString() });
        saveConversationHistory();
    }
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('ai-chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-message-ai ai-typing-indicator';
    typingDiv.id = 'ai-typing';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(bubble);
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById('ai-typing');
    if (typing) {
        typing.remove();
    }
}

async function gatherUserFinancialData() {
    try {
        const transactions = await apiGetTransactions();
        const budget = await apiGetBudget();
        
        // Calculate totals
        const income = transactions
            .filter(t => t.transactionType === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.transactionType === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Category breakdown
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
            budget: budget,
            topCategories: topCategories
        };
        
    } catch (error) {
        console.error('Error gathering financial data:', error);
        return null;
    }
}

function saveConversationHistory() {
    localStorage.setItem('finance_tracker_ai_history', JSON.stringify(conversationHistory));
}

function loadConversationHistory() {
    const saved = localStorage.getItem('finance_tracker_ai_history');
    if (saved) {
        try {
            conversationHistory = JSON.parse(saved);
        } catch (error) {
            console.error('Failed to load conversation history:', error);
            conversationHistory = [];
        }
    }
}

function clearConversationHistory() {
    conversationHistory = [];
    localStorage.removeItem('finance_tracker_ai_history');
    document.getElementById('ai-chat-messages').innerHTML = '';
    displayInitialMessage();
}

// Export for use in other modules
if (typeof globalThis !== 'undefined') {
    globalThis.initAIAdvisor = initAIAdvisor;
    globalThis.clearConversationHistory = clearConversationHistory;
}

console.log('✅ AI Advisor module loaded');
