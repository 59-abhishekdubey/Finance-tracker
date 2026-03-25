// ========== PROFESSIONAL AI FINANCE ADVISOR ==========

let chatHistory = [];
let conversationContext = {
    userName: '',
    lastTopic: null,
    askedAbout: []
};

// Main AI Chat Screen
function renderAIScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    container.style.maxWidth = '900px';
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 24px; text-align: center;';
    header.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 16px; animation: float 3s ease-in-out infinite;">🤖</div>
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">AI Finance Advisor</h1>
        <p style="color: #6B7280; font-size: 16px;">Your personal financial companion - Ask me anything about money!</p>
    `;
    container.appendChild(header);
    
    // Quick Insights (collapsible)
    const insightsCard = createQuickInsights();
    container.appendChild(insightsCard);
    
    // Chat Container
    const chatCard = document.createElement('div');
    chatCard.className = 'card';
    chatCard.style.cssText = 'padding: 0; overflow: hidden; height: 550px; display: flex; flex-direction: column; box-shadow: 0 4px 16px rgba(0,0,0,0.1);';
    
    // Messages Area
    const messagesArea = document.createElement('div');
    messagesArea.id = 'ai-chat-messages';
    messagesArea.style.cssText = 'flex: 1; overflow-y: auto; padding: 24px; background: linear-gradient(180deg, #FAFBFC 0%, #F3F4F6 100%);';
    
    // Initialize or load chat
    if (chatHistory.length === 0) {
        initializeChat(messagesArea);
    } else {
        loadChatHistory(messagesArea);
    }
    
    chatCard.appendChild(messagesArea);
    
    // Quick Actions
    const quickActions = createQuickActions();
    chatCard.appendChild(quickActions);
    
    // Input Area
    const inputArea = createChatInput();
    chatCard.appendChild(inputArea);
    
    container.appendChild(chatCard);
    
    // Add styles
    addAIChatStyles();
    
    return container;
}

// Initialize chat with personalized welcome
function initializeChat(messagesArea) {
    const user = getCurrentUser();
    const userName = user ? user.name.split(' ')[0] : 'there';
    conversationContext.userName = userName;
    
    const transactions = getTransactions();
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    const budget = getBudget();
    const spent = calculateSpent(expenses);
    
    let welcomeMsg = `Hey ${userName}! 👋 I'm your AI financial advisor.\n\n`;
    
    if (transactions.length > 0) {
        welcomeMsg += `I've looked at your finances:\n`;
        welcomeMsg += `💰 You've spent ₹${spent.total.toLocaleString('en-IN')} this month\n`;
        
        const topCat = getTopCategories(expenses, 1)[0];
        if (topCat) {
            welcomeMsg += `🎯 Most spent on: ${topCat.category}\n`;
        }
        
        if (spent.wants > budget.wants) {
            welcomeMsg += `⚠️ You're over budget on wants!\n`;
        }
        
        welcomeMsg += `\n`;
    }
    
    welcomeMsg += `**I can help you with:**\n`;
    welcomeMsg += `• Making & saving money 💰\n`;
    welcomeMsg += `• Understanding your spending 📊\n`;
    welcomeMsg += `• Budget advice & tips 🎯\n`;
    welcomeMsg += `• Investment basics 📈\n`;
    welcomeMsg += `• "Should I buy X?" decisions 🤔\n\n`;
    welcomeMsg += `What's on your mind today?`;
    
    const aiMsg = createAIMessage(welcomeMsg);
    messagesArea.appendChild(aiMsg);
    
    chatHistory.push({
        type: 'ai',
        text: welcomeMsg,
        timestamp: Date.now()
    });
}

// Load chat history
function loadChatHistory(messagesArea) {
    chatHistory.forEach(msg => {
        if (msg.type === 'user') {
            messagesArea.appendChild(createUserMessage(msg.text));
        } else {
            messagesArea.appendChild(createAIMessage(msg.text));
        }
    });
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Create quick insights
function createQuickInsights() {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'margin-bottom: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; cursor: pointer;';
    
    const transactions = getTransactions();
    const insights = getQuickInsights(transactions);
    
    card.innerHTML = `
        <div onclick="toggleInsightPanel()" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">💡 Smart Insights</h3>
                <p style="opacity: 0.9; font-size: 14px;">${insights.length} insights detected - Click to view</p>
            </div>
            <span id="insight-toggle-icon" style="font-size: 20px; transition: transform 0.3s;">▼</span>
        </div>
        <div id="insight-panel" style="display: none; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
            ${insights.map(insight => `
                <div style="padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${insight.icon} ${insight.title}</div>
                    <div style="font-size: 14px; opacity: 0.9;">${insight.message}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

function toggleInsightPanel() {
    const panel = document.getElementById('insight-panel');
    const icon = document.getElementById('insight-toggle-icon');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        panel.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
}

function getQuickInsights(transactions) {
    const insights = [];
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    if (expenses.length === 0) {
        return [{ icon: '💡', title: 'Start Tracking', message: 'Add your first transaction to get personalized insights!' }];
    }
    
    const budget = getBudget();
    const spent = calculateSpent(expenses);
    const topCat = getTopCategories(expenses, 1)[0];
    
    // Budget status
    if (spent.wants > budget.wants) {
        insights.push({
            icon: '⚠️',
            title: 'Over Budget Alert',
            message: `You've exceeded wants budget by ₹${(spent.wants - budget.wants).toFixed(0)}`
        });
    }
    
    // Top category
    if (topCat && (topCat.amount / spent.total * 100) > 35) {
        insights.push({
            icon: '🎯',
            title: 'Spending Pattern',
            message: `${topCat.category} is ${((topCat.amount / spent.total) * 100).toFixed(0)}% of your spending`
        });
    }
    
    // Savings
    const savingsRate = spent.savings / budget.savings * 100;
    if (savingsRate >= 100) {
        insights.push({
            icon: '🎉',
            title: 'Savings Goal Met!',
            message: `You've achieved your savings target of ₹${budget.savings}`
        });
    } else if (savingsRate < 30) {
        insights.push({
            icon: '💰',
            title: 'Low Savings',
            message: `Only ${savingsRate.toFixed(0)}% of savings goal reached`
        });
    }
    
    return insights;
}

// Create quick actions
function createQuickActions() {
    const actions = document.createElement('div');
    actions.style.cssText = 'padding: 16px; background: white; border-top: 1px solid #E5E7EB; display: flex; gap: 8px; overflow-x: auto;';
    
    const buttons = [
        { emoji: '💰', text: 'Top expenses', question: 'What are my top 3 expenses?' },
        { emoji: '📊', text: 'Budget check', question: 'Am I staying within my budget?' },
        { emoji: '💡', text: 'Save money', question: 'How can I save more money?' },
        { emoji: '🚀', text: 'Make money', question: 'How can I make extra money?' },
        { emoji: '🎯', text: 'Money tips', question: 'Give me 5 financial tips' }
    ];

