// ========== AI CHAT LOGIC ==========

// AI response patterns and logic
const AI_PATTERNS = {
    // Should I buy patterns
    shouldBuy: {
        triggers: ['should i buy', 'can i afford', 'should i get', 'can i purchase'],
        response: function(amount, transactions, budget) {
            const todaySpent = getTodaySpending(transactions);
            const dailyBudget = budget.total / 30;
            const remaining = dailyBudget - todaySpent;
            
            if (amount > remaining) {
                return `hmm, tough call. you've already spent ${formatCurrency(todaySpent)} today, and this would put you ${formatCurrency(amount - remaining)} over your daily budget. maybe sleep on it? if you really want it, you could skip that coffee run tomorrow 😅`;
            } else if (amount > remaining * 0.7) {
                return `you technically can, but it'll use up most of your remaining budget for today (${formatCurrency(remaining)} left). if it's something you really need, go for it! otherwise, maybe wait a few days? 🤔`;
            } else {
                return `yeah, you're good! you've got ${formatCurrency(remaining)} left for today, so ${formatCurrency(amount)} is totally manageable. treat yourself! 🎉`;
            }
        }
    },
    
    // How much can I spend
    howMuchCanSpend: {
        triggers: ['how much can i spend', 'what can i spend', 'spending limit', 'budget left'],
        response: function(transactions, budget) {
            const todaySpent = getTodaySpending(transactions);
            const dailyBudget = budget.total / 30;
            const remaining = Math.max(dailyBudget - todaySpent, 0);
            
            return `you've got ${formatCurrency(remaining)} left for today! you've already spent ${formatCurrency(todaySpent)} out of your ${formatCurrency(dailyBudget)} daily budget. pace yourself and you'll be golden 💰`;
        }
    },
    
    // Am I overspending
    overspending: {
        triggers: ['am i overspending', 'spending too much', 'over budget', 'spending a lot'],
        response: function(transactions, budget) {
            const spent = calculateSpent(transactions);
            const needsPercent = (spent.needs / budget.needs) * 100;
            const wantsPercent = (spent.wants / budget.wants) * 100;
            
            if (needsPercent > 80 || wantsPercent > 80) {
                const problem = needsPercent > wantsPercent ? 'needs' : 'wants';
                return `yeah, you're pushing it a bit. your ${problem} budget is at ${Math.round(problem === 'needs' ? needsPercent : wantsPercent)}%. try to cool it for the rest of the week, maybe cook at home more or skip some impulse buys? you got this! 💪`;
            } else {
                return `nah, you're actually doing pretty well! needs at ${Math.round(needsPercent)}%, wants at ${Math.round(wantsPercent)}%. you're staying within budget. keep up the good habits! 🌟`;
            }
        }
    },
    
    // How am I doing
    howAmIDoing: {
        triggers: ['how am i doing', 'how is my budget', 'am i doing good', 'my progress'],
        response: function(transactions, budget) {
            const spent = calculateSpent(transactions);
            const totalPercent = (spent.total / budget.total) * 100;
            const weeklyTransactions = transactions.filter(t => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(t.date) >= weekAgo;
            });
            const weeklyTotal = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            return `honestly? pretty solid! you've spent ${formatCurrency(spent.total)} out of ${formatCurrency(budget.total)} this month (${Math.round(totalPercent)}%). this week you spent ${formatCurrency(weeklyTotal)} total. ${totalPercent < 70 ? "you're crushing it! 🚀" : totalPercent < 90 ? "you're on track, keep it up! 👍" : "getting close to your limit, watch out! ⚠️"}`;
        }
    },
    
    // Default fallback
    default: {
        responses: [
            "hmm, i'm not quite sure about that one. try asking me about your spending, budget, or if you should buy something! 🤖",
            "good question! i can help you with stuff like 'should i buy X', 'how much can i spend', or 'am i overspending'. what do you want to know? 💬",
            "i'm still learning! for now, i'm best at answering questions about your budget and spending habits. want to try one of those? 🎯"
        ]
    }
};

// Main AI response function
function getAIResponse(userMessage, transactions, budget) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for "should I buy" pattern with amount extraction
    for (const trigger of AI_PATTERNS.shouldBuy.triggers) {
        if (message.includes(trigger)) {
            // Try to extract amount from message
            const amountMatch = message.match(/₹?\s*(\d+)/);
            if (amountMatch) {
                const amount = parseInt(amountMatch[1]);
                return AI_PATTERNS.shouldBuy.response(amount, transactions, budget);
            } else {
                return "sure! how much is it? tell me like 'should i buy this for ₹2000' and i'll help you decide! 💭";
            }
        }
    }
    
    // Check other patterns
    for (const trigger of AI_PATTERNS.howMuchCanSpend.triggers) {
        if (message.includes(trigger)) {
            return AI_PATTERNS.howMuchCanSpend.response(transactions, budget);
        }
    }
    
    for (const trigger of AI_PATTERNS.overspending.triggers) {
        if (message.includes(trigger)) {
            return AI_PATTERNS.overspending.response(transactions, budget);
        }
    }
    
    for (const trigger of AI_PATTERNS.howAmIDoing.triggers) {
        if (message.includes(trigger)) {
            return AI_PATTERNS.howAmIDoing.response(transactions, budget);
        }
    }
    
    // Default response
    const defaultResponses = AI_PATTERNS.default.responses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Suggested starter questions
const SUGGESTED_QUESTIONS = [
    "Should I buy headphones for ₹3000?",
    "How much can I spend today?",
    "Am I overspending this week?",
    "How am I doing with my budget?"
];
