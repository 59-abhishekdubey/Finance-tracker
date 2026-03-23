// ========== ADVANCED AI ADVISOR WITH REAL API SUPPORT ==========

let chatHistory = [];
let conversationContext = {
    lastTopic: null,
    userProfile: null,
    questionCount: 0
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
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">AI Financial Advisor</h1>
        <p style="color: #6B7280;">Ask me anything about money, budgeting, or your finances</p>
        ${getAIProviderBadge()}
    `;
    container.appendChild(header);
    
    // Auto Insights Card
    const insightsCard = createAutoInsightsCard();
    container.appendChild(insightsCard);
    
    // Chat Container
    const chatCard = document.createElement('div');
    chatCard.className = 'card';
    chatCard.style.cssText = 'padding: 0; overflow: hidden; height: 600px; display: flex; flex-direction: column;';
    
    // Chat Messages Area
    const messagesArea = document.createElement('div');
    messagesArea.id = 'ai-chat-messages';
    messagesArea.style.cssText = 'flex: 1; overflow-y: auto; padding: 24px; background: linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%);';
    
    // Load or initialize chat
    if (chatHistory.length === 0) {
        initializeConversation(messagesArea);
    } else {
        chatHistory.forEach(msg => {
            if (msg.type === 'user') {
                messagesArea.appendChild(createUserMessage(msg.text));
            } else {
                messagesArea.appendChild(createAIMessage(msg.text));
            }
        });
    }
    
    chatCard.appendChild(messagesArea);
    
    // Quick Suggestions
    const suggestions = createQuickSuggestions();
    chatCard.appendChild(suggestions);
    
    // Input Area
    const inputArea = createInputArea();
    chatCard.appendChild(inputArea);
    
    container.appendChild(chatCard);
    
    addChatStyles();
    
    // Auto-scroll to bottom
    setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 100);
    
    return container;
}

// Get AI provider badge
function getAIProviderBadge() {
    const settings = getAISettings();
    const badges = {
        'pattern': '<span style="display: inline-block; padding: 6px 16px; background: #E0E7FF; color: #4338CA; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 8px;">✨ Pattern Matching (Free)</span>',
        'openai': '<span style="display: inline-block; padding: 6px 16px; background: #D1FAE5; color: #065F46; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 8px;">⚡ OpenAI GPT Enabled</span>',
        'anthropic': '<span style="display: inline-block; padding: 6px 16px; background: #FEE2E2; color: #991B1B; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 8px;">⚡ Claude AI Enabled</span>'
    };
    return badges[settings.provider] || badges['pattern'];
}

// Initialize conversation
function initializeConversation(messagesArea) {
    const user = getCurrentUser();
    const userName = user ? user.name.split(' ')[0] : 'there';
    
    const welcomeText = `Hey ${userName}! 👋 I'm your AI financial advisor.\n\nI can help you with:\n💰 Making more money & income strategies\n📊 Understanding your spending patterns\n💡 Saving tips & budget optimization\n📈 Investment basics & wealth building\n🎯 Purchase decisions\n\nWhat would you like to know?`;
    
    const welcomeMsg = createAIMessage(welcomeText);
    messagesArea.appendChild(welcomeMsg);
    chatHistory.push({ type: 'ai', text: welcomeText });
}

// Create auto insights card
function createAutoInsightsCard() {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'margin-bottom: 24px; cursor: pointer; transition: all 0.2s; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;';
    
    const transactions = getTransactions();
    const insights = analyzeSpendingPatterns(transactions);
    const topInsight = insights[0];
    
    card.innerHTML = `
        <div onclick="toggleInsights()" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">
                    ${topInsight ? topInsight.icon : '💡'} Auto Insights
                </h3>
                <p style="opacity: 0.9; font-size: 14px;">
                    ${insights.length} insight${insights.length === 1 ? '' : 's'} detected - Click to view
                </p>
            </div>
            <span id="insights-toggle" style="font-size: 20px; transform: rotate(0deg); transition: transform 0.3s;">▼</span>
        </div>
        <div id="insights-details" style="display: none; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
            ${insights.slice(0, 3).map(insight => `
                <div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <div style="font-size: 28px;">${insight.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px;">${insight.title}</div>
                        <div style="font-size: 14px; opacity: 0.9;">${insight.message}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

function toggleInsights() {
    const details = document.getElementById('insights-details');
    const toggle = document.getElementById('insights-toggle');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggle.style.transform = 'rotate(180deg)';
    } else {
        details.style.display = 'none';
        toggle.style.transform = 'rotate(0deg)';
    }
}

// Create quick suggestions
function createQuickSuggestions() {
    const suggestions = document.createElement('div');
    suggestions.id = 'quick-suggestions';
    suggestions.style.cssText = 'padding: 16px; background: white; border-top: 1px solid #E5E7EB; display: flex; gap: 8px; overflow-x: auto;';
    
    const suggestionButtons = [
        { label: '💰 Top expenses', question: 'What are my top expenses?' },
        { label: '📈 Save more', question: 'How can I save more money?' },
        { label: '🎯 Budget check', question: 'Am I staying within budget?' },
        { label: '💡 Money tips', question: 'Give me financial advice' },
        { label: '🚀 Make money', question: 'How can I make more money?' }
    ];
    
    suggestions.innerHTML = suggestionButtons.map(btn => 
        `<button class="suggestion-chip" onclick="sendQuickQuestion('${btn.question}')">${btn.label}</button>`
    ).join('');
    
    return suggestions;
}

// Create input area
function createInputArea() {
    const inputArea = document.createElement('div');
    inputArea.style.cssText = 'padding: 20px; background: white; border-top: 1px solid #E5E7EB;';
    
    const inputForm = document.createElement('form');
    inputForm.id = 'ai-chat-form';
    inputForm.style.cssText = 'display: flex; gap: 12px;';
    
    inputForm.innerHTML = `
        <input 
            type="text" 
            id="ai-chat-input" 
            placeholder="Ask anything: 'How can I make money?', 'Should I buy iPhone?', etc..." 
            style="flex: 1; padding: 14px 20px; border: 2px solid #E5E7EB; border-radius: 24px; font-size: 15px; outline: none; transition: all 0.2s;"
            autocomplete="off"
        />
        <button 
            type="submit" 
            id="send-btn"
            style="padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 24px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);"
        >
            Send 🚀
        </button>
    `;
    
    inputForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-chat-input');
        const question = input.value.trim();
        
        if (question) {
            sendMessage(question);
            input.value = '';
            input.focus();
        }
    };
    
    inputArea.appendChild(inputForm);
    return inputArea;
}

// Create user message
function createUserMessage(text) {
    const msg = document.createElement('div');
    msg.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 16px; animation: slideInRight 0.3s ease;';
    
    msg.innerHTML = `
        <div style="max-width: 70%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 20px; border-radius: 20px 20px 4px 20px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); font-size: 15px; word-wrap: break-word;">
            ${escapeHtml(text)}
        </div>
    `;
    
    return msg;
}

// Create AI message
function createAIMessage(text) {
    const msg = document.createElement('div');
    msg.style.cssText = 'display: flex; gap: 12px; margin-bottom: 16px; animation: slideInLeft 0.3s ease;';
    
    const formattedText = text
        .replaceAll('**', '<strong>')
        .replaceAll('**', '</strong>')
        .replaceAll('\n', '<br>');
    
    msg.innerHTML = `
        <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
            AI
        </div>
        <div style="max-width: 70%; background: white; padding: 14px 20px; border-radius: 20px 20px 20px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 15px; line-height: 1.6; word-wrap: break-word;">
            ${formattedText}
        </div>
    `;
    
    return msg;
}

// Create typing indicator
function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.style.cssText = 'display: flex; gap: 12px; margin-bottom: 16px;';
    
    indicator.innerHTML = `
        <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
            AI
        </div>
        <div style="background: white; padding: 14px 20px; border-radius: 20px 20px 20px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    return indicator;
}

// MAIN: Send message
async function sendMessage(question) {
    const messagesArea = document.getElementById('ai-chat-messages');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('ai-chat-input');
    
    // Disable input
    sendBtn.disabled = true;
    input.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    // Add user message
    const userMsg = createUserMessage(question);
    messagesArea.appendChild(userMsg);
    chatHistory.push({ type: 'user', text: question });
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Show typing
    const typingIndicator = createTypingIndicator();
    messagesArea.appendChild(typingIndicator);
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    try {
        // Get response from AI
        const response = await generateAIResponse(question);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add AI response
        const aiMsg = createAIMessage(response);
        messagesArea.appendChild(aiMsg);
        chatHistory.push({ type: 'ai', text: response });
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
    } catch (error) {
        typingIndicator.remove();
        const errorMsg = createAIMessage(`Error: ${error.message}`);
        messagesArea.appendChild(errorMsg);
    }
    
    // Re-enable input
    sendBtn.disabled = false;
    input.disabled = false;
    sendBtn.textContent = 'Send 🚀';
    input.focus();
}

// Send quick question
function sendQuickQuestion(question) {
    const input = document.getElementById('ai-chat-input');
    input.value = question;
    document.getElementById('ai-chat-form').dispatchEvent(new Event('submit'));
}

// ========== AI RESPONSE GENERATION ==========
async function generateAIResponse(question) {
    const settings = getAISettings();
    const userData = getUserFinancialData();
    
    try {
        switch (settings.provider) {
            case 'openai':
                return await callOpenAI(question, userData, settings.apiKey);
            case 'anthropic':
                return await callAnthropic(question, userData, settings.apiKey);
            default:
                return generatePatternResponse(question, userData);
        }
    } catch (error) {
        console.warn('AI API failed, falling back to pattern matching:', error);
        return generatePatternResponse(question, userData);
    }
}

// Get user's financial data
function getUserFinancialData() {
    const transactions = getTransactions();
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    const budget = getBudget();
    const spent = calculateSpent(expenses);
    const income = calculateTotalIncome(transactions);
    
    const topCats = getTopCategories(expenses, 3);
    
    return {
        totalTransactions: transactions.length,
        totalExpenses: spent.total,
        totalIncome: income,
        budget,
        spent,
        topCategories: topCats,
        conversationHistory: chatHistory.slice(-6)
    };
}

// ========== OPENAI API INTEGRATION ==========
async function callOpenAI(question, userData, apiKey) {
    if (!apiKey || apiKey.length === 0) {
        throw new Error('OpenAI API key not configured. Add it in Settings → AI Settings.');
    }
    
    const systemPrompt = `You are a helpful financial advisor. User data: Income ₹${userData.totalIncome}, Spent ₹${userData.totalExpenses}. Budget: Needs ₹${userData.budget.needs}, Wants ₹${userData.budget.wants}, Savings ₹${userData.budget.savings}. Give personalized advice in 1-2 paragraphs using ₹.`;
    
    const messages = [
        { role: 'system', content: systemPrompt },
        ...userData.conversationHistory.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
        })),
        { role: 'user', content: question }
    ];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 500,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// ========== ANTHROPIC CLAUDE API INTEGRATION ==========
async function callAnthropic(question, userData, apiKey) {
    if (!apiKey || apiKey.length === 0) {
        throw new Error('Claude API key not configured. Add it in Settings → AI Settings.');
    }
    
    const systemPrompt = `You are a friendly financial advisor. Income ₹${userData.totalIncome}, Spent ₹${userData.totalExpenses}. Budget: Needs ₹${userData.budget.needs}, Wants ₹${userData.budget.wants}, Savings ₹${userData.budget.savings}. Give advice in 1-2 paragraphs using ₹. Be encouraging.`;
    
    const messages = userData.conversationHistory
        .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));
    
    messages.push({ role: 'user', content: question });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            system: systemPrompt,
            messages
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// ========== PATTERN-BASED FALLBACK RESPONSE ==========
function generatePatternResponse(question, userData) {
    const q = question.toLowerCase();
    
    if (q.match(/make money|earn|income|side.*hustle/)) {
        return `💼 Ways to Make More:\n\n• Freelance on Fiverr/Upwork\n• Online tutoring ₹300-1000/hr\n• Delivery jobs\n• Content writing ₹1-5/word\n\nYour income: ₹${userData.totalIncome}/month\nTarget: Add ₹10K-30K/month`;
    }
    
    if (q.match(/spending|how.*spend|track/)) {
        if (userData.totalTransactions === 0) {
            return `📊 No spending tracked yet! Start adding transactions to see patterns, top categories, and trends.`;
        }
        let response = `📊 Spending: ₹${Math.round(userData.totalExpenses)}\nTransactions: ${userData.totalTransactions}\n\nTop Categories:\n`;
        userData.topCategories.forEach((cat, i) => {
            response += `${i + 1}. ${cat.category}: ₹${Math.round(cat.amount)}\n`;
        });
        return response;
    }
    
    if (q.match(/budget|overspend/)) {
        const needsP = Math.round((userData.spent.needs / userData.budget.needs) * 100);
        const wantsP = Math.round((userData.spent.wants / userData.budget.wants) * 100);
        return `🎯 Budget Status:\nNeeds: ${needsP}%\nWants: ${wantsP}%\n${wantsP > 100 ? 'Over budget on wants!' : 'On track!'}`;
    }
    
    if (q.match(/save|savings/)) {
        return `💰 Ways to Save:\n1. Cancel unused subscriptions\n2. Cook at home\n3. Automate 10% to savings\n4. Use 24-hour rule for purchases\n\nTarget: ₹${userData.budget.savings}/month`;
    }
    
    if (q.match(/invest/)) {
        return `📈 Investment Basics:\n✅ FD/RD - Safe, 6-7%\n✅ Index Funds - Low cost\n✅ SIP - Start ₹500/month\n✅ PPF - Tax benefits\n\nStart small, think long-term!`;
    }
    
    return `Ask about:\n💰 Making money\n📊 Spending habits\n🎯 Budget status\n💡 Saving tips\n📈 Investing`;
}

// ========== HELPER FUNCTIONS ==========

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function analyzeSpendingPatterns(transactions) {
    const insights = [];
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    if (expenses.length === 0) {
        return [{
            type: 'info',
            icon: '💡',
            title: 'Start Tracking',
            message: 'Add transactions to get insights!'
        }];
    }
    
    const budget = getBudget();
    const spent = calculateSpent(expenses);
    
    if (spent.wants > budget.wants) {
        insights.push({
            type: 'danger',
            icon: '⚠️',
            title: 'Wants Over Budget',
            message: `Over by ₹${Math.round(spent.wants - budget.wants)}`
        });
    }
    
    const topCat = getTopCategories(expenses, 1)[0];
    if (topCat && (topCat.amount / spent.total * 100) > 40) {
        insights.push({
            type: 'warning',
            icon: topCat.icon,
            title: `${topCat.category} High`,
            message: `${Math.round((topCat.amount / spent.total) * 100)}% of spending`
        });
    }
    
    if (spent.savings < budget.savings * 0.5) {
        insights.push({
            type: 'warning',
            icon: '💰',
            title: 'Low Savings',
            message: `Only ${Math.round((spent.savings / budget.savings) * 100)}% of goal`
        });
    }
    
    return insights;
}

// Add chat styles
function addChatStyles() {
    if (document.getElementById('chat-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'chat-styles';
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .suggestion-chip {
            padding: 10px 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        .suggestion-chip:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .suggestion-chip:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            animation: typingDot 1.4s infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
            30% { transform: translateY(-8px); opacity: 1; }
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        #ai-chat-messages::-webkit-scrollbar {
            width: 8px;
        }
        #ai-chat-messages::-webkit-scrollbar-track {
            background: #F3F4F6;
        }
        #ai-chat-messages::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 4px;
        }
        #ai-chat-messages::-webkit-scrollbar-thumb:hover {
            background: #94A3B8;
        }
        
        #ai-chat-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ AI Advisor with real API support loaded - Ready for deployment!');
