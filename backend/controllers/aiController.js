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
        
        // Build context from user's financial data
        let systemPrompt = `You are a helpful financial advisor for Indian users. You provide practical, actionable advice in a friendly, conversational tone. Keep responses concise (2-3 paragraphs maximum).`;
        
        if (userData) {
            systemPrompt += `\n\nUser's current financial situation:
- Total Monthly Income: ₹${userData.totalIncome || 0}
- Total Monthly Expenses: ₹${userData.totalExpenses || 0}
- Net Savings: ₹${(userData.totalIncome || 0) - (userData.totalExpenses || 0)}
- Monthly Budget: Needs ₹${userData.budget?.needs || 0}, Wants ₹${userData.budget?.wants || 0}, Savings ₹${userData.budget?.savings || 0}
- Top spending categories: ${userData.topCategories?.map(c => `${c.category} (₹${c.amount})`).join(', ') || 'None yet'}

Provide personalized advice based on THIS user's actual data. Use specific numbers from their finances. Be encouraging but honest. Always use Indian Rupees (₹).`;
        }
        
        // Check if OpenAI API key is configured
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey || apiKey.includes('your-key') || apiKey.length < 20) {
            // Fallback to pattern-based responses
            return res.json({
                success: true,
                message: generatePatternResponse(message, userData)
            });
        }
        
        // Build messages array for OpenAI
        const messages = [
            { role: 'system', content: systemPrompt }
        ];
        
        // Add conversation history (last 6 messages)
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-6);
            recentHistory.forEach(msg => {
                if (msg.type === 'user') {
                    messages.push({ role: 'user', content: msg.text });
                } else if (msg.type === 'ai') {
                    messages.push({ role: 'assistant', content: msg.text });
                }
            });
        }
        
        // Add current message
        messages.push({ role: 'user', content: message });
        
        // Call OpenAI API
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
            console.error('OpenAI API Error:', error);
            
            // Fallback to pattern response on API error
            return res.json({
                success: true,
                message: generatePatternResponse(message, userData)
            });
        }
        
        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        
        res.json({
            success: true,
            message: aiMessage
        });
        
    } catch (error) {
        console.error('AI Chat Error:', error);
        
        // Fallback to pattern response on any error
        return res.json({
            success: true,
            message: generatePatternResponse(req.body.message, req.body.userData)
        });
    }
};

// Pattern-based response generator (fallback)
function generatePatternResponse(question, userData) {
    const q = question.toLowerCase();
    
    // Response pattern handlers
    const patterns = {
        savings: {
            regex: /save|saving|save more/,
            handler: () => generateSavingsAdvice(userData)
        },
        budget: {
            regex: /budget|overspend|spending too much/,
            handler: () => generateBudgetAdvice(userData)
        },
        purchase: {
            regex: /should.*buy|purchase|afford/,
            handler: () => generatePurchaseAdvice(userData)
        },
        income: {
            regex: /income|earn|salary|make money/,
            handler: () => generateIncomeAdvice()
        },
        debt: {
            regex: /debt|loan|credit card|emi/,
            handler: () => generateDebtAdvice()
        },
        investment: {
            regex: /invest|investment|mutual fund|stock|sip/,
            handler: () => generateInvestmentAdvice()
        },
        emergency: {
            regex: /emergency|emergency fund|rainy day/,
            handler: () => generateEmergencyAdvice(userData)
        }
    };
    
    // Find matching pattern and return response
    for (const pattern of Object.values(patterns)) {
        if (q.match(pattern.regex)) {
            return pattern.handler();
        }
    }
    
    // Default general advice
    return "I'm here to help with your finances! Ask me about: saving money, budgeting, managing debt, investment basics, emergency funds, or specific purchase decisions. For the most personalized advice, make sure to track your income and expenses in the app.";
}

function generateSavingsAdvice(userData) {
    if (!userData?.totalIncome || !userData?.totalExpenses) {
        return "To save more: (1) Track all expenses for a month, (2) Identify 3 largest spending categories, (3) Reduce each by 10-15%, (4) Automate savings on payday. Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings.";
    }
    
    const currentSavings = userData.totalIncome - userData.totalExpenses;
    const savingsRate = (currentSavings / userData.totalIncome * 100).toFixed(1);
    const topCategory = userData.topCategories?.[0];
    const targetSavings = Math.round(userData.totalIncome * 0.2);
    
    const categoryAdvice = topCategory 
        ? `Your highest expense is ${topCategory.category} at ₹${topCategory.amount}. Consider reducing this by 10-15% to boost savings.`
        : 'To save more, track your top 3 spending categories and look for 10-15% reduction opportunities.';
    
    return `You're currently saving ₹${currentSavings} per month (${savingsRate}% of income). ${categoryAdvice} The 50/30/20 rule suggests saving 20% of income, which would be ₹${targetSavings} for you.`;
}

function generateBudgetAdvice(userData) {
    if (!userData?.budget) {
        return "Set a realistic monthly budget using 50/30/20: 50% for needs (rent, food, bills), 30% for wants (fun, hobbies), 20% for savings. Track every expense to stay accountable.";
    }
    
    const needsPercent = ((userData.totalExpenses ?? 0) / (userData.budget.needs ?? 1) * 100).toFixed(0);
    const wantsPercent = ((userData.totalExpenses ?? 0) / (userData.budget.wants ?? 1) * 100).toFixed(0);
    const isOverspending = needsPercent > 100 || wantsPercent > 100;
    
    const advice = isOverspending 
        ? '⚠️ You\'re overspending! Focus on cutting discretionary expenses (entertainment, dining out, shopping) by 20-30%.'
        : '✅ Good job staying within budget! Keep tracking consistently.';
    
    return `Budget Health Check: You're using ${needsPercent}% of your Needs budget and ${wantsPercent}% of your Wants budget. ${advice}`;
}

function generatePurchaseAdvice(userData) {
    if (!userData?.budget) {
        return "Before buying, use the 30-day rule: Wait 30 days. If you still want it and can afford it from your Wants budget without touching Needs or Savings, buy it. Often the urge fades.";
    }
    
    const remaining = (userData.budget.wants ?? 0) - (userData.totalExpenses ?? 0);
    return `You have ₹${remaining} remaining in your Wants budget this month. Ask yourself: (1) Is this essential? (2) Can I wait 30 days? (3) Is there a cheaper alternative? If the answer is mostly "yes," go ahead. If "no," consider waiting.`;
}

function generateIncomeAdvice() {
    return "To increase income: (1) Ask for a raise with documented achievements, (2) Develop high-demand skills (coding, design, digital marketing), (3) Start a side hustle (freelancing, consulting, online courses), (4) Invest in passive income sources. Focus on skills that command ₹500-1000/hour or more.";
}

function generateDebtAdvice() {
    return "Debt strategy: (1) List all debts with interest rates, (2) Pay minimums on everything, (3) Attack highest interest rate debt aggressively (avalanche method), (4) Consider balance transfer to lower rate, (5) Stop taking new debt. Aim to pay off credit cards within 3-6 months.";
}

function generateInvestmentAdvice() {
    return "Basic investment approach: (1) Build emergency fund first (6 months expenses), (2) Start SIP in index funds (Nifty 50, Sensex), (3) Allocate 60% equity, 30% debt, 10% gold for balanced portfolio, (4) Invest 10-15% of income consistently, (5) Don't try to time the market. Start small and stay consistent.";
}

function generateEmergencyAdvice(userData) {
    if (!userData?.totalExpenses) {
        return "Emergency fund = 6 months of living expenses. Keep it in a separate savings account or liquid fund. This protects you from job loss, medical emergencies, or unexpected expenses. Build it before investing.";
    }
    
    const target = userData.totalExpenses * 6;
    const monthlyTarget = Math.round(target / 12);
    return `Your emergency fund target should be ₹${target} (6 months of expenses). Build it in a separate savings account. Start by saving ₹${monthlyTarget} per month for 12 months, or accelerate if possible.`;
}

module.exports = exports;
