// ========== ANALYTICS FUNCTIONS ==========

// Calculate budget health score (0-100)
function calculateHealthScore(spent, budget) {
    // Start with 100 points
    let score = 100;
    
    // Deduct points for overspending
    const needsPercent = (spent.needs / budget.needs) * 100;
    const wantsPercent = (spent.wants / budget.wants) * 100;
    const savingsPercent = (spent.savings / budget.savings) * 100;
    
    // Needs overspending (critical)
    if (needsPercent > 100) {
        score -= (needsPercent - 100) * 0.5; // -0.5 per % over
    } else if (needsPercent > 90) {
        score -= (needsPercent - 90) * 0.2; // -0.2 per % over 90
    }
    
    // Wants overspending
    if (wantsPercent > 100) {
        score -= (wantsPercent - 100) * 0.3;
    } else if (wantsPercent > 90) {
        score -= (wantsPercent - 90) * 0.1;
    }
    
    // Savings shortfall
    if (savingsPercent < 50) {
        score -= (50 - savingsPercent) * 0.2;
    }
    
    // Bonus points for good habits
    if (savingsPercent >= 100) {
        score += 10; // Bonus for hitting savings goal
    }
    
    // Keep score between 0-100
    score = Math.max(0, Math.min(100, score));
    
    return Math.round(score);
}

// Get health score label and emoji
function getHealthScoreLabel(score) {
    if (score >= 90) {
        return { label: 'Excellent', emoji: '🌟', color: 'var(--color-success)' };
    } else if (score >= 75) {
        return { label: 'Good', emoji: '😊', color: 'var(--color-success)' };
    } else if (score >= 60) {
        return { label: 'Fair', emoji: '😐', color: 'var(--color-warning)' };
    } else if (score >= 40) {
        return { label: 'Needs Work', emoji: '😟', color: 'var(--color-warning)' };
    } else {
        return { label: 'Critical', emoji: '😰', color: 'var(--color-danger)' };
    }
}

// Get week-over-week comparison
function getWeekComparison(transactions) {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);
    const lastWeekEnd = new Date(thisWeekStart);
    
    const thisWeekTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= thisWeekStart && tDate <= now && t.transactionType !== 'income';
    });
    
    const lastWeekTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= lastWeekStart && tDate < thisWeekStart && t.transactionType !== 'income';
    });
    
    const thisWeekTotal = thisWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
    const lastWeekTotal = lastWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const difference = thisWeekTotal - lastWeekTotal;
    const percentChange = lastWeekTotal > 0 ? ((difference / lastWeekTotal) * 100) : 0;
    
    return {
        thisWeek: thisWeekTotal,
        lastWeek: lastWeekTotal,
        difference: difference,
        percentChange: percentChange,
        isIncrease: difference > 0
    };
}

// Get spending by category (for analytics)
function getSpendingByCategory(transactions) {
    const categoryMap = {};
    
    // Filter out income transactions
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    expenses.forEach(transaction => {
        const category = transaction.category;
        if (!categoryMap[category]) {
            categoryMap[category] = {
                category: category,
                amount: 0,
                count: 0,
                color: getCategoryColor(category),
                icon: getCategoryIcon(category)
            };
        }
        categoryMap[category].amount += transaction.amount;
        categoryMap[category].count++;
    });
    
    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount);
}

// ========== ANALYTICS SCREEN ==========
function renderAnalyticsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '📈 Analytics';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Insights and trends';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);
    
    // Empty state
    if (transactions.length === 0) {
        container.appendChild(createNoTransactionsEmpty());
        return container;
    }
    
    // Budget Health Score Card
    const healthScore = calculateHealthScore(spent, budget);
    const healthInfo = getHealthScoreLabel(healthScore);
    
    const healthCard = createCard('Budget Health Score', null, null);
    healthCard.innerHTML = `
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="font-size: 80px; margin-bottom: var(--space-md);">
                ${healthInfo.emoji}
            </div>
            <div style="font-size: var(--font-size-4xl); font-weight: var(--font-bold); color: ${healthInfo.color}; margin-bottom: var(--space-sm);">
                ${healthScore}/100
            </div>
            <div style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
                ${healthInfo.label}
            </div>
            <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--color-bg-secondary); border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                ${healthScore >= 90 ? '🎉 Excellent financial management!' : 
                  healthScore >= 75 ? '👍 Keep up the good work!' :
                  healthScore >= 60 ? '⚠️ Watch your spending carefully' :
                  healthScore >= 40 ? '🚨 Consider reviewing your budget' :
                  '⛔ Urgent: Budget adjustments needed'}
            </div>
        </div>
    `;
    container.appendChild(healthCard);
    
    // Week Comparison Card
    const comparison = getWeekComparison(transactions);
    
    const comparisonCard = createCard('Week Over Week', null, null);
    comparisonCard.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-lg); padding: var(--space-lg);">
            <div style="text-align: center;">
                <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs);">Last Week</div>
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-bold);">${formatCurrency(comparison.lastWeek)}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs);">This Week</div>
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-bold);">${formatCurrency(comparison.thisWeek)}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs);">Change</div>
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-bold); color: ${comparison.isIncrease ? 'var(--color-danger)' : 'var(--color-success)'};">
                    ${comparison.isIncrease ? '↑' : '↓'} ${Math.abs(comparison.percentChange).toFixed(1)}%
                </div>
            </div>
        </div>
    `;
    container.appendChild(comparisonCard);
    
    // Category Breakdown
    const categoryData = getSpendingByCategory(transactions);
    
    if (categoryData.length > 0) {
        const categoryCard = createCard('Top Spending Categories', null, null);
        
        const categoryList = document.createElement('div');
        categoryList.style.display = 'flex';
        categoryList.style.flexDirection = 'column';
        categoryList.style.gap = 'var(--space-md)';
        categoryList.style.padding = 'var(--space-lg)';
        
        const totalSpent = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
        
        categoryData.slice(0, 5).forEach((cat, index) => {
            const percentage = (cat.amount / totalSpent) * 100;
            
            const item = document.createElement('div');
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <span style="font-size: 24px;">${cat.icon}</span>
                        <span style="font-weight: var(--font-medium); text-transform: capitalize;">${index + 1}. ${cat.category}</span>
                        <span style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">(${cat.count} transactions)</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: var(--font-bold);">${formatCurrency(cat.amount)}</div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">${percentage.toFixed(1)}%</div>
                    </div>
                </div>
                <div style="background: var(--color-bg-tertiary); height: 8px; border-radius: var(--radius-full); overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${cat.color}; border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
                </div>
            `;
            categoryList.appendChild(item);
        });
        
        categoryCard.appendChild(categoryList);
        container.appendChild(categoryCard);
    }
    
    // Budget Breakdown Card
    const budgetCard = createCard('Budget Breakdown', '50/30/20 Rule', null);
    budgetCard.innerHTML = `
        <div style="padding: var(--space-lg);">
            ${createBudgetBar('Needs', spent.needs, budget.needs, 'var(--color-success)')}
            ${createBudgetBar('Wants', spent.wants, budget.wants, 'var(--color-warning)')}
            ${createBudgetBar('Savings', spent.savings, budget.savings, 'var(--color-info)')}
        </div>
    `;
    container.appendChild(budgetCard);
    
    return container;
}

// Helper function to create budget bar
function createBudgetBar(label, spent, budget, color) {
    const percentage = (spent / budget) * 100;
    const isOver = percentage > 100;
    
    return `
        <div style="margin-bottom: var(--space-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
                <span style="font-weight: var(--font-semibold);">${label}</span>
                <span style="font-weight: var(--font-bold); color: ${isOver ? 'var(--color-danger)' : 'var(--color-text-primary)'};">
                    ${formatCurrency(spent)} / ${formatCurrency(budget)}
                </span>
            </div>
            <div style="background: var(--color-bg-tertiary); height: 12px; border-radius: var(--radius-full); overflow: hidden; position: relative;">
                <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background: ${isOver ? 'var(--color-danger)' : color}; border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
                ${isOver ? `<div style="position: absolute; top: 0; right: 0; height: 100%; width: ${percentage - 100}%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68, 0.3) 10px, rgba(239, 68, 68, 0.3) 20px);"></div>` : ''}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: var(--space-xs); font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
                <span>${percentage.toFixed(1)}% used</span>
                <span>${formatCurrency(Math.max(0, budget - spent))} remaining</span>
            </div>
        </div>
    `;
}


