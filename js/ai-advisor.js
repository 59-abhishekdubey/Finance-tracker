// ========== AI FINANCIAL ADVISOR ==========

// AI Analysis Engine
function analyzeFinancialData() {
    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);
    
    const insights = {
        spending: analyzeSpending(transactions, budget, spent),
        patterns: analyzePatterns(transactions),
        recommendations: generateRecommendations(transactions, budget, spent),
        predictions: generatePredictions(transactions),
        alerts: generateAlerts(transactions, budget, spent)
    };
    
    return insights;
}

// Analyze spending behavior
function analyzeSpending(transactions, budget, spent) {
    const totalIncome = calculateTotalIncome();
    const totalExpenses = spent.total;
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    const categoryData = getTopCategories(transactions, 10);
    const topCategory = categoryData[0];
    const topCategoryPercent = topCategory ? (topCategory.amount / totalExpenses) * 100 : 0;
    
    const avgDailySpending = totalExpenses / 30;
    
    return {
        savingsRate: savingsRate,
        topCategory: topCategory,
        topCategoryPercent: topCategoryPercent,
        avgDailySpending: avgDailySpending,
        totalExpenses: totalExpenses,
        totalIncome: totalIncome
    };
}

// Analyze spending patterns
function analyzePatterns(transactions) {
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    if (expenses.length === 0) return { hasPatterns: false };
    
    // Day of week analysis
    const daySpending = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    expenses.forEach(t => {
        const day = new Date(t.date).getDay();
        daySpending[day] += t.amount;
        dayCount[day]++;
    });
    
    const avgByDay = Object.keys(daySpending).map(day => ({
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
        avg: dayCount[day] > 0 ? daySpending[day] / dayCount[day] : 0
    }));
    
    const highestSpendingDay = avgByDay.reduce((max, curr) => curr.avg > max.avg ? curr : max);
    
    // Transaction frequency
    const last7Days = expenses.filter(t => {
        const tDate = new Date(t.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return tDate >= weekAgo;
    }).length;
    
    return {
        hasPatterns: true,
        highestSpendingDay: highestSpendingDay,
        recentFrequency: last7Days,
        avgTransactionsPerWeek: last7Days
    };
}

// Generate personalized recommendations
function generateRecommendations(transactions, budget, spent) {
    const recommendations = [];
    
    const needsPercent = budget.needs > 0 ? (spent.needs / budget.needs) * 100 : 0;
    const wantsPercent = budget.wants > 0 ? (spent.wants / budget.wants) * 100 : 0;
    const savingsPercent = budget.savings > 0 ? (spent.savings / budget.savings) * 100 : 0;
    
    // Budget recommendations
    if (needsPercent > 90) {
        recommendations.push({
            type: 'warning',
            icon: '⚠️',
            title: 'Needs Budget Alert',
            description: `You've used ${needsPercent.toFixed(0)}% of your Needs budget. Consider reviewing essential expenses.`,
            action: 'Review spending in bills, food, and transport categories.'
        });
    }
    
    if (wantsPercent > 100) {
        recommendations.push({
            type: 'danger',
            icon: '🚨',
            title: 'Wants Overspending',
            description: `You've exceeded your Wants budget by ${(wantsPercent - 100).toFixed(0)}%. Time to cut back on discretionary spending.`,
            action: 'Reduce entertainment, shopping, and dining out expenses.'
        });
    }
    
    if (savingsPercent < 50) {
        recommendations.push({
            type: 'info',
            icon: '💡',
            title: 'Boost Your Savings',
            description: `You're only at ${savingsPercent.toFixed(0)}% of your savings goal. Small changes can make a big difference.`,
            action: 'Try the 52-week challenge: Save ₹52 this week, ₹53 next week, and so on.'
        });
    }
    
    // Category-specific recommendations
    const categoryData = getTopCategories(transactions, 10);
    const topCategory = categoryData[0];
    
    if (topCategory && (topCategory.amount / spent.total) > 0.4) {
        recommendations.push({
            type: 'warning',
            icon: '📊',
            title: `High ${topCategory.category.charAt(0).toUpperCase() + topCategory.category.slice(1)} Spending`,
            description: `${topCategory.category} accounts for ${((topCategory.amount / spent.total) * 100).toFixed(0)}% of your expenses.`,
            action: `Look for ways to reduce ${topCategory.category} costs by 10-15%.`
        });
    }
    
    // Income recommendations
    const totalIncome = calculateTotalIncome();
    const totalExpenses = spent.total;
    
    if (totalIncome > 0 && totalExpenses > totalIncome) {
        recommendations.push({
            type: 'danger',
            icon: '⛔',
            title: 'Spending Exceeds Income',
            description: `You're spending ${formatCurrency(totalExpenses - totalIncome)} more than you earn.`,
            action: 'Create an emergency plan: cut non-essential expenses immediately.'
        });
    }
    
    // Positive reinforcement
    if (savingsPercent >= 100) {
        recommendations.push({
            type: 'success',
            icon: '🎉',
            title: 'Savings Goal Achieved!',
            description: `Congratulations! You've met your savings target this month.`,
            action: 'Consider increasing your savings goal by 10% next month.'
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            type: 'success',
            icon: '👍',
            title: 'You\'re Doing Great!',
            description: 'Your finances are in good shape. Keep up the excellent work!',
            action: 'Maintain your current habits and consider setting new financial goals.'
        });
    }
    
    return recommendations;
}

// Generate predictions
function generatePredictions(transactions) {
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    if (expenses.length < 7) {
        return { canPredict: false };
    }
    
    const last7Days = getLastNDays(7);
    const last7DaysSpending = last7Days.reduce((sum, date) => {
        return sum + expenses.filter(t => t.date === date).reduce((s, t) => s + t.amount, 0);
    }, 0);
    
    const avgDailySpending = last7DaysSpending / 7;
    const projectedMonthly = avgDailySpending * 30;
    
    return {
        canPredict: true,
        avgDailySpending: avgDailySpending,
        projectedMonthly: projectedMonthly,
        projectedAnnual: projectedMonthly * 12
    };
}

// Generate alerts
function generateAlerts(transactions, budget, spent) {
    const alerts = [];
    
    const needsPercent = budget.needs > 0 ? (spent.needs / budget.needs) * 100 : 0;
    const wantsPercent = budget.wants > 0 ? (spent.wants / budget.wants) * 100 : 0;
    
    if (needsPercent >= 100) {
        alerts.push({ type: 'danger', message: 'Needs budget exceeded!', icon: '🚨' });
    } else if (needsPercent >= 80) {
        alerts.push({ type: 'warning', message: 'Approaching Needs budget limit', icon: '⚠️' });
    }
    
    if (wantsPercent >= 100) {
        alerts.push({ type: 'danger', message: 'Wants budget exceeded!', icon: '🚨' });
    }
    
    return alerts;
}

// Helper function to get top categories
function getTopCategories(transactions, limit = 10) {
    const categoryMap = {};
    
    transactions
        .filter(t => t.transactionType !== 'income')
        .forEach(t => {
            const cat = t.category || 'other';
            if (!categoryMap[cat]) {
                categoryMap[cat] = { category: cat, amount: 0, count: 0 };
            }
            categoryMap[cat].amount += t.amount;
            categoryMap[cat].count++;
        });
    
    return Object.values(categoryMap)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);
}

// Helper function to calculate total income
function calculateTotalIncome() {
    const transactions = getTransactions();
    return transactions
        .filter(t => t.transactionType === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
}

// Render AI Advisor Screen
function renderAIScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Header
    const header = document.createElement('div');
    header.style.marginBottom = '32px';
    header.innerHTML = `
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">🤖 AI Financial Advisor</h1>
        <p style="color: #6B7280;">Personalized insights and recommendations based on your spending</p>
    `;
    container.appendChild(header);
    
    const transactions = getTransactions();
    
    if (transactions.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'text-align: center; padding: 64px 24px;';
        emptyDiv.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 16px;">🤖</div>
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Not enough data yet</h2>
            <p style="color: #6B7280; margin-bottom: 24px;">Add some transactions and I'll provide personalized financial advice!</p>
            <button onclick="navigateTo('home')" style="padding: 12px 24px; background: #6366F1; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Add Transaction</button>
        `;
        container.appendChild(emptyDiv);
        return container;
    }
    
    const insights = analyzeFinancialData();
    
    // AI Summary Card
    const summaryCard = createAISummaryCard(insights);
    container.appendChild(summaryCard);
    
    // Recommendations
    const recsTitle = document.createElement('h2');
    recsTitle.style.cssText = 'font-size: 24px; font-weight: 700; margin: 32px 0 16px;';
    recsTitle.textContent = '💡 Personalized Recommendations';
    container.appendChild(recsTitle);
    
    insights.recommendations.forEach(rec => {
        container.appendChild(createRecommendationCard(rec));
    });
    
    // Spending Patterns
    if (insights.patterns.hasPatterns) {
        const patternsTitle = document.createElement('h2');
        patternsTitle.style.cssText = 'font-size: 24px; font-weight: 700; margin: 32px 0 16px;';
        patternsTitle.textContent = '📊 Spending Patterns';
        container.appendChild(patternsTitle);
        
        container.appendChild(createPatternsCard(insights.patterns));
    }
    
    // Predictions
    if (insights.predictions.canPredict) {
        const predictionsTitle = document.createElement('h2');
        predictionsTitle.style.cssText = 'font-size: 24px; font-weight: 700; margin: 32px 0 16px;';
        predictionsTitle.textContent = '🔮 Financial Forecast';
        container.appendChild(predictionsTitle);
        
        container.appendChild(createPredictionsCard(insights.predictions));
    }
    
    // Quick Tips
    const tipsCard = createQuickTipsCard();
    container.appendChild(tipsCard);
    
    return container;
}

// Create AI Summary Card
function createAISummaryCard(insights) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-bottom: 24px;';
    
    const savingsEmoji = insights.spending.savingsRate >= 20 ? '🌟' : 
                        insights.spending.savingsRate >= 10 ? '😊' : 
                        insights.spending.savingsRate > 0 ? '😐' : '😰';
    
    const formatAmt = typeof formatCurrency === 'function' ? formatCurrency : (amt) => '₹' + amt.toLocaleString('en-IN');
    
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
            <div style="font-size: 64px;">${savingsEmoji}</div>
            <div style="flex: 1;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Financial Health Score</h2>
                <p style="opacity: 0.9;">Based on your spending habits and savings rate</p>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 20px;">
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${insights.spending.savingsRate.toFixed(1)}%</div>
                <div style="font-size: 12px; opacity: 0.9;">Savings Rate</div>
            </div>
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${formatAmt(insights.spending.avgDailySpending)}</div>
                <div style="font-size: 12px; opacity: 0.9;">Avg Daily Spend</div>
            </div>
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">
                <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${insights.spending.topCategory ? insights.spending.topCategory.category : 'N/A'}</div>
                <div style="font-size: 12px; opacity: 0.9;">Top Category</div>
            </div>
        </div>
    `;
    
    return card;
}

// Create Recommendation Card
function createRecommendationCard(rec) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '16px';
    
    const colorMap = {
        success: '#10B981',
        info: '#06B6D4',
        warning: '#F59E0B',
        danger: '#EF4444'
    };
    
    const bgColorMap = {
        success: '#D1FAE5',
        info: '#CFFAFE',
        warning: '#FEF3C7',
        danger: '#FEE2E2'
    };
    
    card.innerHTML = `
        <div style="display: flex; gap: 16px;">
            <div style="font-size: 40px; flex-shrink: 0;">${rec.icon}</div>
            <div style="flex: 1;">
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: ${colorMap[rec.type]};">${rec.title}</h3>
                <p style="color: #6B7280; margin-bottom: 12px; line-height: 1.6;">${rec.description}</p>
                <div style="background: ${bgColorMap[rec.type]}; padding: 12px; border-radius: 8px; border-left: 4px solid ${colorMap[rec.type]};">
                    <strong style="color: ${colorMap[rec.type]}; font-size: 14px;">💡 Action:</strong>
                    <span style="color: #374151; font-size: 14px;"> ${rec.action}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Create Patterns Card
function createPatternsCard(patterns) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const formatAmt = typeof formatCurrency === 'function' ? formatCurrency : (amt) => '₹' + amt.toLocaleString('en-IN');
    
    card.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div style="padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Highest Spending Day</div>
                <div style="font-size: 24px; font-weight: 700; color: var(--color-primary, #6366F1);">${patterns.highestSpendingDay.day}</div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Avg: ${formatAmt(patterns.highestSpendingDay.avg)}</div>
            </div>
            <div style="padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Recent Activity</div>
                <div style="font-size: 24px; font-weight: 700; color: var(--color-success, #10B981);">${patterns.recentFrequency} transactions</div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">In the last 7 days</div>
            </div>
        </div>
    `;
    
    return card;
}

// Create Predictions Card
function createPredictionsCard(predictions) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const formatAmt = typeof formatCurrency === 'function' ? formatCurrency : (amt) => '₹' + amt.toLocaleString('en-IN');
    
    card.innerHTML = `
        <p style="color: #6B7280; margin-bottom: 20px;">Based on your recent spending patterns, here's what to expect:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${formatAmt(predictions.projectedMonthly)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Projected Monthly</div>
            </div>
            <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${formatAmt(predictions.projectedAnnual)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Projected Annual</div>
            </div>
        </div>
        <div style="margin-top: 16px; padding: 16px; background: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <span style="color: #92400E; font-size: 14px;">💡 If you reduce daily spending by just ₹100, you'll save ${formatAmt(100 * 30)} per month!</span>
        </div>
    `;
    
    return card;
}

// Create Quick Tips Card
function createQuickTipsCard() {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginTop = '32px';
    
    const tips = [
        { icon: '🎯', tip: 'Set specific savings goals with deadlines' },
        { icon: '📱', tip: 'Use the 24-hour rule before making impulse purchases' },
        { icon: '🍽️', tip: 'Meal prep to reduce food expenses by 30%' },
        { icon: '💳', tip: 'Pay with cash for discretionary spending' },
        { icon: '📊', tip: 'Review your budget weekly, not just monthly' },
        { icon: '🔄', tip: 'Automate savings transfers on payday' }
    ];
    
    card.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">💡 Quick Money-Saving Tips</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            ${tips.map(t => `
                <div style="display: flex; gap: 12px; padding: 16px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                    <span style="font-size: 24px; flex-shrink: 0;">${t.icon}</span>
                    <span style="font-size: 14px; color: #374151;">${t.tip}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

console.log('✅ AI Advisor module loaded');
