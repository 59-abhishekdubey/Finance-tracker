const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// @route   POST /api/ai/chat
// @desc    Get AI response for financial question
// @access  Private
exports.chat = async (req, res) => {
    try {
        const { message, conversationHistory, userData } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }
        
        const provider = process.env.AI_PROVIDER || 'openai';
        
        // Build context from user's financial data
        let systemPrompt = `You are a helpful financial advisor for Indian users. `;
        
        if (userData) {
            systemPrompt += `User's financial context:
- Total Income: ₹${userData.totalIncome || 0}
- Total Expenses: ₹${userData.totalExpenses || 0}
- Budget: Needs ₹${userData.budget?.needs || 0}, Wants ₹${userData.budget?.wants || 0}, Savings ₹${userData.budget?.savings || 0}
- Top spending categories: ${userData.topCategories?.map(c => c.category).join(', ') || 'None'}

Provide personalized, actionable financial advice based on this data. Use Indian Rupees (₹). Be concise and helpful.`;
        } else {
            systemPrompt += `Provide general financial advice for Indian users. Use Indian Rupees (₹). Be concise and helpful.`;
        }
        
        // Call appropriate AI provider
        let response;
        
        if (provider === 'openai') {
            response = await callOpenAI(systemPrompt, message, conversationHistory);
        } else if (provider === 'anthropic') {
            response = await callAnthropic(systemPrompt, message, conversationHistory);
        } else {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid AI provider configured' 
            });
        }
        
        res.json({
            success: true,
            message: response
        });
        
    } catch (error) {
        console.error('AI Chat Error:', error);
        
        // Return user-friendly error
        let errorMessage = 'AI service temporarily unavailable';
        
        if (error.message.includes('API key')) {
            errorMessage = 'AI service not configured properly';
        } else if (error.message.includes('quota')) {
            errorMessage = 'AI service quota exceeded';
        } else if (error.message.includes('rate limit')) {
            errorMessage = 'Too many requests. Please try again in a moment';
        }
        
        res.status(500).json({ 
            success: false, 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// OpenAI API call
async function callOpenAI(systemPrompt, userMessage, history = []) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        throw new Error('OpenAI API key not configured');
    }
    
    // Build messages array
    const messages = [
        { role: 'system', content: systemPrompt }
    ];
    
    // Add conversation history (last 6 messages)
    if (history && history.length > 0) {
        const recentHistory = history.slice(-6);
        recentHistory.forEach(msg => {
            if (msg.type === 'user') {
                messages.push({ role: 'user', content: msg.text });
            } else if (msg.type === 'ai') {
                messages.push({ role: 'assistant', content: msg.text });
            }
        });
    }
    
    // Add current message
    messages.push({ role: 'user', content: userMessage });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
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

// Anthropic Claude API call
async function callAnthropic(systemPrompt, userMessage, history = []) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
        throw new Error('Anthropic API key not configured');
    }
    
    // Build messages array (Claude format)
    const messages = [];
    
    if (history && history.length > 0) {
        const recentHistory = history.slice(-6);
        recentHistory.forEach(msg => {
            if (msg.type === 'user') {
                messages.push({ role: 'user', content: msg.text });
            } else if (msg.type === 'ai') {
                messages.push({ role: 'assistant', content: msg.text });
            }
        });
    }
    
    messages.push({ role: 'user', content: userMessage });
    
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
            messages: messages
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
    }
    
    const data = await response.json();
    return data.content[0].text;
}

module.exports = exports;
