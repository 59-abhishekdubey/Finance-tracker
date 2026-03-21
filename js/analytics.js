// ========== ANALYTICS PAGE - COMPLETE WORKING VERSION ==========

// Calculate budget health score (0-100)
function calculateHealthScore(spent, budget) {
    if (!spent || !budget) return 50;
    
    let score = 100;
    
    const needsPercent = budget.needs > 0 ? (spent.needs / budget.needs) * 100 : 0;
    const wantsPercent = budget.wants > 0 ? (spent.wants / budget.wants) * 100 : 0;
    const savingsPercent = budget.savings > 0 ? (spent.savings / budget.savings) * 100 : 0;
    
    if (needsPercent > 100) score -= (needsPercent - 100) * 0.5;
    else if (needsPercent > 90) score -= (needsPercent - 90) * 0.2;
    
    if (wantsPercent > 100) score -= (wantsPercent - 100) * 0.3;
    else if (wantsPercent > 90) score -= (wantsPercent - 90) * 0.1;
    
    if (savingsPercent < 50) score -= (50 - savingsPercent) * 0.2;
    if (savingsPercent >= 100) score += 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

// Get health score label
function getHealthScoreLabel(score) {
    if (score >= 90) return { label: 'Excellent', emoji: '🌟', color: 'var(--color-success)' };
    if (score >= 75) return { label: 'Good', emoji: '😊', color: 'var(--color-success)' };
    if (score >= 60) return { label: 'Fair', emoji: '😐', color: 'var(--color-warning)' };
    if (score >= 40) return { label: 'Needs Work', emoji: '😟', color: 'var(--color-warning)' };
    return { label: 'Critical', emoji: '😰', color: 'var(--color-danger)' };
}

// Get week comparison
function getWeekComparison(transactions) {
    const now = new Date();
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeek = transactions.filter(t => {
        if (t.transactionType === 'income') return false;
        const date = new Date(t.date);
        return date >= thisWeekStart && date <= now;
    }).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const lastWeek = transactions.filter(t => {
        if (t.transactionType === 'income') return false;
        const date = new Date(t.date);
        return date >= lastWeekStart && date < thisWeekStart;
    }).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const difference = thisWeek - lastWeek;
    const percentChange = lastWeek > 0 ? (difference / lastWeek) * 100 : 0;
    
    return {
        thisWeek,
        lastWeek,
        difference,
        percentChange: Math.round(percentChange * 10) / 10,
        isIncrease: difference > 0
    };
}

// Get spending by category
function getSpendingByCategory(transactions) {
    const categoryMap = {};
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    expenses.forEach(transaction => {
        const category = transaction.category;
        
        if (!categoryMap[category]) {
            categoryMap[category] = {
                category: category,
                amount: 0,
                count: 0,
                color: typeof getCategoryColor === 'function' ? getCategoryColor(category) : '#6366F1',
                icon: typeof getCategoryIcon === 'function' ? getCategoryIcon(category) : '📦'
            };
        }
        
        categoryMap[category].amount += transaction.amount;
        categoryMap[category].count++;
    });
    
    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount);
}

// Create budget bar
function createBudgetBar(label, spent, budget, color) {
    spent = spent || 0;
    budget = budget || 1;
    
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOver = spent > budget;
    const remaining = Math.max(0, budget - spent);
    
    const formatAmount = (amount) => {
        if (typeof formatCurrency === 'function') {
            return formatCurrency(amount);
        }
        return '₹' + amount.toLocaleString('en-IN');
    };
    
    return `
        <div style="margin-bottom: var(--space-lg, 24px);">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs, 8px);">
                <span style="font-weight: var(--font-semibold, 600);">${label}</span>
                <span style="font-weight: var(--font-bold, 700); color: ${isOver ? 'var(--color-danger)' : 'inherit'};">
                    ${formatAmount(spent)} / ${formatAmount(budget)}
                </span>
            </div>
            <div style="background: var(--color-bg-tertiary, #E5E7EB); height: 12px; border-radius: var(--radius-full, 9999px); overflow: hidden;">
                <div style="width: ${percentage}%; height: 100%; background: ${isOver ? 'var(--color-danger)' : color}; transition: width 0.5s;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: var(--space-xs, 8px); font-size: var(--font-size-xs, 12px); color: var(--color-text-tertiary, #6B7280);">
                <span>${percentage.toFixed(1)}% used</span>
                <span>${formatAmount(remaining)} remaining</span>
            </div>
        </div>
    `;
}

// RENDER ANALYTICS SCREEN
function renderAnalyticsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl, 32px)';
    
    const title = document.createElement('h1');
    title.textContent = '📈 Analytics';
    title.style.marginBottom = 'var(--space-xs, 8px)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Insights and trends';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    let transactions = [];
    let budget = { needs: 7500, wants: 4500, savings: 3000, total: 15000 };
    let spent = { needs: 0, wants: 0, savings: 0, total: 0 };
    
    try {
        if (typeof getTransactions === 'function') transactions = getTransactions();
        if (typeof getBudget === 'function') budget = getBudget();
        if (typeof calculateSpent === 'function') spent = calculateSpent(transactions);
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    if (transactions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.cssText = 'text-align: center; padding: 64px 24px;';
        emptyState.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 16px;">📊</div>
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">No transactions yet</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 24px;">Start adding transactions to see analytics</p>
        `;
        container.appendChild(emptyState);
        return container;
    }
    
    const healthScore = calculateHealthScore(spent, budget);
    const healthInfo = getHealthScoreLabel(healthScore);
    
    const healthCard = document.createElement('div');
    healthCard.className = 'card';
    healthCard.style.cssText = 'text-align: center; padding: var(--space-xl, 32px); margin-bottom: var(--space-xl, 24px);';
    
    let feedback = '🎉 Excellent financial management!';
    if (healthScore < 90) feedback = '👍 Keep up the good work!';
    if (healthScore < 75) feedback = '⚠️ Watch your spending carefully';
    if (healthScore < 60) feedback = '🚨 Consider reviewing your budget';
    if (healthScore < 40) feedback = '⛔ Urgent: Budget adjustments needed';
    
    healthCard.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 16px;">${healthInfo.emoji}</div>
        <div style="font-size: 48px; font-weight: 700; color: ${healthInfo.color}; margin-bottom: 8px;">${healthScore}/100</div>
        <div style="font-size: 20px; color: var(--color-text-secondary); margin-bottom: 24px;">${healthInfo.label}</div>
        <div style="padding: 16px; background: var(--color-bg-secondary); border-radius: var(--radius-md); font-size: 14px; color: var(--color-text-secondary);">
            ${feedback}
        </div>
    `;
    container.appendChild(healthCard);
    
    const comparison = getWeekComparison(transactions);
    
    const comparisonCard = document.createElement('div');
    comparisonCard.className = 'card';
    comparisonCard.style.marginBottom = 'var(--space-xl, 24px)';
    
    const formatAmt = (amt) => typeof formatCurrency === 'function' ? formatCurrency(amt) : '₹' + amt.toLocaleString('en-IN');
    
    comparisonCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 24px;">Week Over Week</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px;">
            <div style="text-align: center;">
                <div style="font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 8px;">LAST WEEK</div>
                <div style="font-size: 24px; font-weight: 700;">${formatAmt(comparison.lastWeek)}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 8px;">THIS WEEK</div>
                <div style="font-size: 24px; font-weight: 700;">${formatAmt(comparison.thisWeek)}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 8px;">CHANGE</div>
                <div style="font-size: 24px; font-weight: 700; color: ${comparison.isIncrease ? 'var(--color-danger, #EF4444)' : 'var(--color-success, #10B981)'};">
                    ${comparison.isIncrease ? '↑' : '↓'} ${Math.abs(comparison.percentChange)}%
                </div>
            </div>
        </div>
    `;
    container.appendChild(comparisonCard);
    
    const categoryData = getSpendingByCategory(transactions);
    
    if (categoryData.length > 0) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'card';
        categoryCard.style.marginBottom = 'var(--space-xl, 24px)';
        
        const totalSpent = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
        
        let html = '<h2 style="font-size: 20px; font-weight: 700; margin-bottom: 24px;">Top Categories</h2>';
        
        categoryData.slice(0, 5).forEach((cat, idx) => {
            const pct = (cat.amount / totalSpent) * 100;
            html += `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 24px;">${cat.icon}</span>
                            <span style="font-weight: 600; text-transform: capitalize;">${idx + 1}. ${cat.category}</span>
                            <span style="font-size: 12px; color: var(--color-text-tertiary);">(${cat.count})</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700;">${formatAmt(cat.amount)}</div>
                            <div style="font-size: 12px; color: var(--color-text-tertiary);">${pct.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div style="background: var(--color-bg-tertiary); height: 8px; border-radius: 9999px; overflow: hidden;">
                        <div style="width: ${pct}%; height: 100%; background: ${cat.color}; transition: width 0.5s;"></div>
                    </div>
                </div>
            `;
        });
        
        categoryCard.innerHTML = html;
        container.appendChild(categoryCard);
    }
    
    const budgetCard = document.createElement('div');
    budgetCard.className = 'card';
    budgetCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Budget Breakdown</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 24px;">50/30/20 Rule</p>
        <div>
            ${createBudgetBar('Needs', spent.needs, budget.needs, 'var(--color-success)')}
            ${createBudgetBar('Wants', spent.wants, budget.wants, 'var(--color-warning)')}
            ${createBudgetBar('Savings', spent.savings, budget.savings, 'var(--color-info)')}
        </div>
    `;
    container.appendChild(budgetCard);
    
    return container;
}
// Get top spending categories
function getTopCategories(transactions, limit = 5) {
    if (!transactions) {
        if (typeof getTransactions === 'function') {
            transactions = getTransactions();
        } else {
            return [];
        }
    }
    
    const categoryMap = {};
    
    // Filter out income
    const expenses = transactions.filter(t => t.transactionType !== 'income');
    
    expenses.forEach(transaction => {
        const category = transaction.category;
        
        if (!categoryMap[category]) {
            categoryMap[category] = {
                category: category,
                amount: 0,
                count: 0,
                color: typeof getCategoryColor === 'function' ? getCategoryColor(category) : '#6366F1',
                icon: typeof getCategoryIcon === 'function' ? getCategoryIcon(category) : '📦'
            };
        }
        
        categoryMap[category].amount += transaction.amount;
        categoryMap[category].count++;
    });
    
    return Object.values(categoryMap)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);
}